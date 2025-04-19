
import React, { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { SummaryLanguage, QuestionDifficulty } from '@/types';
import FileUploader from '@/components/FileUploader';
import TextInput from '@/components/TextInput';
import { Card } from '@/components/ui/card';
import CourseSelector from '@/components/courses/CourseSelector';
import CustomPromptSettings from '@/components/CustomPromptSettings';

interface FileUploadProps {
  isLoading: boolean;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onContentLoaded: (
    content: string,
    generateQuiz: boolean,
    language: SummaryLanguage,
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
  const [language, setLanguage] = useState<SummaryLanguage>("chinese");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);
  const [showUploader, setShowUploader] = useState<boolean>(true);

  const handleLanguageChange = (value: SummaryLanguage) => {
    setLanguage(value);
  };

  const handleUploadSuccess = (text: string) => {
    setContent(text);
  };

  const handleProcess = () => {
    if (content.trim().length < 50) {
      alert("请输入至少50个字符的内容");
      return;
    }
    onContentLoaded(content, generateQuiz, language, selectedCourseId);
  };

  const handleTextInput = () => {
    setShowUploader(false);
  };

  const handleFileUpload = () => {
    setShowUploader(true);
  };

  const handleSaveContent = () => {
    // Save content to localStorage or elsewhere
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
        {showUploader ? (
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
            onHandleManualTextInput={handleTextInput}
            onHandleUpload={handleProcess}
            isLoading={isLoading}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
          />
        ) : (
          <TextInput 
            textContent={content}
            setTextContent={setContent}
            onHandleFileUpload={handleFileUpload}
            onSubmitText={handleProcess}
            isLoading={isLoading}
            onSaveContent={handleSaveContent}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
          />
        )}

        <div className="mt-4">
          <label className="text-sm font-medium mb-1 block">
            语言
          </label>
          <LanguageSelector 
            value={language}
            onChange={handleLanguageChange}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
