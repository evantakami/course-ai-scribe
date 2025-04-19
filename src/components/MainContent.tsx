
import { Tabs } from "@/components/ui/tabs";
import UploadTab from "@/features/tabs/components/UploadTab";
import SummaryTab from "@/features/tabs/components/SummaryTab";
import QuizTab from "@/features/tabs/components/QuizTab";
import MistakesTab from "@/features/tabs/components/MistakesTab";
import HistoryTab from "@/features/tabs/components/HistoryTab";
import MainTabs from "./MainTabs";
import { CourseContent, SummaryStyle } from "@/types";
import CourseCatalog from "./courses/CourseCatalog";
import { useCourseView } from "@/hooks/useCourseView";

interface MainContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isLoading: boolean;
  courseContent: CourseContent | null;
  handleContentLoaded: (content: string, generateQuiz: boolean, courseId: string) => void;
  handleStyleChange: (style: SummaryStyle) => void;
}

const MainContent = ({
  activeTab,
  setActiveTab,
  isLoading,
  courseContent,
  handleContentLoaded,
  handleStyleChange,
}: MainContentProps) => {
  const { 
    view, 
    selectedCourseId,
    handleSelectCourse,
    handleSelectHistoryContent 
  } = useCourseView();

  if (view === "catalog") {
    return <CourseCatalog onCourseSelect={handleSelectCourse} />;
  }

  return (
    <div className="flex-1 space-y-4 px-4 md:px-8 py-4">
      <MainTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        courseContent={courseContent} 
      />
      
      <Tabs value={activeTab} className="space-y-4">
        <UploadTab
          isLoading={isLoading}
          handleContentLoaded={handleContentLoaded}
          selectedCourseId={selectedCourseId}
          onSelectCourse={handleSelectCourse}
        />
        <SummaryTab
          summary={courseContent?.summary}
          isLoading={isLoading}
          onStyleChange={handleStyleChange}
          onGenerateQuiz={() => setActiveTab("quiz")}
        />
        <QuizTab
          questions={courseContent?.questions}
        />
        <MistakesTab />
        <HistoryTab
          courseId={selectedCourseId}
          onSelectContent={handleSelectHistoryContent}
        />
      </Tabs>
    </div>
  );
};

export default MainContent;
