
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, QuestionDifficulty, UserAnswer } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Quiz from '@/components/Quiz';

interface InteractiveQuizProps {
  questions?: {
    easy?: Question[];
    medium?: Question[];
    hard?: Question[];
  } | null;
  courseId?: string;
  rawContent?: string;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ 
  questions, 
  courseId = "default",
  rawContent = ""
}) => {
  const navigate = useNavigate();
  const [activeDifficulty, setActiveDifficulty] = useState<QuestionDifficulty>("medium");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  useEffect(() => {
    // Load saved answers for this course if available
    const loadSavedAnswers = () => {
      try {
        if (courseId) {
          const savedAnswers = localStorage.getItem(`quiz_answers_${courseId}`);
          if (savedAnswers) {
            setUserAnswers(JSON.parse(savedAnswers));
          }
        }
      } catch (error) {
        console.error("Error loading saved answers:", error);
      }
    };

    loadSavedAnswers();
  }, [courseId]);

  const handleDifficultyChange = (difficulty: QuestionDifficulty) => {
    setActiveDifficulty(difficulty);
  };

  const saveUserAnswersToHistory = (newAnswers: UserAnswer[]) => {
    setUserAnswers(newAnswers);
    
    // Save to local storage
    try {
      if (courseId) {
        localStorage.setItem(`quiz_answers_${courseId}`, JSON.stringify(newAnswers));
      }
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const handleRegenerateQuiz = () => {
    // This would typically call an API to regenerate the quiz
    // For now, we'll just show a toast
    toast.info("重新生成测验功能需要连接到API");
  };

  const getCurrentQuestions = () => {
    if (!questions) return [];
    return questions[activeDifficulty] || [];
  };

  const currentQuestions = getCurrentQuestions();

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white flex items-center">
                  互动知识测验
                </CardTitle>
                <CardDescription className="text-gray-300">
                  测试您对课程内容的理解和记忆
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => navigate('/summary')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回摘要
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>知识测验</CardTitle>
            <CardDescription>
              选择难度并回答问题，测试您对内容的掌握程度
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={activeDifficulty}
              value={activeDifficulty}
              onValueChange={(val) => handleDifficultyChange(val as QuestionDifficulty)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="easy">简单</TabsTrigger>
                <TabsTrigger value="medium">普通</TabsTrigger>
                <TabsTrigger value="hard">困难</TabsTrigger>
              </TabsList>
              
              {isGenerating ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-lg text-white">正在生成测验题...</span>
                </div>
              ) : currentQuestions && currentQuestions.length > 0 ? (
                <TabsContent value={activeDifficulty} className="mt-0">
                  <Quiz 
                    questions={currentQuestions}
                    saveUserAnswers={saveUserAnswersToHistory}
                  />
                </TabsContent>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {rawContent ? "正在加载测验题..." : "请先上传课程内容以生成测验题"}
                  {!rawContent && (
                    <div className="mt-4">
                      <Button onClick={() => navigate('/upload')}>
                        上传课程内容
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/summary-report')}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              查看摘要报告
            </Button>
            <Button 
              onClick={() => navigate('/revision')}
              className="bg-edu-600 hover:bg-edu-700"
            >
              前往复盘中心
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default InteractiveQuiz;
