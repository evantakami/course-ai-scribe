
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Question, QuestionDifficulty, UserAnswer } from "@/types";
import QuizGenerator from "@/features/quiz/QuizGenerator";

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
    <TabsContent value="quiz" className="mt-2">
      {!questions && !isGenerating ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">请先在"输入内容"标签页输入内容，或点击"摘要"页的"生成测验题"按钮</p>
        </div>
      ) : (
        <QuizGenerator
          questions={questions}
          isGenerating={isGenerating}
          onDifficultyChange={onDifficultyChange}
          saveUserAnswers={saveUserAnswers}
          onRegenerateQuiz={onRegenerateQuiz}
        />
      )}
    </TabsContent>
  );
};

export default QuizTab;
