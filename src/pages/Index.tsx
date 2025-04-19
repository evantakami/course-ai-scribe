
import { useEffect } from "react";
import { Toaster } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopControls from "@/components/TopControls";
import MainTabs from "@/components/MainTabs";
import CourseCatalog from "@/components/courses/CourseCatalog";
import CourseHistory from "@/components/courses/CourseHistory";
import { useContentManager } from "@/hooks/useContentManager";
import { useCourseView } from "@/hooks/useCourseView";
import { useContentHistory } from "@/hooks/useContentHistory";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  
  const {
    courseContent,
    isLoading,
    isGeneratingQuiz,
    summaryProgress,
    quizProgress,
    handleContentLoaded,
    handleStyleChange,
    handleLanguageChange,
    handleGenerateQuiz,
    handleRegenerateQuiz,
    setCurrentQuizDifficulty
  } = useContentManager();

  const {
    selectedCourseId,
    setSelectedCourseId,
    view,
    setView,
    activeTab,
    setActiveTab,
    handleSelectHistoryContent
  } = useCourseView();

  const {
    saveToHistory,
    saveUserAnswersToHistory
  } = useContentHistory();

  useEffect(() => {
    if (courseContent?.rawContent && !isLoading) {
      saveToHistory(courseContent, selectedCourseId);
    }
  }, [courseContent?.summary, courseContent?.questions, selectedCourseId]);

  const handleApiKeySet = () => {
    setIsKeySet(true);
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView("history");
  };

  const renderContent = () => {
    if (!isKeySet) {
      return (
        <div className="flex justify-center my-8">
          <ApiKeyInput onApiKeySet={handleApiKeySet} />
        </div>
      );
    }

    if (view === "catalog") {
      return (
        <CourseCatalog onCourseSelect={handleCourseSelect} />
      );
    }

    if (view === "history") {
      return (
        <CourseHistory 
          courseId={selectedCourseId}
          onBackClick={() => setView("catalog")}
          onSelectContent={handleSelectHistoryContent}
        />
      );
    }

    return (
      <>
        <TopControls 
          onSelectHistoryContent={handleSelectHistoryContent} 
          onApiKeySet={handleApiKeySet} 
          onViewCourses={() => setView("catalog")}
        />
        
        <MainTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          courseContent={courseContent}
          isLoading={isLoading}
          isGeneratingQuiz={isGeneratingQuiz}
          handleContentLoaded={handleContentLoaded}
          handleStyleChange={handleStyleChange}
          handleLanguageChange={handleLanguageChange}
          handleGenerateQuiz={handleGenerateQuiz}
          handleDifficultyChange={setCurrentQuizDifficulty}
          saveUserAnswersToHistory={(answers) => 
            saveUserAnswersToHistory(answers, courseContent!, selectedCourseId)
          }
          handleRegenerateQuiz={handleRegenerateQuiz}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onViewCourses={() => setView("catalog")}
          summaryProgress={summaryProgress}
          quizProgress={quizProgress}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {renderContent()}
          </main>
          <Footer />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
