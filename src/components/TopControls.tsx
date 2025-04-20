
import ApiKeyInput from "@/components/ApiKeyInput";
import UserAccount from "@/components/UserAccount";
import CustomPromptSettings from "@/components/CustomPromptSettings";
import SettingsPopover from "@/components/SettingsPopover";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { QuestionDifficulty } from "@/types";

interface TopControlsProps {
  onSelectHistoryContent: (content: string) => void;
  onApiKeySet: () => void;
  onViewCourses: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  generateQuiz: boolean;
  setGenerateQuiz: (value: boolean) => void;
  quizDifficulty: QuestionDifficulty;
  setQuizDifficulty: (difficulty: QuestionDifficulty) => void;
}

const TopControls = ({ 
  onSelectHistoryContent, 
  onApiKeySet, 
  onViewCourses,
  selectedModel,
  onModelChange,
  generateQuiz,
  setGenerateQuiz,
  quizDifficulty,
  setQuizDifficulty
}: TopControlsProps) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={onViewCourses}
        >
          <BookOpen className="h-5 w-5" />
          我的课程
        </Button>
        <CustomPromptSettings />
      </div>
      <div className="flex space-x-2">
        <SettingsPopover
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          generateQuiz={generateQuiz}
          setGenerateQuiz={setGenerateQuiz}
          quizDifficulty={quizDifficulty}
          setQuizDifficulty={setQuizDifficulty}
        />
        <UserAccount />
        <ApiKeyInput onApiKeySet={onApiKeySet} />
      </div>
    </div>
  );
};

export default TopControls;
