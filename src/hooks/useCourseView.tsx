
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Course } from '@/types';
import { toast } from "sonner";

export const useCourseView = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [view, setView] = useState<"catalog" | "history" | "content">("content");
  const [activeTab, setActiveTab] = useState<string>("upload");

  useEffect(() => {
    initializeUserProfile();
  }, []);

  const initializeUserProfile = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (!userProfileString) {
        const defaultCourse: Course = {
          id: uuidv4(),
          name: "通用课程",
          color: "bg-blue-500",
          timestamp: new Date()
        };
        
        const userProfile = {
          courses: [defaultCourse],
          quizStats: {
            totalQuizzes: 0,
            correctAnswers: 0,
            totalQuestions: 0
          }
        };
        
        localStorage.setItem('user_profile', JSON.stringify(userProfile));
        setSelectedCourseId(defaultCourse.id);
      } else {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && userProfile.courses.length > 0) {
          setSelectedCourseId(userProfile.courses[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to initialize user profile:", error);
    }
  };

  const handleSelectHistoryContent = (content: string) => {
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });
    setActiveTab("upload");
    setView("content");
    toast.info("已加载内容，请点击处理按钮继续");
  };

  return {
    selectedCourseId,
    setSelectedCourseId,
    view,
    setView,
    activeTab,
    setActiveTab,
    handleSelectHistoryContent
  };
};
