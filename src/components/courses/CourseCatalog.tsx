
import { useState, useEffect } from "react";
import { Course, HistoryItem } from "@/types";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { BookPlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CourseSelector from "./CourseSelector";
import { toast } from "sonner";

interface CourseCatalogProps {
  onCourseSelect: (courseId: string) => void;
}

const CourseCatalog = ({ onCourseSelect }: CourseCatalogProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load courses
      const userProfileString = localStorage.getItem('user_profile');
      let userCourses: Course[] = [];
      
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && Array.isArray(userProfile.courses)) {
          userCourses = userProfile.courses;
        }
      }
      
      // If no courses, create default
      if (userCourses.length === 0) {
        const defaultCourse: Course = {
          id: "default",
          name: "通用课程",
          color: "bg-blue-500",
          timestamp: new Date()
        };
        userCourses = [defaultCourse];
        
        // Save default course
        const newUserProfile = {
          courses: userCourses,
          quizStats: { totalQuizzes: 0, correctAnswers: 0, totalQuestions: 0 }
        };
        localStorage.setItem('user_profile', JSON.stringify(newUserProfile));
      }
      
      setCourses(userCourses);
      
      // Load history items
      const historyString = localStorage.getItem('content_history') || '[]';
      const parsedHistory: HistoryItem[] = JSON.parse(historyString);
      
      // Add courseId to legacy items that don't have it
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

  // Group history items by courseId
  const getHistoryItemsByCourse = (courseId: string) => {
    return historyItems.filter(item => item.courseId === courseId);
  };

  const handleNewCourse = () => {
    setIsDialogOpen(true);
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">我的课程</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleNewCourse}>
              <BookPlus className="h-4 w-4 mr-2" />
              新建课程
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建课程</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <CourseSelector 
                selectedCourseId={selectedCourseId} 
                onSelectCourse={(id) => {
                  setSelectedCourseId(id);
                  setIsDialogOpen(false);
                  onCourseSelect(id);
                }} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">没有课程，请创建一个新课程</p>
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
