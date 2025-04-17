
import ApiKeyInput from "@/components/ApiKeyInput";
import HistoryDrawer from "@/components/HistoryDrawer";
import CustomPromptSettings from "@/components/CustomPromptSettings";
import UserAccount from "@/components/UserAccount";

interface TopControlsProps {
  onSelectHistoryContent: (content: string) => void;
  onApiKeySet: () => void;
}

const TopControls = ({ onSelectHistoryContent, onApiKeySet }: TopControlsProps) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex space-x-2">
        <HistoryDrawer onSelectContent={onSelectHistoryContent} />
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
