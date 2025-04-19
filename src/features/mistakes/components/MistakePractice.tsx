
import { useState } from 'react';
import { UserAnswer, Question } from "@/types";
import Quiz from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MistakePracticeProps {
  mistakes: UserAnswer[];
  onBackToList: () => void;
  onUpdateMistakes: (updatedAnswers: UserAnswer[]) => void;
}

const MistakePractice = ({ mistakes, onBackToList, onUpdateMistakes }: MistakePracticeProps) => {
  const questions: Question[] = mistakes.map((mistake) => ({
    id: mistake.questionId,
    text: mistake.question,
    options: mistake.options,
    correctAnswer: mistake.correctAnswer,
    explanation: mistake.explanation,
    difficulty: "medium"
  }));

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

      <Quiz 
        questions={questions}
        saveUserAnswers={onUpdateMistakes}
      />
    </div>
  );
};

export default MistakePractice;
