
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Question, QuestionDifficulty, UserAnswer } from "@/types";
import QuizByDifficulty from "@/features/quiz/components/QuizByDifficulty";

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
  saveUserAnswers,
}: QuizTabProps) => {
  return (
    <TabsContent value="quiz" className="mt-2 space-y-8">
      {!questions && !isGenerating ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">请先在"输入内容"标签页输入内容，或点击"摘要"页的"生成测验题"按钮</p>
        </div>
      ) : (
        <>
          <QuizByDifficulty
            questions={questions?.easy}
            difficulty="easy"
            saveUserAnswers={saveUserAnswers}
          />
          <QuizByDifficulty
            questions={questions?.medium}
            difficulty="medium"
            saveUserAnswers={saveUserAnswers}
          />
          <QuizByDifficulty
            questions={questions?.hard}
            difficulty="hard"
            saveUserAnswers={saveUserAnswers}
          />
        </>
      )}
    </TabsContent>
  );
};

export default QuizTab;
