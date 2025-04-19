
import { useState, useEffect } from "react";
import { Question, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import QuizOption from "@/features/quiz/components/QuizOption";
import QuizExplanation from "@/features/quiz/components/QuizExplanation";
import QuizProgress from "@/features/quiz/components/QuizProgress";
import QuizActions from "@/features/quiz/components/QuizActions";
import { useQuizSubmission } from "@/features/quiz/hooks/useQuizSubmission";

interface QuizProps {
  questions: Question[];
  initialAnswers?: UserAnswer[];
  saveUserAnswers?: (userAnswers: UserAnswer[]) => void;
}

const Quiz = ({ questions, initialAnswers = [], saveUserAnswers }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isShowingExplanation, setIsShowingExplanation] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setUserAnswers(initialAnswers || []);
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const existingAnswer = initialAnswers?.find(a => a.questionId === currentQuestion.id);
        setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
      } else {
        setSelectedOption(null);
      }
      setIsShowingExplanation(false);
      
      if (currentQuestionIndex >= questions.length) {
        setCurrentQuestionIndex(0);
      }
    }
  }, [questions, initialAnswers]);

  useEffect(() => {
    if (questions && questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const existingAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
      setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
      setIsShowingExplanation(!!existingAnswer);
    }
  }, [currentQuestionIndex, questions, userAnswers]);

  useEffect(() => {
    if (userAnswers.length > 0 && saveUserAnswers) {
      saveUserAnswers(userAnswers);
    }
  }, [userAnswers, saveUserAnswers]);

  if (!questions || questions.length === 0) {
    return <div className="text-center py-8 text-gray-500">No questions available</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    setCurrentQuestionIndex(0);
    return <div className="text-center py-8 text-gray-500">Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return <div className="text-center py-8 text-gray-500">Question not available</div>;
  }
  
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion?.id);
  const isAnswerSubmitted = userAnswer !== undefined;
  const isCorrect = userAnswer?.isCorrect;

  const {
    isLoadingExplanation,
    customExplanation,
    setCustomExplanation,
    handleSubmitAnswer,
    handleGenerateWhyWrong,
    saveToMistakeCollection
  } = useQuizSubmission(currentQuestion, (newAnswer) => {
    setUserAnswers(prev => [
      ...prev.filter(a => a.questionId !== currentQuestion.id),
      newAnswer
    ]);
    setIsShowingExplanation(true);
    setCustomExplanation(null);
  });

  const handleSelectOption = (value: string) => {
    setSelectedOption(parseInt(value));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsShowingExplanation(false);
    setCustomExplanation(null);
    setCurrentQuestionIndex(prev => 
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setIsShowingExplanation(false);
    setCustomExplanation(null);
    setCurrentQuestionIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  return (
    <div className="space-y-6">
      <QuizProgress
        currentIndex={currentQuestionIndex}
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
            disabled={currentQuestionIndex === 0}
          >
            上一题
          </Button>

          <QuizActions
            isAnswerSubmitted={isAnswerSubmitted}
            isCorrect={isCorrect}
            customExplanation={customExplanation}
            isShowingExplanation={isShowingExplanation}
            isLoadingExplanation={isLoadingExplanation}
            onSaveToMistakeCollection={() => {
              if (userAnswer) {
                saveToMistakeCollection(userAnswer);
                toast.success("已添加到错题本");
              }
            }}
            onGenerateWhyWrong={() => {
              if (userAnswer && !isCorrect) {
                handleGenerateWhyWrong(userAnswer.selectedOption);
                setIsShowingExplanation(true);
              }
            }}
            onToggleExplanation={() => setIsShowingExplanation(!isShowingExplanation)}
            onSubmitAnswer={() => handleSubmitAnswer(selectedOption)}
            onNextQuestion={handleNextQuestion}
            selectedOption={selectedOption}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
