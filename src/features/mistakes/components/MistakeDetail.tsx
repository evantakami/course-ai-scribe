
import { UserAnswer } from "@/types";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MistakeDetailProps {
  mistake: UserAnswer | null;
}

const MistakeDetail = ({ mistake }: MistakeDetailProps) => {
  if (!mistake) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center border rounded-lg p-6">
        <HelpCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground mb-2">选择一个错题查看详情</p>
        <p className="text-sm text-muted-foreground/70">
          点击左侧错题列表中的一项以查看详细信息
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border h-[500px] overflow-auto">
      <div className="text-lg font-medium mb-4">
        <ReactMarkdown>{mistake.question || ""}</ReactMarkdown>
      </div>
      
      {mistake.options && (
        <div className="space-y-3 mb-6">
          {mistake.options.map((option, index) => (
            <div 
              key={index} 
              className={`
                flex items-start space-x-2 rounded-md p-3 border
                ${index === mistake.correctAnswer ? 'bg-green-50 border-green-200' :
                  index === mistake.selectedOption ? 'bg-red-50 border-red-200' :
                  'border-gray-100'}
              `}
            >
              <div className="flex-grow font-normal">
                <ReactMarkdown>{option}</ReactMarkdown>
              </div>
              {index === mistake.correctAnswer ? (
                <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
              ) : index === mistake.selectedOption ? (
                <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
              ) : null}
            </div>
          ))}
        </div>
      )}
      
      {mistake.explanation && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="flex items-center text-sm font-medium text-blue-800 mb-2">
            <HelpCircle className="mr-1 h-4 w-4" />
            解析
          </h4>
          <div className="text-sm text-gray-700 prose max-w-none">
            <ReactMarkdown>{mistake.explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MistakeDetail;
