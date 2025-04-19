
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
  // Convert the questions object to an array for the Quiz component
  const flattenQuestions = (): Question[] => {
    if (!questions) return [];
    
    // Combine all difficulty levels and filter out undefined
    const allQuestions = [
      ...(questions.easy || []),
      ...(questions.medium || []),
      ...(questions.hard || [])
    ];
    
    return allQuestions;
  };
  
  return (
    <TabsContent value="quiz" className="mt-4 space-y-8">
      <Quiz questions={flattenQuestions()} />
    </TabsContent>
  );
};

export default QuizTab;
