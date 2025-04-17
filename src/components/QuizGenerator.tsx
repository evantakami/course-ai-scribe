
import { useState } from "react";
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

  const handleDifficultyChange = (value: string) => {
    const difficulty = value as QuestionDifficulty;
    setActiveDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  const handleRegenerateClick = () => {
    if (onRegenerateQuiz) {
      onRegenerateQuiz(activeDifficulty);
    }
  };

  const getCurrentQuestions = () => {
    if (!questions) return null;
    return questions[activeDifficulty] || [];
  };

  const currentQuestions = getCurrentQuestions();
  const isCurrentDifficultyGenerating = isGenerating && !currentQuestions?.length;

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
              <Quiz questions={currentQuestions} saveUserAnswers={saveUserAnswers} />
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
