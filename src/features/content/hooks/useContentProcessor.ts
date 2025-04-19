import { useState } from 'react';
import { CourseContent, SummaryLanguage, SummaryStyle } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useContentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateAllSummaryStyles = async (
    content: string,
    language: SummaryLanguage
  ) => {
    try {
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
      
      return {
        style: "casual",
        content: casualSummary.content,
        language,
        allStyles: {
          casual: casualSummary.content,
          academic: academicSummary.content,
          basic: basicSummary.content
        }
      };
    } catch (error) {
      console.error("Error generating summaries:", error);
      toast.error("生成摘要时出错");
      return null;
    }
  };

  const generateQuestions = async (
    content: string,
    language: SummaryLanguage
  ) => {
    try {
      // Generate all difficulty levels in parallel
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

      return {
        easy: easyQuestions,
        medium: mediumQuestions,
        hard: hardQuestions
      };
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
      return null;
    }
  };

  const processContent = async (
    content: string,
    language: SummaryLanguage
  ): Promise<CourseContent> => {
    setIsProcessing(true);
    try {
      // Generate both summaries and questions in parallel
      const [summaryPromise, questionsPromise] = [
        generateAllSummaryStyles(content, language),
        generateQuestions(content, language)
      ];
      
      const [summary, questions] = await Promise.all([
        summaryPromise,
        questionsPromise
      ]);
      
      return {
        rawContent: content,
        summary,
        questions
      };
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错");
      return {
        rawContent: content,
        summary: null,
        questions: null
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSummary = async (
    content: string,
    style: SummaryStyle,
    language: SummaryLanguage
  ) => {
    setIsProcessing(true);
    try {
      const summary = await generateAllSummaryStyles(content, language);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("生成摘要时出错");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processContent,
    generateSummary
  };
};
