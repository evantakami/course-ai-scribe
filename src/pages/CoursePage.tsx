
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseHistory from "@/components/courses/CourseHistory";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Course } from "@/types";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
    }
  }, [courseId]);

  const loadCourseData = (id: string) => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        const foundCourse = userProfile.courses?.find((c: Course) => c.id === id);
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          toast.error("课程不存在");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Failed to load course data:", error);
      toast.error("加载课程数据失败");
    }
  };

  const handleSelectContent = (content: string) => {
    // Store the content and navigate to summary-quiz page
    try {
      const contentId = Date.now().toString();
      sessionStorage.setItem('current_content', content);
      sessionStorage.setItem('current_content_id', contentId);
      sessionStorage.setItem('current_course_id', courseId || '');
      navigate(`/summary-quiz/${contentId}`);
    } catch (error) {
      console.error("Failed to select content:", error);
      toast.error("选择内容失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => navigate("/input")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                新建课程笔记
              </Button>
            </div>
            
            {courseId && (
              <CourseHistory 
                courseId={courseId}
                onBackClick={() => navigate("/")}
                onSelectContent={handleSelectContent}
              />
            )}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
