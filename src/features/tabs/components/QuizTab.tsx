
import { TabsContent } from "@/components/ui/tabs";
import QuizGenerator from "@/components/QuizGenerator";
import { Question, QuestionDifficulty, UserAnswer } from "@/types";

interface QuizTabProps {
  questions: {
    easy?: Question[];
    medium?: Question[];
    hard?: Question[];
  } | null;
  isGenerating: boolean;
  onDifficultyChange: (difficulty: QuestionDifficulty) => void;
  saveUserAnswers?: (userAnswers: UserAnswer[]) => void;
  onRegenerateQuiz?: (difficulty: QuestionDifficulty) => void;
}

const QuizTab = ({
  questions,
  isGenerating,
  onDifficultyChange,
  saveUserAnswers,
  onRegenerateQuiz
}: QuizTabProps) => {
  return (
    <TabsContent value="quiz" className="mt-4">
      <QuizGenerator 
        questions={questions}
        isGenerating={isGenerating}
        onDifficultyChange={onDifficultyChange}
        saveUserAnswers={saveUserAnswers}
        onRegenerateQuiz={onRegenerateQuiz}
      />
    </TabsContent>
  );
};

export default QuizTab;
