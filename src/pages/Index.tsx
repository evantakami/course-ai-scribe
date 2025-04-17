import { useState, useEffect } from "react";
import { CourseContent, Summary, SummaryStyle, SummaryLanguage, Question, QuestionDifficulty, HistoryItem, UserAnswer, Course } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopControls from "@/components/TopControls";
import MainTabs from "@/components/MainTabs";
import { v4 as uuidv4 } from "uuid";
import CourseCatalog from "@/components/courses/CourseCatalog";
import CourseHistory from "@/components/courses/CourseHistory";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SummaryLanguage>("chinese");
  const [currentQuizDifficulty, setCurrentQuizDifficulty] = useState<QuestionDifficulty>("medium");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [view, setView] = useState<"catalog" | "history" | "content">("content");

  const handleApiKeySet = () => {
    setIsKeySet(true);
  };
  
  useEffect(() => {
    initializeUserProfile();
  }, []);
  
  useEffect(() => {
    if (courseContent?.rawContent && !isLoading) {
      saveToHistory(courseContent);
    }
  }, [courseContent?.summary, courseContent?.questions]);

  const initializeUserProfile = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (!userProfileString) {
        const defaultCourse: Course = {
          id: uuidv4(),
          name: "通用课程",
          color: "bg-blue-500",
          timestamp: new Date()
        };
        
        const userProfile = {
          courses: [defaultCourse],
          quizStats: {
            totalQuizzes: 0,
            correctAnswers: 0,
            totalQuestions: 0
          }
        };
        
        localStorage.setItem('user_profile', JSON.stringify(userProfile));
        setSelectedCourseId(defaultCourse.id);
      } else {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && userProfile.courses.length > 0) {
          setSelectedCourseId(userProfile.courses[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to initialize user profile:", error);
    }
  };

  const saveToHistory = (content: CourseContent) => {
    try {
      if (!content.rawContent || !selectedCourseId) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === content.rawContent);
      
      const firstLine = content.rawContent.split('\n')[0] || '';
      let title = firstLine;
      
      if (title.length > 60) {
        title = title.substring(0, 60) + '...';
      }
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          title: title,
          courseId: selectedCourseId,
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
          courseId: selectedCourseId,
          summaries: content.summary ? { [content.summary.style]: content.summary.content } : undefined,
          questions: content.questions,
          language: content.summary?.language
        };
        
        history = [newItem, ...history];
        
        if (history.length > 50) {
          history = history.slice(0, 50);
        }
      }
      
      localStorage.setItem('content_history', JSON.stringify(history));
      
      updateUserStats();
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  const updateUserStats = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        
        const historyString = localStorage.getItem('content_history') || '[]';
        const history = JSON.parse(historyString);
        
        let totalQuizzes = 0;
        let correctAnswers = 0;
        let totalQuestions = 0;
        
        history.forEach(item => {
          if (item.userAnswers && item.userAnswers.length) {
            totalQuizzes++;
            
            item.userAnswers.forEach(answer => {
              if (answer.isCorrect) {
                correctAnswers++;
              }
              totalQuestions++;
            });
          }
        });
        
        const updatedProfile = {
          ...userProfile,
          quizStats: {
            totalQuizzes,
            correctAnswers,
            totalQuestions
          }
        };
        
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to update user stats:", error);
    }
  };

  const saveUserAnswersToHistory = (userAnswers: UserAnswer[]) => {
    try {
      if (!courseContent?.rawContent) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === courseContent.rawContent);
      
      const updatedAnswers = userAnswers.map(answer => ({
        ...answer,
        courseId: selectedCourseId,
        timestamp: answer.timestamp || new Date()
      }));
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          userAnswers: updatedAnswers
        };
        
        localStorage.setItem('content_history', JSON.stringify(history));
        
        saveIncorrectToMistakeCollection(updatedAnswers, courseContent);
        
        updateUserStats();
      }
    } catch (error) {
      console.error("Failed to save user answers to history:", error);
    }
  };

  const saveIncorrectToMistakeCollection = (userAnswers: UserAnswer[], content: CourseContent) => {
    try {
      const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);
      
      if (incorrectAnswers.length === 0) return;
      
      const detailedIncorrectAnswers = incorrectAnswers.map(answer => {
        let questionDetails: Question | undefined;
        
        if (content.questions?.easy) {
          questionDetails = content.questions.easy.find(q => q.id === answer.questionId);
        }
        
        if (!questionDetails && content.questions?.medium) {
          questionDetails = content.questions.medium.find(q => q.id === answer.questionId);
        }
        
        if (!questionDetails && content.questions?.hard) {
          questionDetails = content.questions.hard.find(q => q.id === answer.questionId);
        }
        
        return {
          ...answer,
          question: questionDetails?.text,
          options: questionDetails?.options,
          correctAnswer: questionDetails?.correctAnswer,
          explanation: questionDetails?.explanation,
          courseId: selectedCourseId,
          timestamp: new Date()
        };
      });
      
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const existingMistakes: UserAnswer[] = JSON.parse(mistakesString);
      
      const updatedMistakes = [...existingMistakes];
      
      detailedIncorrectAnswers.forEach(newMistake => {
        const existingIndex = updatedMistakes.findIndex(m => m.questionId === newMistake.questionId);
        if (existingIndex >= 0) {
          updatedMistakes[existingIndex] = newMistake;
        } else {
          updatedMistakes.push(newMistake);
        }
      });
      
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes.slice(0, 100)));
    } catch (error) {
      console.error("Failed to save to mistake collection:", error);
    }
  };

  const loadHistoryItem = () => {
    try {
      const historyItemString = sessionStorage.getItem('selected_history_item');
      if (historyItemString) {
        const historyItem: HistoryItem = JSON.parse(historyItemString);
        
        const loadedContent: CourseContent = {
          rawContent: historyItem.rawContent,
          summary: null,
          questions: null
        };
        
        if (historyItem.summaries && Object.keys(historyItem.summaries).length > 0) {
          const style = Object.keys(historyItem.summaries)[0] as SummaryStyle;
          loadedContent.summary = {
            content: historyItem.summaries[style],
            style: style,
            language: historyItem.language || "chinese"
          };
          setCurrentLanguage(historyItem.language || "chinese");
        }
        
        if (historyItem.questions) {
          console.log("Original history item questions:", JSON.stringify(historyItem.questions));
          
          const updatedQuestions = {
            easy: historyItem.questions.easy?.map(q => ({
              ...q,
              id: typeof q.id === 'string' ? parseInt(q.id, 10) || Number(new Date()) : q.id,
              explanation: q.explanation || ""
            })),
            medium: historyItem.questions.medium?.map(q => ({
              ...q,
              id: typeof q.id === 'string' ? parseInt(q.id, 10) || Number(new Date()) : q.id,
              explanation: q.explanation || ""
            })),
            hard: historyItem.questions.hard?.map(q => ({
              ...q,
              id: typeof q.id === 'string' ? parseInt(q.id, 10) || Number(new Date()) : q.id,
              explanation: q.explanation || ""
            }))
          };
          
          console.log("Loaded questions with explanations:", updatedQuestions);
          loadedContent.questions = updatedQuestions;
        }
        
        setCourseContent(loadedContent);
        
        if (historyItem.courseId) {
          setSelectedCourseId(historyItem.courseId);
        }
        
        sessionStorage.removeItem('selected_history_item');
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load history item:", error);
      return false;
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
      
      const summaryPromises = styles.map(style => 
        openaiService.generateSummary(content, style, language)
      );
      
      const casualSummary = await summaryPromises[0];
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary: casualSummary };
      });
      
      toast.success("通俗易懂摘要已生成");
      
      await Promise.all(summaryPromises);
      
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
    language: SummaryLanguage = "chinese",
    courseId: string = selectedCourseId
  ) => {
    if (!isKeySet) {
      toast.error("请先设置OpenAI API密钥");
      return;
    }

    const loaded = loadHistoryItem();
    if (loaded) {
      setActiveTab("summary");
      return;
    }

    setIsLoading(true);
    setCurrentLanguage(language);
    setSelectedCourseId(courseId);
    
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });

    try {
      const summaryPromise = generateAllSummaries(content, language);
      const quizPromise = generateQuiz ? generateAllQuestions(content, language) : null;
      
      await summaryPromise;
      if (quizPromise) await quizPromise;
      
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
    setView("content");
    toast.info("已加载内容，请点击处理按钮继续");
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView("history");
  };

  const renderContent = () => {
    if (!isKeySet) {
      return (
        <div className="flex justify-center my-8">
          <ApiKeyInput onApiKeySet={handleApiKeySet} />
        </div>
      );
    }

    if (view === "catalog") {
      return (
        <CourseCatalog onCourseSelect={handleCourseSelect} />
      );
    }

    if (view === "history") {
      return (
        <CourseHistory 
          courseId={selectedCourseId}
          onBackClick={() => setView("catalog")}
          onSelectContent={handleSelectHistoryContent}
        />
      );
    }

    return (
      <>
        <TopControls 
          onSelectHistoryContent={handleSelectHistoryContent} 
          onApiKeySet={handleApiKeySet} 
          onViewCourses={() => setView("catalog")}
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
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onViewCourses={() => setView("catalog")}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {renderContent()}
          </main>
          <Footer />
        </div>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
