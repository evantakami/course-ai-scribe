
import { useState, useEffect } from 'react';
import { UserAnswer } from "@/types";
import { toast } from "sonner";

export const useMistakes = () => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);

  // Load mistakes when component mounts
  useEffect(() => {
    loadMistakes();
  }, []);

  // Load mistakes from localStorage
  const loadMistakes = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const parsed = JSON.parse(mistakesString);
      setMistakes(parsed);
    } catch (error) {
      console.error("Failed to load mistakes:", error);
      setMistakes([]);
    }
  };

  // Delete a specific mistake
  const deleteMistake = (questionId: number) => {
    try {
      const updatedMistakes = mistakes.filter(m => m.questionId !== questionId);
      setMistakes(updatedMistakes);
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
      toast.success("已从错题本中删除");
    } catch (error) {
      console.error("Failed to delete mistake:", error);
      toast.error("删除失败");
    }
  };

  // Clear all mistakes
  const clearAllMistakes = () => {
    try {
      localStorage.removeItem('mistake_collection');
      setMistakes([]);
      setIsPracticing(false);
      toast.success("已清空错题本");
    } catch (error) {
      console.error("Failed to clear mistakes:", error);
      toast.error("清空错题本失败");
    }
  };

  // Update mistakes after practice
  const updateMistakes = (newAnswers: UserAnswer[]) => {
    try {
      // Filter out correctly answered questions
      const correctAnswers = newAnswers.filter(answer => answer.isCorrect);
      
      if (correctAnswers.length > 0) {
        // Remove correct answers from mistake collection
        const updatedMistakes = mistakes.filter(
          mistake => !correctAnswers.some(a => a.questionId === mistake.questionId)
        );
        
        setMistakes(updatedMistakes);
        localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
        
        toast.success(`恭喜！已掌握 ${correctAnswers.length} 道题目`);
      }
    } catch (error) {
      console.error("Failed to update mistakes:", error);
      toast.error("更新错题本失败");
    }
  };

  return {
    mistakes,
    isPracticing,
    setIsPracticing,
    deleteMistake,
    clearAllMistakes,
    updateMistakes
  };
};
