
import { useState, useEffect } from "react";
import { CourseContent, Summary, SummaryStyle, SummaryLanguage, Question, QuestionDifficulty, HistoryItem, UserAnswer } from "@/types";
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
  const [currentQuizDifficulty, setCurrentQuizDifficulty] = useState<QuestionDifficulty>("medium");

  const handleApiKeySet = () => {
    setIsKeySet(true);
  };
  
  useEffect(() => {
    if (courseContent?.rawContent && !isLoading) {
      saveToHistory(courseContent);
    }
  }, [courseContent?.summary, courseContent?.questions]);

  const saveToHistory = (content: CourseContent) => {
    try {
      if (!content.rawContent) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === content.rawContent);
      
      let title = content.rawContent.split('\n')[0] || '';
      if (title.length > 40) {
        title = title.substring(0, 40) + '...';
      }
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          summaries: content.summary ? {
            ...(history[existingIndex].summaries || {}),
            [content.summary.style]: content.summary.content
          } : history[existingIndex].summaries,
          questions: content.questions || history[existingIndex].questions,
          language: content.summary?.language || history[existingIndex].language
        };
      } else {
        const newItem: HistoryItem = {
          id: uuidv4(),
          rawContent: content.rawContent,
          timestamp: new Date(),
          title: title,
          summaries: content.summary ? { [content.summary.style]: content.summary.content } : undefined,
          questions: content.questions,
          language: content.summary?.language
        };
        
        history = [newItem, ...history];
        
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
      }
      
      localStorage.setItem('content_history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  const saveUserAnswersToHistory = (userAnswers: UserAnswer[]) => {
    try {
      if (!courseContent?.rawContent) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === courseContent.rawContent);
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          userAnswers
        };
        
        localStorage.setItem('content_history', JSON.stringify(history));
      }
    } catch (error) {
      console.error("Failed to save user answers to history:", error);
    }
  };

  const generateAllQuestions = async (content: string, language: SummaryLanguage) => {
    try {
      setIsGeneratingQuiz(true);
      
      const [easyQuestionsPromise, mediumQuestionsPromise, hardQuestionsPromise] = [
        openaiService.generateQuestions(content, "easy", 10, language),
        openaiService.generateQuestions(content, "medium", 10, language),
        openaiService.generateQuestions(content, "hard", 10, language)
      ];
      
      const mediumQuestions = await mediumQuestionsPromise;
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          questions: {
            medium: mediumQuestions
          }
        };
      });
      
      const [easyQuestions, hardQuestions] = await Promise.all([
        easyQuestionsPromise,
        hardQuestionsPromise
      ]);
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          questions: {
            easy: easyQuestions,
            medium: mediumQuestions,
            hard: hardQuestions
          }
        };
      });
      
      toast.success("全部难度的测验题已生成");
      return true;
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
      return false;
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const generateAllSummaries = async (content: string, language: SummaryLanguage) => {
    try {
      const styles: SummaryStyle[] = ["casual", "academic", "basic"];
      
      // Create promises for all styles
      const summaryPromises = styles.map(style => 
        openaiService.generateSummary(content, style, language)
      );
      
      // Process the casual style first for immediate display
      const casualSummary = await summaryPromises[0];
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary: casualSummary };
      });
      
      toast.success("通俗易懂摘要已生成");
      
      // Process the remaining styles
      const [_, academicSummary, basicSummary] = await Promise.all(summaryPromises);
      
      // We don't need to update the UI with these since the CourseSummary component
      // will handle displaying them when they're ready through the onStyleChange prop
      
      return true;
    } catch (error) {
      console.error("Error generating summaries:", error);
      toast.error("生成摘要时出错");
      return false;
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
    
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });

    try {
      // Start both summary and quiz generation in parallel
      const summaryPromise = generateAllSummaries(content, language);
      const quizPromise = generateQuiz ? generateAllQuestions(content, language) : null;
      
      // Start both processes but don't wait for them
      summaryPromise;
      quizPromise;
      
      // Switch to summary tab immediately
      setActiveTab("summary");
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错，请重试");
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
      // Generate all summaries in the new language
      generateAllSummaries(courseContent.rawContent, language);
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
    setActiveTab("quiz");
    
    try {
      await generateAllQuestions(courseContent.rawContent, currentLanguage);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleDifficultyChange = (difficulty: QuestionDifficulty) => {
    setCurrentQuizDifficulty(difficulty);
  };

  const handleRegenerateQuiz = async (difficulty: QuestionDifficulty) => {
    if (!courseContent?.rawContent) return;
    
    setIsGeneratingQuiz(true);
    try {
      const newQuestions = await openaiService.generateQuestions(
        courseContent.rawContent,
        difficulty,
        10,
        currentLanguage
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        
        const updatedQuestions = {
          ...(prev.questions || {}),
          [difficulty]: newQuestions
        };
        
        return { 
          ...prev, 
          questions: updatedQuestions
        };
      });
      
      toast.success(`已重新生成${difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '普通' : '困难'}难度的测验题`);
    } catch (error) {
      console.error("Error regenerating quiz:", error);
      toast.error("重新生成测验题时出错");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectHistoryContent = (content: string) => {
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });
    setActiveTab("upload");
    toast.info("已从历史记录加载内容，请点击处理按钮继续");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {isKeySet && <AppSidebar 
            onSelectContent={handleSelectHistoryContent}
            saveUserAnswersToHistory={saveUserAnswersToHistory}
          />}
          
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
                    saveUserAnswersToHistory={saveUserAnswersToHistory}
                    handleRegenerateQuiz={handleRegenerateQuiz}
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
