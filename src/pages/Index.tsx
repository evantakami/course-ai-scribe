
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/MainContent";
import { CourseContent, SummaryStyle } from "@/types";
import { useContentManager } from "@/hooks/useContentManager";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  
  const {
    courseContent,
    isLoading,
    activeTab,
    setActiveTab,
    handleContentLoaded,
    handleStyleChange,
  } = useContentManager();
  
  const handleApiKeySet = () => {
    setIsKeySet(true);
  };
  
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
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
              <MainContent 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoading={isLoading}
                courseContent={courseContent}
                handleContentLoaded={handleContentLoaded}
                handleStyleChange={handleStyleChange}
                selectedCourseId={selectedCourseId}
                onSelectCourse={handleSelectCourse}
              />
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
