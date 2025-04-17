
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
      // Generate summary
      const summary = await openaiService.generateSummary(content, "casual", language);
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
      
      setActiveTab("summary");
      toast.success("课程摘要已生成");

      // Generate quizzes for all difficulties if requested
      if (generateQuiz) {
        setIsGeneratingQuiz(true);
        
        try {
          // Create an object to store all difficulty levels
          const allQuestions: {
            easy?: Question[];
            medium?: Question[];
            hard?: Question[];
          } = {};
          
          // Generate medium difficulty questions first (most common)
          const mediumQuestions = await openaiService.generateQuestions(
            content,
            "medium",
            10,
            language
          );
          allQuestions.medium = mediumQuestions;
          
          // Update with medium questions first
          setCourseContent(prev => {
            if (!prev) return null;
            return { ...prev, questions: allQuestions };
          });
          
          // Generate easy questions
          const easyQuestions = await openaiService.generateQuestions(
            content,
            "easy",
            10,
            language
          );
          allQuestions.easy = easyQuestions;
          
          // Update with easy questions
          setCourseContent(prev => {
            if (!prev) return null;
            return { 
              ...prev, 
              questions: {
                ...(prev.questions || {}),
                easy: easyQuestions
              }
            };
          });
          
          // Generate hard questions
          const hardQuestions = await openaiService.generateQuestions(
            content,
            "hard",
            10,
            language
          );
          allQuestions.hard = hardQuestions;
          
          // Final update with all questions
          setCourseContent(prev => {
            if (!prev) return null;
            return { 
              ...prev, 
              questions: {
                ...(prev.questions || {}),
                hard: hardQuestions
              }
            };
          });
          
          toast.success("全部难度的测验题已生成");
        } catch (error) {
          console.error("Error generating quiz:", error);
          toast.error("生成测验题时出错");
        } finally {
          setIsGeneratingQuiz(false);
        }
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
    setActiveTab("quiz");
    
    try {
      // Create an object to store all difficulty levels
      const allQuestions: {
        easy?: Question[];
        medium?: Question[];
        hard?: Question[];
      } = {};
      
      // Generate medium difficulty questions first
      const mediumQuestions = await openaiService.generateQuestions(
        courseContent.rawContent,
        "medium",
        10,
        currentLanguage
      );
      allQuestions.medium = mediumQuestions;
      
      // Update with medium questions first
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, questions: allQuestions };
      });
      
      // Generate easy questions
      const easyQuestions = await openaiService.generateQuestions(
        courseContent.rawContent,
        "easy",
        10,
        currentLanguage
      );
      
      // Update with easy questions
      setCourseContent(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          questions: {
            ...(prev.questions || {}),
            easy: easyQuestions
          }
        };
      });
      
      // Generate hard questions
      const hardQuestions = await openaiService.generateQuestions(
        courseContent.rawContent,
        "hard",
        10,
        currentLanguage
      );
      
      // Final update with all questions
      setCourseContent(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          questions: {
            ...(prev.questions || {}),
            hard: hardQuestions
          }
        };
      });
      
      toast.success("全部难度的测验题已生成");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
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
      // Generate new questions for the specified difficulty
      const newQuestions = await openaiService.generateQuestions(
        courseContent.rawContent,
        difficulty,
        10,
        currentLanguage
      );
      
      // Update only the questions for the specified difficulty
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
