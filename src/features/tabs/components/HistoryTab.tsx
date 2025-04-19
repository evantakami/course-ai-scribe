
import { TabsContent } from "@/components/ui/tabs";
import CourseHistory from "@/components/courses/CourseHistory";
import { useCourseView } from "@/hooks/useCourseView";

const HistoryTab = () => {
  const { selectedCourseId, handleSelectHistoryContent, setView } = useCourseView();

  const handleBackClick = () => {
    setView("catalog");
  };

  return (
    <TabsContent value="history" className="mt-4">
      <CourseHistory 
        courseId={selectedCourseId}
        onBackClick={handleBackClick}
        onSelectContent={handleSelectHistoryContent}
      />
    </TabsContent>
  );
};

export default HistoryTab;
