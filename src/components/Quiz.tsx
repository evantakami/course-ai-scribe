
import { useState } from "react";
import { Question, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, HelpCircle } from "lucide-react";
import { openaiService } from "@/services/openaiService";

interface QuizProps {
  questions: Question[];
}

const Quiz = ({ questions }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);
  const isAnswerSubmitted = userAnswer !== undefined;
  const isCorrect = userAnswer?.isCorrect;

  const handleSelectOption = (value: string) => {
    const optionIndex = parseInt(value);
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) return;

    setIsSubmitting(true);
    try {
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      const explanation = await openaiService.evaluateAnswer(
        currentQuestion, 
        selectedOption
      );

      setExplanation(explanation);
      
      setUserAnswers(prev => [
        ...prev.filter(a => a.questionId !== currentQuestion.id),
        {
          questionId: currentQuestion.id,
          selectedOption,
          isCorrect
        }
      ]);
    } catch (error) {
      console.error("Error evaluating answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setExplanation(null);
    setCurrentQuestionIndex(prev => 
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setExplanation(null);
    setCurrentQuestionIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  const getProgress = () => {
    const answeredCount = userAnswers.length;
    const totalCount = questions.length;
    const percentage = Math.round((answeredCount / totalCount) * 100);
    
    return {
      answeredCount,
      totalCount,
      percentage,
      correct: userAnswers.filter(a => a.isCorrect).length
    };
  };

  const progress = getProgress();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          问题 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="text-sm flex items-center">
          <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
          <span className="mr-3">{progress.correct} 正确</span>
          <XCircle className="text-red-500 h-4 w-4 mr-1" />
          <span>{progress.answeredCount - progress.correct} 错误</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">
          {currentQuestion.text}
        </h3>

        <RadioGroup 
          value={selectedOption?.toString()} 
          onValueChange={handleSelectOption}
          className="space-y-3"
          disabled={isAnswerSubmitted}
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className={`
              flex items-start space-x-2 rounded-md p-3 border transition-colors
              ${isAnswerSubmitted ? (
                index === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' :
                index === userAnswer?.selectedOption ? 'bg-red-50 border-red-200' :
                'border-transparent'
              ) : (
                selectedOption === index ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'
              )}
            `}>
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label 
                htmlFor={`option-${index}`} 
                className="flex-grow font-normal cursor-pointer"
              >
                {option}
              </Label>
              {isAnswerSubmitted && (
                index === currentQuestion.correctAnswer ? (
                  <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                ) : index === userAnswer?.selectedOption ? (
                  <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                ) : null
              )}
            </div>
          ))}
        </RadioGroup>

        {explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="flex items-center text-sm font-medium text-blue-800 mb-2">
              <HelpCircle className="mr-1 h-4 w-4" />
              解析
            </h4>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            上一题
          </Button>

          {!isAnswerSubmitted ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedOption === null || isSubmitting}
              className="bg-edu-600 hover:bg-edu-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  检查中...
                </>
              ) : "确认答案"}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="bg-edu-600 hover:bg-edu-700"
            >
              下一题
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

