
import { TabsContent } from "@/components/ui/tabs";
import CourseSummary from "@/components/CourseSummary";
import { Summary, SummaryStyle, SummaryLanguage } from "@/types";

interface SummaryTabProps {
  summary: Summary | null;
  isLoading: boolean;
  onStyleChange: (style: SummaryStyle) => void;
  onLanguageChange: (language: SummaryLanguage) => void;
  onGenerateQuiz: () => void;
}

const SummaryTab = ({
  summary,
  isLoading,
  onStyleChange,
  onLanguageChange,
  onGenerateQuiz
}: SummaryTabProps) => {
  return (
    <TabsContent value="summary" className="mt-4">
      <CourseSummary 
        summary={summary}
        isLoading={isLoading}
        onStyleChange={onStyleChange}
        onLanguageChange={onLanguageChange}
        onGenerateQuiz={onGenerateQuiz}
      />
    </TabsContent>
  );
};

export default SummaryTab;
