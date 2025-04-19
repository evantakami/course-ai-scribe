
import { useState, useEffect } from 'react';
import { UserAnswer } from "@/types";
import { toast } from "sonner";

export const useMistakeCollection = () => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [selectedMistake, setSelectedMistake] = useState<UserAnswer | null>(null);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const parsed = JSON.parse(mistakesString);
      
      // Ensure each mistake has a courseId
      const userProfileString = localStorage.getItem('user_profile');
      let defaultCourseId = "";
      
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && userProfile.courses.length > 0) {
          defaultCourseId = userProfile.courses[0].id;
        }
      }

      const updatedMistakes = parsed.map((mistake: UserAnswer) => {
        if (!mistake.courseId) {
          return { ...mistake, courseId: defaultCourseId };
        }
        return mistake;
      });

      setMistakes(updatedMistakes);
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
    } catch (error) {
      console.error("Failed to load mistakes:", error);
      setMistakes([]);
    }
  };

  const deleteMistake = (questionId: number) => {
    try {
      const updatedMistakes = mistakes.filter(m => m.questionId !== questionId);
      setMistakes(updatedMistakes);
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
      toast.success("已从错题本中删除");
      
      if (selectedMistake?.questionId === questionId) {
        setSelectedMistake(null);
      }
    } catch (error) {
      console.error("Failed to delete mistake:", error);
      toast.error("删除失败");
    }
  };

  const clearAllMistakes = () => {
    try {
      localStorage.removeItem('mistake_collection');
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
