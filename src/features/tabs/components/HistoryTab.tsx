
import { TabsContent } from "@/components/ui/tabs";
import CourseHistory from "@/components/courses/CourseHistory";
import { useCourseView } from "@/hooks/useCourseView";

interface HistoryTabProps {
  courseId: string;
  onSelectContent: (content: string) => void;
}

const HistoryTab = ({ courseId, onSelectContent }: HistoryTabProps) => {
  const { setView } = useCourseView();

  const handleBackClick = () => {
    setView("catalog");
  };

  return (
    <TabsContent value="history" className="mt-4">
      <CourseHistory 
        courseId={courseId}
        onBackClick={handleBackClick}
        onSelectContent={onSelectContent}
      />
    </TabsContent>
  );
};

export default HistoryTab;
