
import { useState } from 'react';
import { CourseContent, SummaryStyle } from "@/types";
import { toast } from "sonner";
import { useSummaryGeneration } from "@/features/summary/hooks/useSummaryGeneration";
import { useQuizGeneration } from "@/features/quiz/hooks/useQuizGeneration";
import { useHistoryManagement } from "@/features/history/hooks/useHistoryManagement";
import { openaiService } from "@/services/openaiService";

export const useContentManager = () => {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const { summaryProgress, generateAllSummaryStyles } = useSummaryGeneration();
  const { quizProgress, isGeneratingQuiz, generateAllQuestions } = useQuizGeneration();
  const { saveToHistory } = useHistoryManagement();

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
        setCourseContent({
          rawContent: content,
          summary: {
            content: summaries.casual.content,
            style: "casual",
            language: "chinese", // Default language is Chinese
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
            content: prev.summary.allStyles[style] as string
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
  };
};
