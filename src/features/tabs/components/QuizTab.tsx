
import { TabsContent } from "@/components/ui/tabs";
import Quiz from "@/components/Quiz";
import { Question } from "@/types";

interface QuizTabProps {
  questions: {
    easy?: Question[];
    medium?: Question[];
    hard?: Question[];
  } | null;
}

const QuizTab = ({ questions }: QuizTabProps) => {
  return (
    <TabsContent value="quiz" className="mt-4 space-y-8">
      <Quiz questions={questions} />
    </TabsContent>
  );
};

export default QuizTab;
