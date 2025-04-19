
import { useState } from "react";
import { Question, UserAnswer } from "@/types";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

export const useQuizSubmission = (
  currentQuestion: Question | undefined,
  onSaveAnswer: (newAnswer: UserAnswer) => void
) => {
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [customExplanation, setCustomExplanation] = useState<string | null>(null);

  const handleSubmitAnswer = (selectedOption: number | null) => {
    if (selectedOption === null || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      question: currentQuestion.text,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      timestamp: new Date()
    };
    
    onSaveAnswer(newAnswer);
    
    if (!isCorrect) {
      saveToMistakeCollection(newAnswer);
    }
  };

  const saveToMistakeCollection = (answer: UserAnswer) => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      let mistakes = JSON.parse(mistakesString);
      
      const existingIndex = mistakes.findIndex((m: UserAnswer) => m.questionId === answer.questionId);
      
      if (existingIndex >= 0) {
        mistakes[existingIndex] = answer;
      } else {
        mistakes.push(answer);
      }
      
      localStorage.setItem('mistake_collection', JSON.stringify(mistakes));
    } catch (error) {
      console.error("Failed to save to mistake collection:", error);
    }
  };

  const handleGenerateWhyWrong = async (selectedOption: number) => {
    if (!currentQuestion) return;
    
    setIsLoadingExplanation(true);
    try {
      const explanation = await openaiService.evaluateAnswer(
        currentQuestion, 
        selectedOption
      );
      setCustomExplanation(explanation);
    } catch (error) {
      console.error("Failed to generate explanation:", error);
      toast.error("生成解析失败，请重试");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return {
    isLoadingExplanation,
    customExplanation,
    setCustomExplanation,
    handleSubmitAnswer,
    handleGenerateWhyWrong,
    saveToMistakeCollection
  };
};
