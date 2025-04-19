
import { useState } from 'react';
import { CourseContent, SummaryLanguage, SummaryStyle } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useContentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateSummary = async (
    content: string,
    style: SummaryStyle,
    language: SummaryLanguage
  ) => {
    setIsProcessing(true);
    try {
      const summary = await openaiService.generateSummary(content, style, language);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("生成摘要时出错");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const processContent = async (
    content: string,
    language: SummaryLanguage
  ): Promise<CourseContent> => {
    setIsProcessing(true);
    try {
      const summary = await generateSummary(content, "casual", language);
      
      return {
        rawContent: content,
        summary,
        questions: null
      };
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
