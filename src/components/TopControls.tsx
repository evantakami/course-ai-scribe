
import ApiKeyInput from "@/components/ApiKeyInput";
import UserAccount from "@/components/UserAccount";
import CustomPromptSettings from "@/components/CustomPromptSettings";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface TopControlsProps {
  onSelectHistoryContent: (content: string) => void;
  onApiKeySet: () => void;
  onViewCourses?: () => void;
}

const TopControls = ({ onSelectHistoryContent, onApiKeySet, onViewCourses }: TopControlsProps) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => onViewCourses && onViewCourses()}
        >
          <BookOpen className="h-5 w-5" />
          我的课程
        </Button>
        <CustomPromptSettings />
      </div>
      <div className="flex space-x-2">
        <UserAccount />
        <ApiKeyInput onApiKeySet={onApiKeySet} />
      </div>
    </div>
  );
};

export default TopControls;
