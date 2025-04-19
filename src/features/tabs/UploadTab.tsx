
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import CourseSelector from "@/components/courses/CourseSelector";
import CustomPromptSettings from "@/components/CustomPromptSettings";

interface UploadTabProps {
  isLoading: boolean;
  handleContentLoaded: (
    content: string,
    generateQuiz: boolean,
    courseId: string
  ) => void;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

const UploadTab = ({
  isLoading,
  handleContentLoaded,
  selectedCourseId,
  onSelectCourse
}: UploadTabProps) => {
  const [content, setContent] = useState<string>("");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleGenerateQuizChange = (value: string) => {
    setGenerateQuiz(value === "yes");
  };

  const handleProcess = () => {
    if (content.trim().length < 50) {
      alert("请输入至少50个字符的内容");
      return;
    }
    handleContentLoaded(content, generateQuiz, selectedCourseId);
  };

  return (
    <TabsContent value="upload" className="space-y-4">
      <div className="flex justify-between items-center">
        <CourseSelector 
          selectedCourseId={selectedCourseId}
          onSelectCourse={onSelectCourse}
        />
        <CustomPromptSettings />
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <Textarea
            placeholder="粘贴文本内容..."
            className="min-h-[250px] font-mono text-sm"
            value={content}
            onChange={handleTextChange}
          />
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              生成测验题
            </label>
            <Select
              value={generateQuiz ? "yes" : "no"}
              onValueChange={handleGenerateQuizChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="是否生成测验题" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">是</SelectItem>
                <SelectItem value="no">否</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleProcess}
            className="w-full"
            disabled={isLoading || content.trim().length < 50}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              "处理内容"
            )}
          </Button>
        </div>
      </Card>
    </TabsContent>
  );
};

export default UploadTab;
