
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
      console.log("Generating all summary styles for content:", content.substring(0, 100) + "...");
      
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
      
      console.log("Successfully generated all summary styles");
      
      return {
        style: "casual" as SummaryStyle,
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
      toast.error("生成摘要时出错，请检查API密钥或网络连接");
      return null;
    }
  };

  const generateQuestions = async (
    content: string,
    language: SummaryLanguage
  ) => {
    try {
      console.log("Generating all question difficulty levels");
      
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

      console.log("Successfully generated all question difficulty levels");
      
      return {
        easy: easyQuestions,
        medium: mediumQuestions,
        hard: hardQuestions
      };
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错，请检查API密钥或网络连接");
      return null;
    }
  };

  const processContent = async (
    content: string,
    language: SummaryLanguage
  ): Promise<CourseContent> => {
    setIsProcessing(true);
    try {
      console.log("Processing content: Generating summaries and questions");
      
      // Generate both summaries and questions in parallel
      const [summaryPromise, questionsPromise] = [
        generateAllSummaryStyles(content, language),
        generateQuestions(content, language)
      ];
      
      const [summary, questions] = await Promise.all([
        summaryPromise,
        questionsPromise
      ]);
      
      console.log("Content processing complete:", !!summary, !!questions);
      
      return {
        rawContent: content,
        summary,
        questions
      };
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错，请检查API密钥或网络连接");
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
      console.log(`Generating ${style} summary in ${language}`);
      const summary = await generateAllSummaryStyles(content, language);
      console.log("Summary generation complete:", !!summary);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("生成摘要时出错，请检查API密钥或网络连接");
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
