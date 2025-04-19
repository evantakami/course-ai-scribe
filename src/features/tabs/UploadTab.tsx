
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
import { SummaryLanguage, QuestionDifficulty } from "@/types";
import { Loader2 } from "lucide-react";
import CourseSelector from "@/components/courses/CourseSelector";
import FileUploader from "@/components/FileUploader";
import CustomPromptSettings from "@/components/CustomPromptSettings";

interface UploadTabProps {
  isLoading: boolean;
  handleContentLoaded: (
    content: string,
    generateQuiz: boolean,
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
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
  const [language, setLanguage] = useState<SummaryLanguage>("chinese");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);
  const [quizDifficulty, setQuizDifficulty] = useState<QuestionDifficulty>("medium");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SummaryLanguage);
  };

  const handleGenerateQuizChange = (value: string) => {
    setGenerateQuiz(value === "yes");
  };

  const handleQuizDifficultyChange = (value: string) => {
    setQuizDifficulty(value as QuestionDifficulty);
  };

  const handleProcess = () => {
    if (content.trim().length < 50) {
      alert("请输入至少50个字符的内容");
      return;
    }
    handleContentLoaded(content, generateQuiz, quizDifficulty, language, selectedCourseId);
  };

  // Create a handler that FileUploader can use
  const handleUploadSuccess = (text: string) => {
    setContent(text);
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
          {/* Pass compatible props to FileUploader */}
          <FileUploader 
            onDrop={(files) => {
              const file = files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const text = e.target?.result as string;
                  handleUploadSuccess(text);
                };
                reader.readAsText(file);
              }
            }}
            selectedFile={null}
            onHandleManualTextInput={() => {}}
            onHandleUpload={() => {}}
            isLoading={isLoading}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
          />
          
          <Textarea
            placeholder="粘贴文本内容，或上传文件..."
            className="min-h-[250px] font-mono text-sm"
            value={content}
            onChange={handleTextChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                语言
              </label>
              <Select
                value={language}
                onValueChange={handleLanguageChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chinese">中文</SelectItem>
                  <SelectItem value="english">英文</SelectItem>
                  <SelectItem value="spanish">西班牙语</SelectItem>
                  <SelectItem value="french">法语</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
            
            {generateQuiz && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  测验难度
                </label>
                <Select
                  value={quizDifficulty}
                  onValueChange={handleQuizDifficultyChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择难度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">简单</SelectItem>
                    <SelectItem value="medium">普通</SelectItem>
                    <SelectItem value="hard">困难</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
