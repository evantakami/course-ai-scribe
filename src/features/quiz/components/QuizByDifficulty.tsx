
import { Question, QuestionDifficulty, UserAnswer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Quiz from "@/components/Quiz";
import { BookOpen } from "lucide-react";

interface QuizByDifficultyProps {
  questions: Question[] | undefined;
  difficulty: QuestionDifficulty;
  initialAnswers?: UserAnswer[];
  saveUserAnswers?: (userAnswers: UserAnswer[]) => void;
}

const difficultyLabels: Record<QuestionDifficulty, string> = {
  easy: "简单难度",
  medium: "中等难度",
  hard: "困难难度"
};

const QuizByDifficulty = ({ 
  questions, 
  difficulty,
  initialAnswers,
  saveUserAnswers
}: QuizByDifficultyProps) => {
  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{difficultyLabels[difficulty]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            暂无{difficultyLabels[difficulty]}的测验题
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {difficultyLabels[difficulty]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Quiz 
          questions={questions}
          initialAnswers={initialAnswers}
          saveUserAnswers={saveUserAnswers}
        />
      </CardContent>
    </Card>
  );
};

export default QuizByDifficulty;
