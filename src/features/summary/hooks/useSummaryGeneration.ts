
import { useState } from 'react';
import { CourseContent, Summary, SummaryStyle } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useSummaryGeneration = () => {
  const [summaryProgress, setSummaryProgress] = useState<number>(0);

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

  return {
    summaryProgress,
    generateAllSummaryStyles,
  };
};
