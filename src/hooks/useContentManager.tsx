import { useState } from 'react';
import { CourseContent, QuestionDifficulty, UserAnswer, HistoryItem, StyleSummaries } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export const useContentManager = () => {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SummaryLanguage>("chinese");
  const [currentQuizDifficulty, setCurrentQuizDifficulty] = useState<QuestionDifficulty>("medium");
  const [summaryProgress, setSummaryProgress] = useState<number>(0);
  const [quizProgress, setQuizProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const saveToHistory = (
    content: string, 
    summaries: any, 
    questions: any, 
    courseId: string
  ) => {
    try {
      if (!content || !courseId) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === content);
      
      const firstLine = content.split('\n')[0] || '';
      let title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      
      // Create summaries object in the right format
      const summariesObj: StyleSummaries = {};
      if (summaries.casual) summariesObj.casual = summaries.casual.content;
      if (summaries.academic) summariesObj.academic = summaries.academic.content;
      if (summaries.basic) summariesObj.basic = summaries.basic.content;
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          title: title,
          courseId: courseId,
          summaries: summariesObj,
          questions: questions
        };
      } else {
        const newItem: HistoryItem = {
          id: uuidv4(),
          rawContent: content,
          timestamp: new Date(),
          title: title,
          courseId: courseId,
          summaries: summariesObj,
          questions: questions
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

  const generateAllQuestions = async (content: string) => {
    try {
      setIsGeneratingQuiz(true);
      setQuizProgress(20);
      
      const [easyQuestionsPromise, mediumQuestionsPromise, hardQuestionsPromise] = [
        openaiService.generateQuestions(content, "easy", 10, "chinese"),
        openaiService.generateQuestions(content, "medium", 10, "chinese"),
        openaiService.generateQuestions(content, "hard", 10, "chinese")
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

  const generateAllSummaryStyles = async (content: string) => {
    try {
      setSummaryProgress(20);
      
      // Generate all three styles in parallel
      const [casualSummaryPromise, academicSummaryPromise, basicSummaryPromise] = [
        openaiService.generateSummary(content, "casual", "chinese"),
        openaiService.generateSummary(content, "academic", "chinese"),
        openaiService.generateSummary(content, "basic", "chinese")
      ];
      
      const [casualSummary, academicSummary, basicSummary] = await Promise.all([
        casualSummaryPromise,
        academicSummaryPromise,
        basicSummaryPromise
      ]);
      
      setSummaryProgress(100);
      toast.success("所有风格的摘要已生成");
      
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

  const handleContentLoaded = async (
    content: string,
    generateQuiz: boolean = true,
    courseId: string
  ) => {
    if (!openaiService.getApiKey()) {
      toast.error("请先设置OpenAI API密钥");
      return false;
    }

    setIsLoading(true);
    setSummaryProgress(0);
    setQuizProgress(0);
    
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });

    try {
      // Start both processes in parallel
      const summariesPromise = generateAllSummaryStyles(content);
      const questionsPromise = generateQuiz ? generateAllQuestions(content) : Promise.resolve(null);
      
      // Wait for both to complete
      const [summaries, questions] = await Promise.all([summariesPromise, questionsPromise]);
      
      if (summaries) {
        // Use the casual style as the default displayed summary
        setCourseContent({
          rawContent: content,
          summary: {
            content: summaries.casual.content,
            style: "casual",
            allStyles: {
              casual: summaries.casual.content,
              academic: summaries.academic.content,
              basic: summaries.basic.content
            }
          },
          questions
        });
        
        // Save to history
        saveToHistory(content, summaries, questions, courseId);
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
  };

  return {
    courseContent,
    isLoading,
    isGeneratingQuiz,
    summaryProgress,
    quizProgress,
    activeTab,
    setActiveTab,
    handleContentLoaded,
    handleStyleChange,
    setCurrentQuizDifficulty,
    handleRegenerateQuiz
  };
};
