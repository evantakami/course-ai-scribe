
import { useState } from 'react';
import { UserAnswer, Question } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Quiz from "@/features/quiz/Quiz";

interface MistakePracticeProps {
  mistakes: UserAnswer[];
  onBackToList: () => void;
  onUpdateMistakes: (updatedAnswers: UserAnswer[]) => void;
}

const MistakePractice = ({ mistakes, onBackToList, onUpdateMistakes }: MistakePracticeProps) => {
  const [practiceAnswers, setPracticeAnswers] = useState<UserAnswer[]>([]);
  
  // Convert mistakes to questions format for the Quiz component
  const questions: Question[] = mistakes.map((mistake) => ({
    id: mistake.questionId,
    text: mistake.question,
    options: mistake.options,
    correctAnswer: mistake.correctAnswer,
    explanation: mistake.explanation,
    difficulty: "medium" // Default difficulty for mistakes
  }));

  // Handle saving answers from Quiz component
  const handleSaveAnswers = (answers: UserAnswer[]) => {
    if (answers.length > 0) {
      setPracticeAnswers(answers);
      onUpdateMistakes(answers);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBackToList}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回错题列表
      </Button>

      {questions.length > 0 ? (
        <Quiz 
          questions={questions}
          initialAnswers={practiceAnswers}
          saveUserAnswers={handleSaveAnswers}
        />
      ) : (
        <div className="text-center py-8">
          <p>没有可练习的错题</p>
          <Button onClick={onBackToList} className="mt-4">
            返回
          </Button>
        </div>
      )}
    </div>
  );
};

export default MistakePractice;
