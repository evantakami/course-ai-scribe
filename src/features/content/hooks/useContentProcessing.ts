
import { useState } from 'react';
import { CourseContent, SummaryLanguage, QuestionDifficulty } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useContentProcessing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const generateAllQuestions = async (content: string, language: SummaryLanguage) => {
    try {
      setIsGeneratingQuiz(true);
      
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

  const generateAllSummaries = async (content: string, language: SummaryLanguage) => {
    try {
      const casualSummary = await openaiService.generateSummary(content, "casual", language);
      toast.success("通俗易懂摘要已生成");
      return casualSummary;
    } catch (error) {
      console.error("Error generating summaries:", error);
      toast.error("生成摘要时出错");
      return null;
    }
  };

  const processContent = async (
    content: string,
    generateQuiz: boolean,
    language: SummaryLanguage,
    courseId: string,
    onSuccess: (content: CourseContent) => void
  ) => {
    setIsLoading(true);
    
    try {
      const summary = await generateAllSummaries(content, language);
      
      const initialContent: CourseContent = {
        rawContent: content,
        summary,
        questions: null
      };
      
      onSuccess(initialContent);
      
      if (generateQuiz) {
        const questions = await generateAllQuestions(content, language);
        if (questions) {
          onSuccess({
            ...initialContent,
            questions
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isGeneratingQuiz,
    processContent
  };
};
