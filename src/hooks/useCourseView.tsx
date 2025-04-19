
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Course, CourseContent, HistoryItem } from '@/types';
import { toast } from "sonner";

export const useCourseView = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [view, setView] = useState<"catalog" | "history" | "content">("content");
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);

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

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView("content");
    setActiveTab("upload");
  };

  const handleSelectHistoryContent = (content: string) => {
    try {
      // First check if we have a complete history item stored in session
      const storedItem = sessionStorage.getItem('selected_history_item');
      
      if (storedItem) {
        const historyItem: HistoryItem = JSON.parse(storedItem);
        
        // Check if this is the correct content
        if (historyItem.rawContent === content) {
          // Create a summary object from the first available summary style
          let summary = null;
          if (historyItem.summaries && Object.keys(historyItem.summaries).length > 0) {
            const firstStyle = Object.keys(historyItem.summaries)[0] as any;
            summary = {
              content: historyItem.summaries[firstStyle],
              style: firstStyle,
              language: historyItem.language || 'chinese'
            };
          }
          
          // Set the full content with summary and questions
          setCourseContent({
            rawContent: content,
            summary: summary,
            questions: historyItem.questions
          });
          
          // If we have summary, go to summary tab, otherwise upload
          if (summary) {
            setActiveTab("summary");
          } else if (historyItem.questions) {
            setActiveTab("quiz");
          } else {
            setActiveTab("upload");
          }
          
          setView("content");
          toast.success("已加载历史内容");
          
          // Clear session storage
          sessionStorage.removeItem('selected_history_item');
          return;
        }
      }
      
      // If no session item or content doesn't match, look in local storage
      const historyString = localStorage.getItem('content_history') || '[]';
      const historyItems: HistoryItem[] = JSON.parse(historyString);
      
      // Find the item with matching content
      const historyItem = historyItems.find(item => item.rawContent === content);
      
      if (historyItem) {
        let summary = null;
        if (historyItem.summaries && Object.keys(historyItem.summaries).length > 0) {
          const firstStyle = Object.keys(historyItem.summaries)[0] as any;
          summary = {
            content: historyItem.summaries[firstStyle],
            style: firstStyle,
            language: historyItem.language || 'chinese'
          };
        }
        
        setCourseContent({
          rawContent: content,
          summary: summary,
          questions: historyItem.questions
        });
        
        if (summary) {
          setActiveTab("summary");
        } else if (historyItem.questions) {
          setActiveTab("quiz");
        } else {
          setActiveTab("upload");
        }
        
        setView("content");
        toast.success("已加载历史内容");
      } else {
        // Fallback to just loading raw content
        setCourseContent({ 
          rawContent: content,
          summary: null,
          questions: null
        });
        setActiveTab("upload");
        setView("content");
        toast.info("已加载内容，请点击处理按钮继续");
      }
    } catch (error) {
      console.error("Error loading history content:", error);
      // Fallback to simple content load
      setCourseContent({ 
        rawContent: content,
        summary: null,
        questions: null
      });
      setActiveTab("upload");
      setView("content");
      toast.error("加载历史内容失败，只恢复了原始文本");
    }
  };

  return {
    selectedCourseId,
    setSelectedCourseId,
    view,
    setView,
    activeTab,
    setActiveTab,
    courseContent,
    setCourseContent,
    handleSelectCourse,
    handleSelectHistoryContent
  };
};
