import { useState } from 'react';
import { CourseContent, SummaryLanguage, SummaryStyle, QuestionDifficulty, UserAnswer } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useContentManager = () => {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SummaryLanguage>("chinese");
  const [currentQuizDifficulty, setCurrentQuizDifficulty] = useState<QuestionDifficulty>("medium");
  const [summaryProgress, setSummaryProgress] = useState<number>(0);
  const [quizProgress, setQuizProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("upload");

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

  const generateAllSummaryStyles = async (content: string, language: SummaryLanguage) => {
    try {
      setSummaryProgress(20);
      
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
    quizDifficulty: QuestionDifficulty = "medium",
    language: SummaryLanguage = "chinese",
    courseId: string
  ) => {
    if (!content) {
      console.error("No content provided to handleContentLoaded");
      return false;
    }
    
    if (!openaiService.getApiKey()) {
      console.error("No OpenAI API key found");
      toast.error("请先设置OpenAI API密钥");
      return false;
    }

    console.log("Processing content:", content.substring(0, 50) + "...");
    console.log("Language:", language, "Course ID:", courseId);
    
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
      const summariesPromise = generateAllSummaryStyles(content, language);
      const questionsPromise = generateQuiz ? generateAllQuestions(content, language) : Promise.resolve(null);
      
      const [summaries, questions] = await Promise.all([summariesPromise, questionsPromise]);
      
      console.log("Content processing complete. Summaries:", !!summaries, "Questions:", !!questions);
      
      if (summaries) {
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
        
        console.log("Updated courseContent with summaries and questions");
        return true;
      } else {
        console.error("Failed to generate summaries");
        setCourseContent({
          rawContent: content,
          summary: null,
          questions
        });
        return false;
      }
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错，请重试");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: SummaryLanguage) => {
    setCurrentLanguage(language);
  };

  const handleStyleChange = async (style: SummaryStyle) => {
    if (!courseContent?.summary) return;
    
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
    
    setIsLoading(true);
    try {
      const styleSummary = await openaiService.generateSummary(
        courseContent.rawContent || "", 
        style,
        currentLanguage
      );
      
      setCourseContent(prev => {
        if (!prev || !prev.summary) return prev;
        
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

  return {
    courseContent,
    isLoading,
    isGeneratingQuiz,
    currentLanguage,
    currentQuizDifficulty,
    summaryProgress,
    quizProgress,
    activeTab,
    setActiveTab,
    handleContentLoaded,
    handleStyleChange,
    handleLanguageChange,
    handleGenerateQuiz,
    handleRegenerateQuiz,
    setCurrentQuizDifficulty
  };
};
