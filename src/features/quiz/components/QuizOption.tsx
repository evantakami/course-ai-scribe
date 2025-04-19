
import { CheckCircle, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

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
    <motion.div 
      className={`
        flex items-start space-x-2 rounded-md p-4 border transition-all duration-200
        ${isSubmitted ? (
          isCorrect ? 'bg-green-50 border-green-200 shadow-green-100' :
          isSelected ? 'bg-red-50 border-red-200 shadow-red-100' :
          'border-transparent'
        ) : (
          isSelected ? 'bg-blue-50 border-blue-200 shadow-blue-100' : 'hover:bg-gray-50 hover:shadow-md border-transparent'
        )}
      `}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <RadioGroupItem 
        value={index.toString()} 
        id={`option-${index}`}
        disabled={disabled}
        className="mt-1"
      />
      <Label 
        htmlFor={`option-${index}`} 
        className="flex-grow font-normal cursor-pointer prose-sm max-w-none"
      >
        <ReactMarkdown>{option}</ReactMarkdown>
      </Label>
      {isSubmitted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          {isCorrect ? (
            <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
          ) : isSelected ? (
            <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizOption;
