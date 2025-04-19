
import React from 'react';
import { Question } from "@/types";
import { RadioGroup } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";
import QuizOption from "./QuizOption";

interface QuizQuestionProps {
  question: Question;
  selectedOption: number | null;
  isAnswerSubmitted: boolean;
  userAnswerIndex?: number;
  onOptionSelect: (value: string) => void;
}

const QuizQuestion = ({
  question,
  selectedOption,
  isAnswerSubmitted,
  userAnswerIndex,
  onOptionSelect,
}: QuizQuestionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-lg font-medium mb-4">
        <ReactMarkdown>{question.text}</ReactMarkdown>
      </div>

      <RadioGroup 
        value={selectedOption?.toString()} 
        onValueChange={onOptionSelect}
        className="space-y-3"
        disabled={isAnswerSubmitted}
      >
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            index={index}
            option={option}
            isSubmitted={isAnswerSubmitted}
            isSelected={selectedOption === index || userAnswerIndex === index}
            isCorrect={index === question.correctAnswer}
            disabled={isAnswerSubmitted}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuizQuestion;
