
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/MainContent";
import { CourseContent, SummaryStyle } from "@/types";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  
  const handleApiKeySet = () => {
    setIsKeySet(true);
  };
  
  const handleContentLoaded = (content: string, generateQuiz: boolean, courseId: string) => {
    console.log("Content loaded:", { content, generateQuiz, courseId });
    // Placeholder for future implementation
  };
  
  const handleStyleChange = (style: SummaryStyle) => {
    console.log("Style changed:", style);
    // Placeholder for future implementation
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
