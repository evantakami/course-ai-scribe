
import { useState } from 'react';
import { Question, QuestionDifficulty, SummaryLanguage } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useQuizGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = async (
    content: string,
    difficulty: QuestionDifficulty,
    language: SummaryLanguage
  ): Promise<Question[] | null> => {
    setIsGenerating(true);
    try {
      const questions = await openaiService.generateQuestions(
        content,
        difficulty,
        10,
        language
      );
      return questions;
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("生成测验题时出错");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllDifficulties = async (
    content: string,
    language: SummaryLanguage
  ) => {
    setIsGenerating(true);
    try {
      const [easy, medium, hard] = await Promise.all([
        generateQuestions(content, "easy", language),
        generateQuestions(content, "medium", language),
        generateQuestions(content, "hard", language)
      ]);

      return {
        easy,
        medium,
        hard
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateQuestions,
    generateAllDifficulties
  };
};
