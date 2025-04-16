
import { useState } from "react";
import { Question, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { openaiService } from "@/services/openaiService";
import { Loader2 } from "lucide-react";

interface QuizProps {
  questions: Question[];
}

const Quiz = ({ questions }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  
  const userAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const handleOptionSelect = (optionIndex: number) => {
    setExplanation(null);
    
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(
      a => a.questionId === currentQuestion.id
    );

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = {
        ...newAnswers[existingAnswerIndex],
        selectedOption: optionIndex,
        isCorrect: undefined,
      };
    } else {
      newAnswers.push({
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        isCorrect: undefined,
      });
    }

    setAnswers(newAnswers);
  };

  const handleCheckAnswer = async () => {
    if (!userAnswer) return;

    setIsEvaluating(true);
    try {
      const explanation = await openaiService.evaluateAnswer(
        currentQuestion,
        userAnswer.selectedOption
      );
      
      const isCorrect = userAnswer.selectedOption === currentQuestion.correctAnswer;
      
      const newAnswers = [...answers];
      const answerIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
      
      if (answerIndex >= 0) {
        newAnswers[answerIndex] = {
          ...newAnswers[answerIndex],
          isCorrect
        };
        setAnswers(newAnswers);
      }
      
      setExplanation(explanation);
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setExplanation("无法生成解释。请稍后再试。");
    } finally {
      setIsEvaluating(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setExplanation(null);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setExplanation(null);
    }
  };

  const getOptionClassName = (optionIndex: number) => {
    if (userAnswer?.isCorrect === undefined) return "";
    
    if (optionIndex === currentQuestion.correctAnswer) {
      return "bg-green-50 border-green-300";
    }
    
    if (optionIndex === userAnswer.selectedOption && userAnswer.isCorrect === false) {
      return "bg-red-50 border-red-300";
    }
    
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          问题 {currentQuestionIndex + 1} / {questions.length}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm border">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
        
        <RadioGroup 
          value={userAnswer?.selectedOption?.toString()} 
          onValueChange={(value) => handleOptionSelect(parseInt(value))}
          className="space-y-3"
          disabled={userAnswer?.isCorrect !== undefined}
        >
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-2 border p-3 rounded-md ${getOptionClassName(index)}`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                {option}
              </Label>
              {userAnswer?.isCorrect !== undefined && index === currentQuestion.correctAnswer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {userAnswer?.isCorrect === false && index === userAnswer.selectedOption && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 space-y-4">
          {userAnswer && userAnswer.isCorrect === undefined && (
            <Button 
              onClick={handleCheckAnswer} 
              disabled={isEvaluating}
              className="w-full bg-edu-600 hover:bg-edu-700"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  评估中...
                </>
              ) : (
                <>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  检查答案
                </>
              )}
            </Button>
          )}

          {explanation && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  {userAnswer?.isCorrect ? (
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 mr-2 text-red-500" />
                  )}
                  解析
                </h4>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {explanation}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        {currentQuestionIndex > 0 && (
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            上一题
          </Button>
        )}
        <div className="flex-1"></div>
        {currentQuestionIndex < questions.length - 1 && (
          <Button 
            variant="outline" 
            onClick={goToNextQuestion}
            className="flex items-center"
          >
            下一题
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
