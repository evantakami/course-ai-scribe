
import { useState } from 'react';
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useQuizGeneration = () => {
  const [quizProgress, setQuizProgress] = useState<number>(0);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

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

  return {
    quizProgress,
    isGeneratingQuiz,
    generateAllQuestions,
  };
};
