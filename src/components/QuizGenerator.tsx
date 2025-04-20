
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
  
  // Store answers separately by quiz batch
  const getQuizBatchId = (difficulty: QuestionDifficulty) => {
    if (!questions || !questions[difficulty] || questions[difficulty]?.length === 0) {
      return `${difficulty}-empty`;
    }
    // Create ID based on first and last question IDs to identify this batch of questions
    const questionSet = questions[difficulty] || [];
    if (questionSet.length === 0) return `${difficulty}-empty`;
    
    // Add null checks for getting first and last IDs
    const firstId = questionSet[0]?.id || 0;
    const lastId = questionSet[questionSet.length - 1]?.id || 0;
    return `${difficulty}-${firstId}-${lastId}`;
  };

  const handleDifficultyChange = (value: string) => {
    const difficulty = value as QuestionDifficulty;
    setActiveDifficulty(difficulty);
    onDifficultyChange(difficulty);
    // Increment key to force Quiz component to remount when difficulty changes
    setKey(prev => prev + 1);
  };

  const handleRegenerateClick = () => {
    if (onRegenerateQuiz) {
      // Clear existing answers for this difficulty when regenerating
      const batchId = getQuizBatchId(activeDifficulty);
      setAnswersById(prev => {
        const updated = { ...prev };
        delete updated[batchId]; // Remove answers for this batch
        return updated;
      });
      
      onRegenerateQuiz(activeDifficulty);
      // Increment key to remount Quiz component with fresh state
      setKey(prev => prev + 1);
    }
  };

  const getCurrentQuestions = () => {
    if (!questions) return [];
    const questionsForDifficulty = questions[activeDifficulty];
    return questionsForDifficulty || [];
  };

  const currentQuestions = getCurrentQuestions();
  const isCurrentDifficultyGenerating = isGenerating && (!currentQuestions || currentQuestions.length === 0);
  
  // Create a custom save function that includes the current difficulty and batch ID
  const handleSaveUserAnswers = (userAnswers: UserAnswer[]) => {
    if (!userAnswers.length) return;
    
    const batchId = getQuizBatchId(activeDifficulty);
    
    // Store answers by batch ID
    setAnswersById(prev => ({
      ...prev,
      [batchId]: userAnswers
    }));
    
    if (saveUserAnswers) {
      saveUserAnswers(userAnswers);
    }
  };
  
  // Get answers for current batch
  const getCurrentBatchAnswers = () => {
    const batchId = getQuizBatchId(activeDifficulty);
    return answersById[batchId] || [];
  };

  // Force re-render of Quiz component when difficulty changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [activeDifficulty]);
  
  // Also force re-render when questions change for the current difficulty
  useEffect(() => {
    if (questions && questions[activeDifficulty]) {
      // When questions change, we need to generate a new key
      // but we want to preserve answers if they exist
      const oldBatchId = getQuizBatchId(activeDifficulty);
      
      // After a short delay to ensure the new questions are loaded
      setTimeout(() => {
        const newBatchId = getQuizBatchId(activeDifficulty);
        
        // If the batch ID changed, it means we got new questions
        if (newBatchId !== oldBatchId) {
          setKey(prev => prev + 1);
        }
      }, 100);
    }
  }, [questions, activeDifficulty]);

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
