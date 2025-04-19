
import { useState, useEffect } from "react";
import { Course, HistoryItem } from "@/types";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CourseCatalogProps {
  onCourseSelect: (courseId: string) => void;
}

const CourseCatalog = ({ onCourseSelect }: CourseCatalogProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userProfileString = localStorage.getItem('user_profile');
      let userCourses: Course[] = [];
      
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && Array.isArray(userProfile.courses)) {
          userCourses = userProfile.courses;
        }
      }
      
      if (userCourses.length === 0) {
        const defaultCourse: Course = {
          id: "default",
          name: "通用课程",
          color: "bg-blue-500",
          timestamp: new Date()
        };
        userCourses = [defaultCourse];
        
        const newUserProfile = {
          courses: userCourses,
          quizStats: { totalQuizzes: 0, correctAnswers: 0, totalQuestions: 0 }
        };
        localStorage.setItem('user_profile', JSON.stringify(newUserProfile));
      }
      
      setCourses(userCourses);
      
      const historyString = localStorage.getItem('content_history') || '[]';
      const parsedHistory: HistoryItem[] = JSON.parse(historyString);
      
      const updatedHistory = parsedHistory.map(item => {
        if (!item.courseId && userCourses.length > 0) {
          return { ...item, courseId: userCourses[0].id };
        }
        return item;
      });
      
      if (updatedHistory !== parsedHistory) {
        localStorage.setItem('content_history', JSON.stringify(updatedHistory));
      }
      
      setHistoryItems(updatedHistory);
    } catch (error) {
      console.error("Failed to load courses:", error);
      toast.error("加载课程失败");
    } finally {
      setIsLoading(false);
    }
  };

  const getHistoryItemsByCourse = (courseId: string) => {
    return historyItems.filter(item => item.courseId === courseId);
  };

  const handleCourseSelect = (courseId: string) => {
    onCourseSelect(courseId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">加载课程中...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">我的课程</h2>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">没有课程，请创建一个新课程笔记</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              historyItems={getHistoryItemsByCourse(course.id)}
              onClick={() => handleCourseSelect(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
