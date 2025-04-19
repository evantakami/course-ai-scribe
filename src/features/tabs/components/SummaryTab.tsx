
import { TabsContent } from "@/components/ui/tabs";
import CourseSummary from "@/components/CourseSummary";
import { Summary, SummaryStyle } from "@/types";

interface SummaryTabProps {
  summary: Summary | null;
  isLoading: boolean;
  onStyleChange: (style: SummaryStyle) => void;
  onGenerateQuiz: () => void;
}

const SummaryTab = ({
  summary,
  isLoading,
  onStyleChange,
  onGenerateQuiz
}: SummaryTabProps) => {
  return (
    <TabsContent value="summary" className="mt-4">
      <CourseSummary 
        summary={summary}
        isLoading={isLoading}
        onStyleChange={onStyleChange}
        onGenerateQuiz={onGenerateQuiz}
      />
    </TabsContent>
  );
};

export default SummaryTab;
