
import { useState, useEffect } from "react";
import { Question, QuestionDifficulty, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { toast } from "sonner";
import Quiz from "./Quiz";
import { motion } from "framer-motion";

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
      toast.info("正在重新生成测验题...");
    }
  };

  const getCurrentQuestions = () => {
    if (!questions) return [];
    return questions[activeDifficulty] || [];
  };

  const currentQuestions = getCurrentQuestions();
  const isCurrentDifficultyGenerating = isGenerating && !currentQuestions?.length;
  
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">知识测验</CardTitle>
          {onRegenerateQuiz && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerateClick}
              disabled={isGenerating}
              className="space-x-2 hover:shadow-md transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
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
              <TabsTrigger value="easy" className="data-[state=active]:bg-green-100">简单</TabsTrigger>
              <TabsTrigger value="medium" className="data-[state=active]:bg-yellow-100">普通</TabsTrigger>
              <TabsTrigger value="hard" className="data-[state=active]:bg-red-100">困难</TabsTrigger>
            </TabsList>
            
            {isCurrentDifficultyGenerating ? (
              <LoadingState message="正在生成测验题..." />
            ) : currentQuestions && currentQuestions.length > 0 ? (
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value={activeDifficulty} className="mt-0">
                  <Quiz 
                    key={`${activeDifficulty}-${key}`} 
                    questions={currentQuestions}
                    initialAnswers={getCurrentBatchAnswers()}
                    saveUserAnswers={handleSaveUserAnswers}
                  />
                </TabsContent>
              </motion.div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                当前难度尚未生成测验题
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizGenerator;
