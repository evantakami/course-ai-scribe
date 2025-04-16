
import { useState } from "react";
import { Question, QuestionDifficulty } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Quiz from "./Quiz";

interface QuizGeneratorProps {
  questions: Question[] | null;
  isGenerating: boolean;
  onDifficultyChange: (difficulty: QuestionDifficulty) => void;
}

const QuizGenerator = ({
  questions,
  isGenerating,
  onDifficultyChange,
}: QuizGeneratorProps) => {
  const [activeDifficulty, setActiveDifficulty] = useState<QuestionDifficulty>("medium");

  const handleDifficultyChange = (value: string) => {
    const difficulty = value as QuestionDifficulty;
    setActiveDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>知识测验</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="medium" 
          value={activeDifficulty}
          onValueChange={handleDifficultyChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="easy">简单</TabsTrigger>
            <TabsTrigger value="medium">普通</TabsTrigger>
            <TabsTrigger value="hard">困难</TabsTrigger>
          </TabsList>
          
          {isGenerating ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-edu-500" />
              <span className="ml-2 text-edu-600">正在生成测验题...</span>
            </div>
          ) : questions ? (
            <TabsContent value={activeDifficulty} className="mt-0">
              <Quiz questions={questions} />
            </TabsContent>
          ) : (
            <div className="text-center py-8 text-gray-500">
              点击上方"生成测验题"按钮开始创建测验
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuizGenerator;
