
import ApiKeyInput from "@/components/ApiKeyInput";
import HistoryDrawer from "@/components/HistoryDrawer";
import CustomPromptSettings from "@/components/CustomPromptSettings";

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
      <ApiKeyInput onApiKeySet={onApiKeySet} />
    </div>
  );
};

export default TopControls;
