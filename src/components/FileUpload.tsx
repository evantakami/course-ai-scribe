
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

  const handleProcess = () => {
    if (content.trim().length < 50) {
      alert("请输入至少50个字符的内容");
      return;
    }
    onContentLoaded(content, true, selectedCourseId);
  };

  const handleSaveContent = () => {
    if (content.trim().length > 0) {
      localStorage.setItem('saved_content', content);
      alert("内容已保存");
    }
  };

  return (
    <div className="space-y-4 w-full max-w-3xl">
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
            placeholder="请输入或粘贴课程内容..." 
            className="min-h-[300px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveContent}
              disabled={content.trim().length === 0 || isLoading}
            >
              保存
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
                "处理内容"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
