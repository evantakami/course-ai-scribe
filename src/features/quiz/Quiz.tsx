
import { Question, UserAnswer } from "@/types";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizExplanation from "./QuizExplanation";
import QuizActions from "./QuizActions";
import { useQuiz } from "./hooks/useQuiz";

interface QuizProps {
  questions: Question[];
  initialAnswers?: UserAnswer[];
  saveUserAnswers?: (userAnswers: UserAnswer[]) => void;
}

const Quiz = ({ 
  questions, 
  initialAnswers = [], 
  saveUserAnswers 
}: QuizProps) => {
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

      <QuizQuestion
        question={currentQuestion}
        selectedOption={selectedOption}
        isAnswerSubmitted={isAnswerSubmitted}
        userAnswerIndex={userAnswer?.selectedOption}
        onOptionSelect={handleSelectOption}
      />

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
  );
};

export default Quiz;
