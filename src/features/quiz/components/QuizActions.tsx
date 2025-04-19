
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle } from "lucide-react";
import { UserAnswer } from "@/types";

interface QuizActionsProps {
  isAnswerSubmitted: boolean;
  isCorrect: boolean | undefined;
  customExplanation: string | null;
  isShowingExplanation: boolean;
  isLoadingExplanation: boolean;
  onSaveToMistakeCollection: () => void;
  onGenerateWhyWrong: () => void;
  onToggleExplanation: () => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  selectedOption: number | null;
  isLastQuestion: boolean;
}

const QuizActions = ({
  isAnswerSubmitted,
  isCorrect,
  customExplanation,
  isShowingExplanation,
  isLoadingExplanation,
  onSaveToMistakeCollection,
  onGenerateWhyWrong,
  onToggleExplanation,
  onSubmitAnswer,
  onNextQuestion,
  selectedOption,
  isLastQuestion
}: QuizActionsProps) => {
  return (
    <div className="mt-6 flex justify-between">
      <div className="flex gap-2">
        {isAnswerSubmitted && (
          <>
            {!isCorrect && (
              <Button
                variant="outline"
                onClick={onSaveToMistakeCollection}
                className="flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                添加到错题本
              </Button>
            )}
            
            {!isCorrect && (
              <Button
                variant="outline"
                onClick={onGenerateWhyWrong}
                className="flex items-center gap-1"
                disabled={isLoadingExplanation}
              >
                <HelpCircle className="h-4 w-4" />
                {customExplanation ? "更新解析" : "我为什么错了？"}
              </Button>
            )}
            
            {(isCorrect || customExplanation) && (
              <Button
                variant="outline"
                onClick={onToggleExplanation}
                className="flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                {isShowingExplanation ? "隐藏解析" : "显示解析"}
              </Button>
            )}
          </>
        )}
      </div>

      {!isAnswerSubmitted ? (
        <Button 
          onClick={onSubmitAnswer} 
          disabled={selectedOption === null}
          className="bg-edu-600 hover:bg-edu-700"
        >
          确认答案
        </Button>
      ) : (
        <Button
          onClick={onNextQuestion}
          disabled={isLastQuestion}
          className="bg-edu-600 hover:bg-edu-700"
        >
          下一题
        </Button>
      )}
    </div>
  );
};

export default QuizActions;
