import { useState, useEffect } from "react";
import { CourseContent, Summary, SummaryStyle, SummaryLanguage, Question, QuestionDifficulty, HistoryItem } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopControls from "@/components/TopControls";
import MainTabs from "@/components/MainTabs";
import { v4 as uuidv4 } from "uuid";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SummaryLanguage>("chinese");

  const handleApiKeySet = () => {
    setIsKeySet(true);
  };
  
  // Auto-save content to history
  useEffect(() => {
    if (courseContent?.rawContent && !isLoading) {
      saveToHistory(courseContent.rawContent);
    }
  }, [courseContent?.summary]);

  const saveToHistory = (content: string) => {
    try {
      // Get existing history
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      // Check if content already exists in history
      const exists = history.some(item => item.rawContent === content);
      
      if (!exists) {
        // Generate title from content (first line or first few words)
        let title = content.split('\n')[0] || '';
        if (title.length > 40) {
          title = title.substring(0, 40) + '...';
        }
        
        // Add new item to history
        const newItem: HistoryItem = {
          id: uuidv4(),
          rawContent: content,
          timestamp: new Date(),
          title: title
        };
        
        // Add to beginning of array
        history = [newItem, ...history];
        
        // Limit history to 20 items
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        localStorage.setItem('content_history', JSON.stringify(history));
      }
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  const handleContentLoaded = async (
    content: string, 
    generateQuiz: boolean = true,
    quizDifficulty: QuestionDifficulty = "medium",
    language: SummaryLanguage = "chinese"
  ) => {
    if (!isKeySet) {
      toast.error("请先设置OpenAI API密钥");
      return;
    }

    setIsLoading(true);
    setCurrentLanguage(language);
    
    // Initialize with proper CourseContent structure
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });

    try {
      // Always generate summary
      const summary = await openaiService.generateSummary(content, "casual", language);
      
      // Start generating questions in parallel
      setIsGeneratingQuiz(true);
      const questionsPromise = openaiService.generateQuestions(
        content,
        quizDifficulty,
        30,
        language
      );
      
      // Update with summary first
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
      
      setActiveTab("summary");
      toast.success("课程摘要已生成");

      // Wait for questions to be ready
      try {
        const questions = await questionsPromise;
        
        setCourseContent(prev => {
          if (!prev) return null;
          return { ...prev, questions };
        });
        
        toast.success("测验题已生成");
      } catch (error) {
        console.error("Error generating quiz:", error);
        toast.error("生成测验题时出错");
      } finally {
        setIsGeneratingQuiz(false);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("处理内容时出错，请重试");
      setIsGeneratingQuiz(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleChange = async (style: SummaryStyle) => {
    if (!courseContent?.rawContent) return;
    
    setIsLoading(true);
    try {
      const summary = await openaiService.generateSummary(
        courseContent.rawContent, 
        style,
        currentLanguage
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
    } catch (error) {
      console.error("Error changing summary style:", error);
      toast.error("更改摘要样式时出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: SummaryLanguage) => {
    if (!courseContent?.rawContent) return;
    setCurrentLanguage(language);
    
    setIsLoading(true);
    try {
      const summary = await openaiService.generateSummary(
        courseContent.rawContent, 
        courseContent.summary?.style || "casual",
        language
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
    } catch (error) {
      console.error("Error changing summary language:", error);
      toast.error("更改摘要语言时出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!courseContent?.rawContent) return;
    
    setIsGeneratingQuiz(true);
    try {
      const questions = await openaiService.generateQuestions(
        courseContent.rawContent,
        "medium",
        30,
        currentLanguage
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, questions };
      });
      setActiveTab("quiz");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleDifficultyChange = async (difficulty: QuestionDifficulty) => {
    if (!courseContent?.rawContent) return;
    
    setIsGeneratingQuiz(true);
    try {
      const questions = await openaiService.generateQuestions(
        courseContent.rawContent,
        difficulty,
        30,
        currentLanguage
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, questions };
      });
    } catch (error) {
      console.error("Error generating quiz with new difficulty:", error);
      toast.error("生成不同难度的测验题时出错");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectHistoryContent = (content: string) => {
    setActiveTab("upload");
    
    // Don't regenerate content when selecting from history
    // Just set the content directly if we already have it stored
    const historyString = localStorage.getItem('content_history') || '[]';
    const history: HistoryItem[] = JSON.parse(historyString);
    const historyItem = history.find(item => item.rawContent === content);
    
    if (historyItem) {
      // We don't want to regenerate things when selecting from history
      setCourseContent({ 
        rawContent: content,
        summary: null,
        questions: null
      });
      toast.info("已从历史记录加载内容，请点击处理按钮继续");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {isKeySet && <AppSidebar onSelectContent={handleSelectHistoryContent} />}
          
          <div className="flex-1">
            <Header />

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
              {!isKeySet ? (
                <div className="flex justify-center my-8">
                  <ApiKeyInput onApiKeySet={handleApiKeySet} />
                </div>
              ) : (
                <>
                  <TopControls 
                    onSelectHistoryContent={handleSelectHistoryContent} 
                    onApiKeySet={handleApiKeySet} 
                  />
                  
                  <MainTabs 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    courseContent={courseContent}
                    isLoading={isLoading}
                    isGeneratingQuiz={isGeneratingQuiz}
                    handleContentLoaded={handleContentLoaded}
                    handleStyleChange={handleStyleChange}
                    handleLanguageChange={handleLanguageChange}
                    handleGenerateQuiz={handleGenerateQuiz}
                    handleDifficultyChange={handleDifficultyChange}
                  />
                </>
              )}
            </main>

            <Footer />
          </div>
        </div>
      </SidebarProvider>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
