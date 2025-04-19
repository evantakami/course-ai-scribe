import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CourseContent, SummaryLanguage, SummaryStyle, QuestionDifficulty, UserAnswer, Course } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useAppState = () => {
  // Core state
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  // UI state
  const [summaryProgress, setSummaryProgress] = useState<number>(0);
  const [quizProgress, setQuizProgress] = useState<number>(0);
  
  // Configuration state
  const [currentLanguage, setCurrentLanguage] = useState<SummaryLanguage>("chinese");
  const [currentQuizDifficulty, setCurrentQuizDifficulty] = useState<QuestionDifficulty>("medium");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Initialize user profile and default course
  useEffect(() => {
    initializeUserProfile();
  }, []);

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

  // Generate summaries for all styles
  const generateAllSummaryStyles = async (content: string, language: SummaryLanguage) => {
    try {
      setSummaryProgress(20);
      
      // Generate all three styles in parallel
      const [casualSummaryPromise, academicSummaryPromise, basicSummaryPromise] = [
        openaiService.generateSummary(content, "casual", language),
        openaiService.generateSummary(content, "academic", language),
        openaiService.generateSummary(content, "basic", language)
      ];
      
      const [casualSummary, academicSummary, basicSummary] = await Promise.all([
        casualSummaryPromise,
        academicSummaryPromise,
        basicSummaryPromise
      ]);
      
      setSummaryProgress(100);
      toast.success("所有风格的摘要已生成");
      
      // Return all summary styles at once
      return {
        casual: casualSummary,
        academic: academicSummary,
        basic: basicSummary
      };
    } catch (error) {
      console.error("Error generating summaries:", error);
      toast.error("生成摘要时出错");
      return null;
    }
  };

  // Generate questions for all difficulty levels
  const generateAllQuestions = async (content: string, language: SummaryLanguage) => {
    try {
      setIsGeneratingQuiz(true);
      setQuizProgress(20);
      
      const [easyQuestionsPromise, mediumQuestionsPromise, hardQuestionsPromise] = [
        openaiService.generateQuestions(content, "easy", 10, language),
        openaiService.generateQuestions(content, "medium", 10, language),
        openaiService.generateQuestions(content, "hard", 10, language)
      ];
      
      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
        easyQuestionsPromise,
        mediumQuestionsPromise,
        hardQuestionsPromise
      ]);

      setQuizProgress(100);
      toast.success("全部难度的测验题已生成");
      
      return {
        easy: easyQuestions,
        medium: mediumQuestions,
        hard: hardQuestions
      };
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
      return null;
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Processes the content to generate summaries and quizzes
  const handleContentLoaded = async (
    content: string,
    generateQuiz: boolean = true,
    quizDifficulty: QuestionDifficulty = "medium",
    language: SummaryLanguage = "chinese"
  ) => {
    if (!openaiService.getApiKey()) {
      toast.error("请先设置OpenAI API密钥");
      return;
    }

    setIsLoading(true);
    setCurrentLanguage(language);
    setSummaryProgress(0);
    setQuizProgress(0);
    
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });

    try {
      // Start both processes in parallel
      const summariesPromise = generateAllSummaryStyles(content, language);
      const questionsPromise = generateQuiz ? generateAllQuestions(content, language) : Promise.resolve(null);
      
      // Wait for both to complete
      const [summaries, questions] = await Promise.all([summariesPromise, questionsPromise]);
      
      if (summaries) {
        // Use the casual style as the default displayed summary
        setCourseContent({
          rawContent: content,
          summary: {
            content: summaries.casual.content,
            style: "casual",
            language,
            allStyles: {
              casual: summaries.casual.content,
              academic: summaries.academic.content,
              basic: summaries.basic.content
            }
          },
          questions
        });
        
        // Save to history
        saveToHistory(content, summaries, questions, language, selectedCourseId);
      }
      
      return true;
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错，请重试");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save content to history
  const saveToHistory = (
    rawContent: string, 
    summaries: any, 
    questions: any, 
    language: SummaryLanguage,
    courseId: string
  ) => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      let history = JSON.parse(historyString);
      
      const firstLine = rawContent.split('\n')[0] || '';
      let title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      
      const existingIndex = history.findIndex(item => item.rawContent === rawContent);
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          title,
          courseId,
          summaries: {
            casual: summaries.casual.content,
            academic: summaries.academic.content,
            basic: summaries.basic.content
          },
          questions,
          language
        };
      } else {
        const newItem = {
          id: uuidv4(),
          rawContent,
          timestamp: new Date(),
          title,
          courseId,
          summaries: {
            casual: summaries.casual.content,
            academic: summaries.academic.content,
            basic: summaries.basic.content
          },
          questions,
          language
        };
        
        history = [newItem, ...history];
        
        if (history.length > 50) {
          history = history.slice(0, 50);
        }
      }
      
      localStorage.setItem('content_history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  // Change summary style
  const handleStyleChange = async (style: SummaryStyle) => {
    if (!courseContent?.summary) return;
    
    // If we already have all styles, just update the current style without API call
    if (courseContent.summary.allStyles && courseContent.summary.allStyles[style]) {
      setCourseContent(prev => {
        if (!prev || !prev.summary || !prev.summary.allStyles) return prev;
        
        return {
          ...prev,
          summary: {
            ...prev.summary,
            style: style,
            content: prev.summary.allStyles[style]
          }
        };
      });
      return;
    }
    
    // Otherwise, we need to generate this style
    setIsLoading(true);
    try {
      const styleSummary = await openaiService.generateSummary(
        courseContent.rawContent || "", 
        style,
        currentLanguage
      );
      
      setCourseContent(prev => {
        if (!prev || !prev.summary) return prev;
        
        // Create or update allStyles object
        const updatedAllStyles = {
          ...(prev.summary.allStyles || {}),
          [style]: styleSummary.content
        };
        
        return {
          ...prev,
          summary: {
            ...prev.summary,
            style: style,
            content: styleSummary.content,
            allStyles: updatedAllStyles
          }
        };
      });
    } catch (error) {
      console.error("Error changing summary style:", error);
      toast.error("更改摘要样式时出错");
    } finally {
      setIsLoading(false);
    }
  };

  // Simple language change
  const handleLanguageChange = (language: SummaryLanguage) => {
    setCurrentLanguage(language);
  };

  // Generate quiz
  const handleGenerateQuiz = async () => {
    if (!courseContent?.rawContent) return;
    setActiveTab("quiz");
    
    try {
      const questions = await generateAllQuestions(courseContent.rawContent, currentLanguage);
      if (questions) {
        setCourseContent(prev => {
          if (!prev) return null;
          return { ...prev, questions };
        });
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
    }
  };

  // Regenerate quiz for a specific difficulty
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

  // Save user's quiz answers to history
  const saveUserAnswersToHistory = (userAnswers: UserAnswer[]) => {
    try {
      if (!courseContent?.rawContent) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history = JSON.parse(historyString);
      
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
        saveIncorrectToMistakeCollection(updatedAnswers);
        updateUserStats();
      }
    } catch (error) {
      console.error("Failed to save user answers to history:", error);
    }
  };

  // Save incorrect answers to mistake collection
  const saveIncorrectToMistakeCollection = (userAnswers: UserAnswer[]) => {
    try {
      const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);
      if (incorrectAnswers.length === 0) return;
      
      const detailedIncorrectAnswers = incorrectAnswers.map(answer => {
        let questionDetails;
        
        if (courseContent?.questions?.easy) {
          questionDetails = courseContent.questions.easy.find(q => q.id === answer.questionId);
        }
        if (!questionDetails && courseContent?.questions?.medium) {
          questionDetails = courseContent.questions.medium.find(q => q.id === answer.questionId);
        }
        if (!questionDetails && courseContent?.questions?.hard) {
          questionDetails = courseContent.questions.hard.find(q => q.id === answer.questionId);
        }
        
        return {
          ...answer,
          question: questionDetails?.text || answer.question,
          options: questionDetails?.options || answer.options,
          correctAnswer: questionDetails?.correctAnswer ?? answer.correctAnswer,
          explanation: questionDetails?.explanation || answer.explanation,
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

  // Update user statistics
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
              if (answer.isCorrect) correctAnswers++;
              totalQuestions++;
            });
          }
        });
        
        const updatedProfile = {
          ...userProfile,
          quizStats: { totalQuizzes, correctAnswers, totalQuestions }
        };
        
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to update user stats:", error);
    }
  };

  return {
    courseContent,
    isLoading,
    isGeneratingQuiz,
    activeTab,
    summaryProgress,
    quizProgress,
    currentLanguage,
    currentQuizDifficulty,
    selectedCourseId,
    setActiveTab,
    handleContentLoaded,
    handleStyleChange,
    handleLanguageChange,
    handleGenerateQuiz,
    handleRegenerateQuiz,
    setCurrentQuizDifficulty,
    saveUserAnswersToHistory,
    onSelectCourse: setSelectedCourseId
  };
};
