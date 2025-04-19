
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface GenerationProgressProps {
  summaryProgress: number;
  quizProgress: number;
  isGenerating: boolean;
}

const GenerationProgress = ({ 
  summaryProgress, 
  quizProgress, 
  isGenerating 
}: GenerationProgressProps) => {
  // Calculate total progress as average of both progresses
  const totalProgress = Math.round((summaryProgress + quizProgress) / 2);
  
  if (!isGenerating) return null;

  return (
    <div className="w-full space-y-4 my-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          正在生成内容...
        </div>
        <span>{totalProgress}%</span>
      </div>
      <Progress value={totalProgress} className="h-2" />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex justify-between mb-1">
            <span>摘要生成</span>
            <span>{summaryProgress}%</span>
          </div>
          <Progress value={summaryProgress} className="h-1" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>测验生成</span>
            <span>{quizProgress}%</span>
          </div>
          <Progress value={quizProgress} className="h-1" />
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;
