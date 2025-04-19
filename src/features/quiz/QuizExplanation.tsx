
import { HelpCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface QuizExplanationProps {
  isLoading: boolean;
  explanation: string | null | undefined;
  customExplanation: string | null;
}

const QuizExplanation = ({
  isLoading,
  explanation,
  customExplanation
}: QuizExplanationProps) => {
  if (!explanation && !customExplanation && !isLoading) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h4 className="flex items-center text-sm font-medium text-blue-800 mb-2">
        <HelpCircle className="mr-1 h-4 w-4" />
        解析
      </h4>
      <div className="text-sm text-gray-700 prose max-w-none">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>生成解析中...</span>
          </div>
        ) : (
          <ReactMarkdown>
            {customExplanation || explanation || "暂无解析"}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default QuizExplanation;
