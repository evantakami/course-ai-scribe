
import { CheckCircle, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";

interface QuizOptionProps {
  index: number;
  option: string;
  isSubmitted: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  disabled: boolean;
}

const QuizOption = ({
  index,
  option,
  isSubmitted,
  isSelected,
  isCorrect,
  disabled
}: QuizOptionProps) => {
  return (
    <div className={`
      flex items-start space-x-2 rounded-md p-3 border transition-colors
      ${isSubmitted ? (
        isCorrect ? 'bg-green-50 border-green-200' :
        isSelected ? 'bg-red-50 border-red-200' :
        'border-transparent'
      ) : (
        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'
      )}
    `}>
      <RadioGroupItem 
        value={index.toString()} 
        id={`option-${index}`}
        disabled={disabled}
      />
      <Label 
        htmlFor={`option-${index}`} 
        className="flex-grow font-normal cursor-pointer"
      >
        <ReactMarkdown>{option}</ReactMarkdown>
      </Label>
      {isSubmitted && (
        isCorrect ? (
          <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
        ) : isSelected ? (
          <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
        ) : null
      )}
    </div>
  );
};

export default QuizOption;
