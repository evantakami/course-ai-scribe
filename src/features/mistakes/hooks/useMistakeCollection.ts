
import { useState, useEffect } from 'react';
import { UserAnswer } from "@/types";
import { toast } from "sonner";

export const useMistakeCollection = (courseId?: string) => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [selectedMistake, setSelectedMistake] = useState<UserAnswer | null>(null);

  useEffect(() => {
    loadMistakes();
  }, [courseId]); // Added courseId as a dependency

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

  const deleteMistake = (questionId: number) => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const allMistakes = JSON.parse(mistakesString);
      
      // Remove the mistake from all mistakes
      const updatedAllMistakes = allMistakes.filter((m: UserAnswer) => m.questionId !== questionId);
      localStorage.setItem('mistake_collection', JSON.stringify(updatedAllMistakes));
      
      // Update the state with filtered mistakes
      if (courseId) {
        setMistakes(updatedAllMistakes.filter((m: UserAnswer) => m.courseId === courseId));
      } else {
        setMistakes(updatedAllMistakes);
      }
      
      if (selectedMistake?.questionId === questionId) {
        setSelectedMistake(null);
      }
      
      toast.success("已从错题本中删除");
    } catch (error) {
      console.error("Failed to delete mistake:", error);
      toast.error("删除失败");
    }
  };

  const clearAllMistakes = () => {
    try {
      if (courseId) {
        // Only clear mistakes for this course
        const mistakesString = localStorage.getItem('mistake_collection') || '[]';
        const allMistakes = JSON.parse(mistakesString);
        const otherMistakes = allMistakes.filter((m: UserAnswer) => m.courseId !== courseId);
        localStorage.setItem('mistake_collection', JSON.stringify(otherMistakes));
      } else {
        // Clear all mistakes
        localStorage.removeItem('mistake_collection');
      }
      
      setMistakes([]);
      setSelectedMistake(null);
      toast.success("已清空错题本");
    } catch (error) {
      console.error("Failed to clear mistakes:", error);
      toast.error("清空错题本失败");
    }
  };

  return {
    mistakes,
    selectedMistake,
    setSelectedMistake,
    deleteMistake,
    clearAllMistakes
  };
};
