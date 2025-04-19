
import { useState, useEffect } from 'react';
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
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // Convert mistakes to questions format for the Quiz component
  const questions: Question[] = mistakes.map((mistake) => ({
    id: mistake.questionId,
    text: mistake.question,
    options: mistake.options,
    correctAnswer: mistake.correctAnswer,
    explanation: mistake.explanation,
    difficulty: "medium"
  }));

  // Handle saving answers from Quiz component
  const handleSaveAnswers = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    
    // Pass updated answers to parent component
    if (answers.length > 0) {
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

      <Quiz 
        questions={questions}
        initialAnswers={userAnswers}
        saveUserAnswers={handleSaveAnswers}
      />
    </div>
  );
};

export default MistakePractice;
