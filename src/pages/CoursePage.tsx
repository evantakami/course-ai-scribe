
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      console.log("Loading course data for ID:", courseId);
      loadCourseData(courseId);
    }
  }, [courseId]);

  const loadCourseData = (id: string) => {
    setLoading(true);
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        const foundCourse = userProfile.courses?.find((c: Course) => c.id === id);
        if (foundCourse) {
          console.log("Course found:", foundCourse.name);
          setCourse(foundCourse);
        } else {
          console.error("Course not found in user profile");
          toast.error("课程不存在");
          navigate("/");
        }
      } else {
        console.error("User profile not found in localStorage");
        toast.error("用户数据不存在");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to load course data:", error);
      toast.error("加载课程数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContent = (content: string) => {
    // Store the content and navigate to summary-quiz page
    try {
      if (!content || content.trim() === "") {
        toast.error("内容为空，无法处理");
        return;
      }

      const contentId = Date.now().toString();
      console.log("Setting session storage for content with ID:", contentId);
      console.log("Content length:", content.length);
      
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
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-edu-500 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-lg">正在加载课程数据...</span>
              </div>
            ) : courseId ? (
              <CourseHistory 
                courseId={courseId}
                onBackClick={() => navigate("/")}
                onSelectContent={handleSelectContent}
              />
            ) : (
              <div className="text-center py-10">
                <p>找不到课程</p>
                <Button 
                  variant="default" 
                  onClick={() => navigate("/")}
                  className="mt-4"
                >
                  返回首页
                </Button>
              </div>
            )}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
