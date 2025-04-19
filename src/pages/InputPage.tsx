
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SummaryLanguage, QuestionDifficulty } from "@/types";
import { useContentManager } from "@/hooks/useContentManager";

const InputPage = () => {
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  
  const {
    handleContentLoaded,
    isLoading,
  } = useContentManager();

  const handleContentProcessed = async (
    content: string,
    generateQuiz: boolean,
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
    courseId: string
  ) => {
    const success = await handleContentLoaded(
      content, 
      generateQuiz, 
      quizDifficulty, 
      language, 
      courseId
    );
    
    if (success) {
      toast.success("内容处理成功，正在跳转...");
      // Store contentId in sessionStorage for retrieval
      const contentId = Date.now().toString();
      sessionStorage.setItem('current_content_id', contentId);
      navigate(`/summary-quiz/${contentId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">输入课程内容</h1>
            <div className="flex justify-center">
              <FileUpload 
                onContentLoaded={handleContentProcessed} 
                isLoading={isLoading}
                selectedCourseId={selectedCourseId}
                onSelectCourse={setSelectedCourseId}
                generateAllContent={true}
              />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default InputPage;
