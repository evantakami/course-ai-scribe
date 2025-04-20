import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle, Repeat, ChevronLeft, ChevronRight, Check, X, RefreshCw } from "lucide-react";
import { Question, QuestionDifficulty, UserAnswer } from "@/types";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const InteractiveQuiz = () => {
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const mockQuestions: Question[] = Array(10).fill(null).map((_, index) => ({
          id: index + 1,
          text: `这是一个关于课程内容的${difficulty}难度测验题，题目内容包含了一个需要思考的问题？`,
          options: [
            "选项A：这是第一个可能的答案",
            "选项B：这是第二个可能的答案", 
            "选项C：这是第三个可能的答案", 
            "选项D：这是第四个可能的答案"
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          difficulty: difficulty,
          explanation: "正确答案是选项B，因为它最符合课程中讲到的内容。选项A虽然看似合理，但缺少了关键要素。选项C和D则与课程主题无关。"
        }));
        
        setQuestions(mockQuestions);
        setIsLoading(false);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setUserAnswers([]);
      }, 1000);
    };
    
    loadQuestions();
  }, [difficulty]);
  
  const handleDifficultyChange = (newDifficulty: QuestionDifficulty) => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty);
    }
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswered) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: selectedOption,
      isCorrect: isCorrect,
      timestamp: new Date()
    };
    
    setUserAnswers([...userAnswers, answer]);
    setIsAnswered(true);
    
    if (isCorrect) {
      toast.success("回答正确！");
    } else {
      toast.error("回答错误！");
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      toast.success(`测验完成！正确率: ${correctAnswers}/${questions.length}`);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      const prevAnswer = userAnswers.find(
        a => a.questionId === questions[currentQuestionIndex - 1].id
      );
      
      if (prevAnswer) {
        setSelectedOption(prevAnswer.selectedOptionIndex);
        setIsAnswered(true);
      } else {
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }
  };
  
  const handleRegenerateQuiz = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success(`已重新生成${
        difficulty === 'easy' ? '简单' : 
        difficulty === 'medium' ? '普通' : 
        '困难'
      }难度测验题`);
      
      const mockQuestions: Question[] = Array(10).fill(null).map((_, index) => ({
        id: index + 100,
        text: `这是一个新生成的${difficulty}难度测验题，内容与之前的题目不同？`,
        options: [
          "新选项A：这是第一个可能的答案",
          "新选项B：这是第二个可能的答案", 
          "新选项C：这是第三个可能的答案", 
          "新选项D：这是第四个可能的答案"
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        difficulty: difficulty,
        explanation: "这是对新题目的解释，详细说明了为什么某个选项是正确答案，而其他选项是错误的。"
      }));
      
      setQuestions(mockQuestions);
      setIsLoading(false);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setUserAnswers([]);
    }, 1500);
  };
  
  const progress = userAnswers.length > 0 
    ? Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100) 
    : 0;

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card className="glass border-0 mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-white flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  互动知识测验
                </CardTitle>
                <CardDescription className="text-gray-300">
                  测试您对课程内容的理解和掌握程度
                </CardDescription>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateQuiz}
                disabled={isLoading}
                className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                重新生成测验
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 bg-dark/20">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">难度：</span>
                <Tabs 
                  value={difficulty} 
                  onValueChange={(value) => handleDifficultyChange(value as QuestionDifficulty)}
                  className="w-full"
                >
                  <TabsList className="glass bg-dark/30 h-8">
                    <TabsTrigger
                      value="easy"
                      className="text-xs px-3 h-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      简单
                    </TabsTrigger>
                    <TabsTrigger
                      value="medium"
                      className="text-xs px-3 h-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      普通
                    </TabsTrigger>
                    <TabsTrigger
                      value="hard"
                      className="text-xs px-3 h-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      困难
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">进度：</span>
                  <span className="text-sm font-medium text-white">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">正确率：</span>
                  <div className="w-32 flex items-center">
                    <Progress value={progress} className="h-2 bg-gray-700" />
                    <span className="text-sm font-medium text-white ml-2">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-white/5" />
                  <Skeleton className="h-20 w-full bg-white/5" />
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full bg-white/5" />
                    <Skeleton className="h-12 w-full bg-white/5" />
                    <Skeleton className="h-12 w-full bg-white/5" />
                    <Skeleton className="h-12 w-full bg-white/5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            questions.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass border-0">
                    <CardHeader className="pb-2 px-6 pt-5 border-b border-white/10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">
                            问题 {currentQuestionIndex + 1}/{questions.length}
                          </Badge>
                          
                          <Badge className={`border-0 ${
                            difficulty === 'easy' 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                              : difficulty === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}>
                            {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '普通' : '困难'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="text-lg font-medium text-white">
                          {questions[currentQuestionIndex].text}
                        </div>
                        
                        <div className="space-y-3">
                          {questions[currentQuestionIndex].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleOptionSelect(index)}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                                selectedOption === index 
                                  ? isAnswered
                                    ? index === questions[currentQuestionIndex].correctAnswer
                                      ? 'bg-green-500/20 border border-green-500/50 text-white'
                                      : 'bg-red-500/20 border border-red-500/50 text-white'
                                    : 'bg-primary/20 border border-primary/50 text-white'
                                  : 'bg-dark/20 border border-gray-700 text-gray-300 hover:bg-dark/40 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                                  selectedOption === index 
                                    ? isAnswered
                                      ? index === questions[currentQuestionIndex].correctAnswer
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                      : 'bg-primary text-white'
                                    : 'bg-gray-700 text-gray-300'
                                }`}>
                                  {isAnswered ? (
                                    index === questions[currentQuestionIndex].correctAnswer ? (
                                      <Check className="h-4 w-4" />
                                    ) : selectedOption === index ? (
                                      <X className="h-4 w-4" />
                                    ) : (
                                      String.fromCharCode(65 + index)
                                    )
                                  ) : (
                                    String.fromCharCode(65 + index)
                                  )}
                                </div>
                                <span>{option}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        
                        {isAnswered && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className={`p-4 rounded-lg ${
                              selectedOption === questions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-red-500/10 border border-red-500/30'
                            }`}
                          >
                            <h4 className={`text-base font-medium mb-2 ${
                              selectedOption === questions[currentQuestionIndex].correctAnswer
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}>
                              {selectedOption === questions[currentQuestionIndex].correctAnswer
                                ? '正确！解释：'
                                : '错误！解释：'}
                            </h4>
                            <p className="text-sm text-gray-300">
                              {questions[currentQuestionIndex].explanation}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        上一题
                      </Button>
                      
                      {!isAnswered ? (
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null}
                          className="bg-primary hover:bg-primary-hover text-white disabled:bg-gray-700"
                        >
                          提交答案
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNextQuestion}
                          className="bg-primary hover:bg-primary-hover text-white"
                        >
                          {currentQuestionIndex < questions.length - 1 ? (
                            <>
                              下一题
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </>
                          ) : (
                            '完成测验'
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveQuiz;
