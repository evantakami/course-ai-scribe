
import { useState, useEffect } from 'react';
import { Course, HistoryItem } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses) {
          setCourses(userProfile.courses);
          if (!selectedCourseId && userProfile.courses.length > 0) {
            setSelectedCourseId(userProfile.courses[0].id);
          }
        }
      } else {
        initializeDefaultCourse();
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
      initializeDefaultCourse();
    }
  };

  const initializeDefaultCourse = () => {
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
    setCourses([defaultCourse]);
    setSelectedCourseId(defaultCourse.id);
  };

  return {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    loadCourses
  };
};
