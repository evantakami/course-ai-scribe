import { useState, useEffect } from 'react';
import { UserAnswer } from "@/types";
import { toast } from "sonner";

export const useMistakes = (courseId?: string) => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);

  // Load mistakes when component mounts or courseId changes
  useEffect(() => {
    loadMistakes();
  }, [courseId]);

  // Load mistakes from localStorage and filter by course if specified
  const loadMistakes = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const allMistakes = JSON.parse(mistakesString);
      
      if (courseId) {
        // Filter mistakes by courseId if specified
        setMistakes(allMistakes.filter((m: UserAnswer) => m.courseId === courseId));
      } else {
        setMistakes(allMistakes);
      }
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

  const updateMistakes = (newAnswers: UserAnswer[]) => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const allMistakes = JSON.parse(mistakesString);
      
      // Update attempts for existing mistakes
      const updatedAllMistakes = allMistakes.map((mistake: UserAnswer) => {
        const newAnswer = newAnswers.find(a => a.questionId === mistake.questionId);
        if (!newAnswer) return mistake;
        
        // Update attempts
        const attempts = mistake.attempts || [];
        attempts.push({
          isCorrect: newAnswer.isCorrect,
          timestamp: new Date()
        });
        
        return {
          ...mistake,
          attempts
        };
      });
      
      // Save all mistakes back to localStorage
      localStorage.setItem('mistake_collection', JSON.stringify(updatedAllMistakes));
      
      // Update state with filtered mistakes if courseId is specified
      if (courseId) {
        setMistakes(updatedAllMistakes.filter(m => m.courseId === courseId));
      } else {
        setMistakes(updatedAllMistakes);
      }
      
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      if (correctCount > 0) {
        toast.success(`本次练习正确: ${correctCount} 道题`);
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
