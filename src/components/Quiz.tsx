
import { useState, useEffect } from "react";
import { Question, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, HelpCircle, BookOpen } from "lucide-react";
import { openaiService } from "@/services/openaiService";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface QuizProps {
  questions: Question[];
}

const Quiz = ({ questions }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isShowingExplanation, setIsShowingExplanation] = useState(false);

  // Load saved answers for this quiz session if available
  useEffect(() => {
    const savedAnswers = localStorage.getItem('current_quiz_answers');
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setUserAnswers(parsedAnswers);
      } catch (error) {
        console.error("Failed to load saved answers:", error);
      }
    }
  }, []);

  // Save answers whenever they change
  useEffect(() => {
    if (userAnswers.length > 0) {
      localStorage.setItem('current_quiz_answers', JSON.stringify(userAnswers));
    }
  }, [userAnswers]);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);
  const isAnswerSubmitted = userAnswer !== undefined;
  const isCorrect = userAnswer?.isCorrect;

  const handleSelectOption = (value: string) => {
    const optionIndex = parseInt(value);
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      question: currentQuestion.text,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      timestamp: new Date()
    };
    
    setUserAnswers(prev => [
      ...prev.filter(a => a.questionId !== currentQuestion.id),
      newAnswer
    ]);
    
    // Automatically show explanation
    setIsShowingExplanation(true);
    
    // Save this answer to mistake collection if it's wrong
    if (!isCorrect) {
      saveToMistakeCollection(newAnswer);
    }
  };

  const saveToMistakeCollection = (answer: UserAnswer) => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      let mistakes = JSON.parse(mistakesString);
      
      // Check if this question is already in the collection
      const existingIndex = mistakes.findIndex((m: UserAnswer) => m.questionId === answer.questionId);
      
      if (existingIndex >= 0) {
        // Update existing entry
        mistakes[existingIndex] = answer;
      } else {
        // Add new entry
        mistakes.push(answer);
      }
      
      localStorage.setItem('mistake_collection', JSON.stringify(mistakes));
    } catch (error) {
      console.error("Failed to save to mistake collection:", error);
    }
  };

  const handleSaveToMistakeCollection = () => {
    if (!userAnswer) return;
    
    saveToMistakeCollection(userAnswer);
    toast.success("已添加到错题本");
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsShowingExplanation(false);
    setCurrentQuestionIndex(prev => 
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setIsShowingExplanation(false);
    setCurrentQuestionIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  const handleToggleExplanation = () => {
    setIsShowingExplanation(!isShowingExplanation);
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

        {isAnswerSubmitted && isShowingExplanation && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="flex items-center text-sm font-medium text-blue-800 mb-2">
              <HelpCircle className="mr-1 h-4 w-4" />
              解析
            </h4>
            <div className="text-sm text-gray-700 prose max-w-none">
              <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              上一题
            </Button>
            
            {isAnswerSubmitted && (
              <>
                {!isCorrect && (
                  <Button
                    variant="outline"
                    onClick={handleSaveToMistakeCollection}
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    添加到错题本
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleToggleExplanation}
                  className="flex items-center gap-1"
                >
                  <HelpCircle className="h-4 w-4" />
                  {isShowingExplanation ? "隐藏解析" : "我为什么错了？"}
                </Button>
              </>
            )}
          </div>

          {!isAnswerSubmitted ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedOption === null}
              className="bg-edu-600 hover:bg-edu-700"
            >
              确认答案
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
