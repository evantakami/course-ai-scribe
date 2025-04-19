
import { useState } from "react";
import { Question, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useQuiz } from "@/hooks/useQuiz";
import QuizOption from "./components/QuizOption";
import QuizExplanation from "./components/QuizExplanation";
import QuizProgress from "./components/QuizProgress";
import QuizActions from "./components/QuizActions";
import { motion, AnimatePresence } from "framer-motion";

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
    return (
      <div className="text-center py-8 text-muted-foreground">
        没有可用的题目
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        加载题目中...
      </div>
    );
  }
  
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion?.id);
  const isAnswerSubmitted = userAnswer !== undefined;
  const isCorrect = userAnswer?.isCorrect;

  const handleSelectOption = (value: string) => {
    if (isAnswerSubmitted) return;
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

      <motion.div 
        className="bg-white p-6 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-lg font-medium mb-6 prose max-w-none">
          <ReactMarkdown>{currentQuestion.text}</ReactMarkdown>
        </div>

        <RadioGroup 
          value={selectedOption?.toString()} 
          onValueChange={handleSelectOption}
          className="space-y-3"
          disabled={isAnswerSubmitted}
        >
          <AnimatePresence mode="wait">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <QuizOption
                  index={index}
                  option={option}
                  isSubmitted={isAnswerSubmitted}
                  isSelected={selectedOption === index || userAnswer?.selectedOption === index}
                  isCorrect={index === currentQuestion.correctAnswer}
                  disabled={isAnswerSubmitted}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </RadioGroup>

        <AnimatePresence>
          {isAnswerSubmitted && isShowingExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuizExplanation
                isLoading={isLoadingExplanation}
                explanation={currentQuestion.explanation}
                customExplanation={customExplanation}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="hover:shadow-md transition-all duration-200"
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
      </motion.div>
    </div>
  );
};

export default Quiz;
