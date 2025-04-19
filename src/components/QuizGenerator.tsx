
import { useState, useEffect } from "react";
import { Question, QuestionDifficulty, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw } from "lucide-react";
import Quiz from "./Quiz";

interface QuizGeneratorProps {
  questions: {
    easy?: Question[];
    medium?: Question[];
    hard?: Question[];
  } | null;
  isGenerating: boolean;
  onDifficultyChange: (difficulty: QuestionDifficulty) => void;
  saveUserAnswers?: (userAnswers: UserAnswer[]) => void;
  onRegenerateQuiz?: (difficulty: QuestionDifficulty) => void;
}

const QuizGenerator = ({
  questions,
  isGenerating,
  onDifficultyChange,
  saveUserAnswers,
  onRegenerateQuiz,
}: QuizGeneratorProps) => {
  const [activeDifficulty, setActiveDifficulty] = useState<QuestionDifficulty>("medium");
  const [key, setKey] = useState<number>(0);
  const [answersById, setAnswersById] = useState<{[id: string]: UserAnswer[]}>({});
  
  const getQuizBatchId = (difficulty: QuestionDifficulty) => {
    if (!questions || !questions[difficulty] || questions[difficulty]?.length === 0) {
      return `${difficulty}-empty`;
    }
    const questionSet = questions[difficulty] || [];
    if (questionSet.length === 0) return `${difficulty}-empty`;
    const firstId = questionSet[0]?.id;
    const lastId = questionSet[questionSet.length - 1]?.id;
    return `${difficulty}-${firstId}-${lastId}`;
  };

  const handleDifficultyChange = (value: string) => {
    const difficulty = value as QuestionDifficulty;
    setActiveDifficulty(difficulty);
    onDifficultyChange(difficulty);
    setKey(prev => prev + 1);
  };

  const handleRegenerateClick = () => {
    if (onRegenerateQuiz) {
      const batchId = getQuizBatchId(activeDifficulty);
      setAnswersById(prev => {
        const updated = { ...prev };
        delete updated[batchId];
        return updated;
      });
      
      onRegenerateQuiz(activeDifficulty);
      setKey(prev => prev + 1);
    }
  };

  const getCurrentQuestions = () => {
    if (!questions) return [];
    return questions[activeDifficulty] || [];
  };

  const currentQuestions = getCurrentQuestions();
  const isCurrentDifficultyGenerating = isGenerating && (!currentQuestions || currentQuestions.length === 0);
  
  const handleSaveUserAnswers = (userAnswers: UserAnswer[]) => {
    if (!userAnswers.length) return;
    
    const batchId = getQuizBatchId(activeDifficulty);
    
    setAnswersById(prev => ({
      ...prev,
      [batchId]: userAnswers
    }));
    
    if (saveUserAnswers) {
      saveUserAnswers(userAnswers);
    }
  };
  
  const getCurrentBatchAnswers = () => {
    const batchId = getQuizBatchId(activeDifficulty);
    return answersById[batchId] || [];
  };

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [activeDifficulty]);
  
  useEffect(() => {
    if (questions && questions[activeDifficulty]) {
      setTimeout(() => {
        const newBatchId = getQuizBatchId(activeDifficulty);
        const oldBatchId = Object.keys(answersById).find(id => id.startsWith(activeDifficulty));
        
        if (newBatchId !== oldBatchId) {
          setKey(prev => prev + 1);
        }
      }, 100);
    }
  }, [questions, activeDifficulty, answersById]);

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>知识测验</CardTitle>
        {onRegenerateQuiz && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRegenerateClick}
            disabled={isGenerating}
            className="space-x-1"
          >
            {isGenerating && activeDifficulty ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            <span>重新生成</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="medium" 
          value={activeDifficulty}
          onValueChange={handleDifficultyChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="easy">简单</TabsTrigger>
            <TabsTrigger value="medium">普通</TabsTrigger>
            <TabsTrigger value="hard">困难</TabsTrigger>
          </TabsList>
          
          {isCurrentDifficultyGenerating ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-edu-500" />
              <span className="ml-3 text-lg text-edu-600">正在生成测验题...</span>
            </div>
          ) : currentQuestions && currentQuestions.length > 0 ? (
            <TabsContent value={activeDifficulty} className="mt-0">
              <Quiz 
                key={`${activeDifficulty}-${key}`} 
                questions={currentQuestions}
                initialAnswers={getCurrentBatchAnswers()}
                saveUserAnswers={handleSaveUserAnswers}
              />
            </TabsContent>
          ) : (
            <div className="text-center py-10 text-gray-500">
              当前难度尚未生成测验题
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuizGenerator;
