
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AIModelOption,
  AI_MODELS,
  QuestionDifficulty
} from "@/types";

interface SettingsPopoverProps {
  selectedModel: string;
  onModelChange: (value: string) => void;
  generateQuiz: boolean;
  setGenerateQuiz: (value: boolean) => void;
  quizDifficulty: QuestionDifficulty;
  setQuizDifficulty: (value: QuestionDifficulty) => void;
}

const SettingsPopover = ({
  selectedModel,
  onModelChange,
  generateQuiz,
  setGenerateQuiz,
  quizDifficulty,
  setQuizDifficulty
}: SettingsPopoverProps) => {
  const difficultyOptions = [
    { value: "easy" as QuestionDifficulty, label: "简单" },
    { value: "medium" as QuestionDifficulty, label: "普通" },
    { value: "hard" as QuestionDifficulty, label: "困难" }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">AI模型设置</h4>
          <div className="space-y-2">
            <Label htmlFor="model">选择模型</Label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger id="model">
                <SelectValue placeholder="选择AI模型" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="generateQuiz" 
                checked={generateQuiz} 
                onCheckedChange={(checked) => 
                  setGenerateQuiz(checked as boolean)
                }
              />
              <Label htmlFor="generateQuiz">上传时直接生成测验题</Label>
            </div>
            
            {generateQuiz && (
              <div className="ml-6 mt-2">
                <Label htmlFor="difficulty">测验难度</Label>
                <Select 
                  value={quizDifficulty} 
                  onValueChange={(value: string) => {
                    // Ensure we're passing a valid QuestionDifficulty type
                    if (value === "easy" || value === "medium" || value === "hard") {
                      setQuizDifficulty(value);
                    }
                  }}
                >
                  <SelectTrigger id="difficulty" className="mt-1">
                    <SelectValue placeholder="选择难度" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsPopover;
