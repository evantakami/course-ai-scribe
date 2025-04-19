
import { useState } from "react";
import { Question, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useQuiz } from "@/hooks/useQuiz";
import QuizOption from "./QuizOption";
import QuizExplanation from "./QuizExplanation";
import QuizProgress from "./QuizProgress";
import QuizActions from "./QuizActions";

interface QuizProps {
  questions: Question[];
  initialAnswers?: UserAnswer[];
  saveUserAnswers?: (userAnswers: UserAnswer[]) => void;
}

const Quiz = ({ questions, initialAnswers = [], saveUserAnswers }: QuizProps) => {
  const {
    currentIndex,
    currentQuestion,
    userAnswers,
    selectedOption,
    isShowingExplanation,
    isLoadingExplanation,
    customExplanation,
    setSelectedOption,
    setIsShowingExplanation,
    handleSubmitAnswer,
    handleGenerateExplanation,
    handleNextQuestion,
    handlePrevQuestion,
    saveToMistakeCollection
  } = useQuiz(questions, initialAnswers, saveUserAnswers);

  if (!questions || questions.length === 0) {
    return <div className="text-center py-8 text-gray-500">没有可用的问题</div>;
  }

  if (!currentQuestion) {
    return <div className="text-center py-8 text-gray-500">加载问题中...</div>;
  }
  
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion?.id);
  const isAnswerSubmitted = userAnswer !== undefined;
  const isCorrect = userAnswer?.isCorrect;

  const handleSelectOption = (value: string) => {
    setSelectedOption(parseInt(value));
  };

  const handleSaveToMistakeCollection = () => {
    if (userAnswer) {
      saveToMistakeCollection(userAnswer);
      toast.success("已添加到错题本");
    }
  };

  return (
    <div className="space-y-6">
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        userAnswers={userAnswers}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-lg font-medium mb-4">
          <ReactMarkdown>{currentQuestion.text}</ReactMarkdown>
        </div>

        <RadioGroup 
          value={selectedOption?.toString()} 
          onValueChange={handleSelectOption}
          className="space-y-3"
          disabled={isAnswerSubmitted}
        >
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={index}
              index={index}
              option={option}
              isSubmitted={isAnswerSubmitted}
              isSelected={selectedOption === index || userAnswer?.selectedOption === index}
              isCorrect={index === currentQuestion.correctAnswer}
              disabled={isAnswerSubmitted}
            />
          ))}
        </RadioGroup>

        {isAnswerSubmitted && isShowingExplanation && (
          <QuizExplanation
            isLoading={isLoadingExplanation}
            explanation={currentQuestion.explanation}
            customExplanation={customExplanation}
          />
        )}

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
          >
            上一题
          </Button>

          <QuizActions
            isAnswerSubmitted={isAnswerSubmitted}
            isCorrect={isCorrect}
            customExplanation={customExplanation}
            isShowingExplanation={isShowingExplanation}
            isLoadingExplanation={isLoadingExplanation}
            onSaveToMistakeCollection={handleSaveToMistakeCollection}
            onGenerateWhyWrong={handleGenerateExplanation}
            onToggleExplanation={() => setIsShowingExplanation(!isShowingExplanation)}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            selectedOption={selectedOption}
            isLastQuestion={currentIndex === questions.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
