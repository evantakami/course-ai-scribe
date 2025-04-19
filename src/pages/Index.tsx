
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCatalog from "@/components/courses/CourseCatalog";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  
  const handleApiKeySet = () => {
    setIsKeySet(true);
  };

  const handleCourseSelect = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleNewCourse = () => {
    navigate("/input");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {!isKeySet ? (
              <div className="flex justify-center my-8">
                <ApiKeyInput onApiKeySet={handleApiKeySet} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">我的课程</h1>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/mistakes")}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      错题本
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={handleNewCourse}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      新建课程笔记
                    </Button>
                  </div>
                </div>
                
                <CourseCatalog onCourseSelect={handleCourseSelect} />
              </>
            )}
          </main>
          <Footer />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
