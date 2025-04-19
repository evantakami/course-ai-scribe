
import { useState, useEffect } from 'react';
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
  const [processedAnswerIds, setProcessedAnswerIds] = useState<number[]>([]);
  
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
      // Filter to only include answers that haven't been processed yet
      const newCorrectAnswers = answers.filter(answer => 
        answer.isCorrect && 
        !processedAnswerIds.includes(answer.questionId)
      );
      
      if (newCorrectAnswers.length > 0) {
        // Update our tracking of processed answers
        setProcessedAnswerIds(prev => [
          ...prev,
          ...newCorrectAnswers.map(a => a.questionId)
        ]);
        
        // Only update with answers that weren't previously processed
        onUpdateMistakes(newCorrectAnswers);
      }
      
      // Always update the practice answers state
      setPracticeAnswers(answers);
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
