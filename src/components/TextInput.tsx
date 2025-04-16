
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { SummaryLanguage, QuestionDifficulty } from "@/types";

interface TextInputProps {
  textContent: string;
  setTextContent: (content: string) => void;
  onHandleFileUpload: () => void;
  onSubmitText: () => void;
  isLoading: boolean;
  onSaveContent: () => void;
}

const TextInput = ({
  textContent,
  setTextContent,
  onHandleFileUpload,
  onSubmitText,
  isLoading,
  onSaveContent
}: TextInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">输入课程内容</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveContent}
            disabled={textContent.trim().length === 0}
          >
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onHandleFileUpload}
          >
            <UploadCloud className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Textarea 
        placeholder="粘贴或输入课程对话内容..." 
        className="min-h-[300px]"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
      />
      
      <Button 
        className="w-full bg-edu-600 hover:bg-edu-700" 
        onClick={onSubmitText}
        disabled={isLoading || textContent.trim().length === 0}
      >
        {isLoading ? "处理中..." : "处理内容"}
      </Button>
    </div>
  );
};

export default TextInput;
