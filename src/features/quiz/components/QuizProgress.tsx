
import { UserAnswer } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
}

const QuizProgress = ({ 
  currentIndex, 
  totalQuestions, 
  userAnswers 
}: QuizProgressProps) => {
  const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
  const progress = (userAnswers.length / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          题目 {currentIndex + 1} / {totalQuestions}
        </div>
        <div className="text-sm flex items-center space-x-4">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
            <span>{correctAnswers} 正确</span>
          </motion.div>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <XCircle className="text-red-500 h-4 w-4 mr-1" />
            <span>{userAnswers.length - correctAnswers} 错误</span>
          </motion.div>
        </div>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-2" />
        <motion.div
          className="absolute left-0 top-0 h-2 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
