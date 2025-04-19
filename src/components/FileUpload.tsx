
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from "lucide-react";
import CustomPromptSettings from '@/components/CustomPromptSettings';
import CourseSelector from '@/components/courses/CourseSelector';

interface FileUploadProps {
  isLoading: boolean;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onContentLoaded: (
    content: string,
    generateQuiz: boolean,
    courseId: string
  ) => void;
  generateAllContent?: boolean;
}

const FileUpload = ({ 
  isLoading, 
  selectedCourseId, 
  onSelectCourse, 
  onContentLoaded,
  generateAllContent = true
}: FileUploadProps) => {
  const [content, setContent] = useState<string>("");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);

  const handleProcess = () => {
    if (content.trim().length < 50) {
      alert("请输入至少50个字符的内容");
      return;
    }
    onContentLoaded(content, generateQuiz, selectedCourseId);
  };

  const handleClear = () => {
    setContent("");
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
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
            placeholder="请在此输入或粘贴需要处理的内容..." 
            className="min-h-[300px] font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex justify-between items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={content.trim().length === 0 || isLoading}
            >
              清空内容
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setGenerateQuiz(!generateQuiz)}
                className={generateQuiz ? "bg-primary/10" : ""}
              >
                {generateQuiz ? "✓ 生成测验题" : "生成测验题"}
              </Button>
              
              <Button
                onClick={handleProcess}
                disabled={isLoading || content.trim().length < 50}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    处理中...
                  </>
                ) : (
                  "开始处理"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
