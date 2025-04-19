
import { Progress } from "@/components/ui/progress";

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
  if (!isGenerating) {
    return null;
  }

  return (
    <div className="space-y-2">
      {summaryProgress > 0 && summaryProgress < 100 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>生成摘要</span>
            <span>{summaryProgress}%</span>
          </div>
          <Progress value={summaryProgress} className="h-1" />
        </div>
      )}
      
      {quizProgress > 0 && quizProgress < 100 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>生成测验题</span>
            <span>{quizProgress}%</span>
          </div>
          <Progress value={quizProgress} className="h-1" />
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;
