
import React from 'react';
import { UserAnswer } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
}

const QuizProgress = ({ 
  currentIndex, 
  totalQuestions, 
  userAnswers 
}: QuizProgressProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        问题 {currentIndex + 1} / {totalQuestions}
      </div>
      <div className="text-sm flex items-center">
        <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
        <span className="mr-3">
          {userAnswers.filter(a => a.isCorrect).length} 正确
        </span>
        <XCircle className="text-red-500 h-4 w-4 mr-1" />
        <span>{userAnswers.length - userAnswers.filter(a => a.isCorrect).length} 错误</span>
      </div>
    </div>
  );
};

export default QuizProgress;
