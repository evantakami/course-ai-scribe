
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback, useEffect } from "react";
import { SummaryLanguage, QuestionDifficulty } from "@/types";
import { openaiService } from "@/services/openaiService";
import TextInput from "./TextInput";
import FileUploader from "./FileUploader";
import SettingsPopover from "./SettingsPopover";
import LanguageSelector from "./LanguageSelector";
import { toast } from "sonner";

interface FileUploadProps {
  onContentLoaded: (
    content: string, 
    generateQuiz: boolean, 
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
    courseId: string
  ) => void;
  isLoading: boolean;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  generateAllContent?: boolean;
}

const FileUpload = ({ 
  onContentLoaded, 
  isLoading, 
  selectedCourseId,
  onSelectCourse,
  generateAllContent = false
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [isTextMode, setIsTextMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<SummaryLanguage>("chinese");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);
  const [quizDifficulty, setQuizDifficulty] = useState<QuestionDifficulty>("medium");
  const [selectedModel, setSelectedModel] = useState<string>(openaiService.getModel() || "");

  // Initialize selectedCourseId if not set
  useEffect(() => {
    if (!selectedCourseId) {
      try {
        const userProfileString = localStorage.getItem('user_profile');
        if (userProfileString) {
          const userProfile = JSON.parse(userProfileString);
          if (userProfile.courses && userProfile.courses.length > 0) {
            onSelectCourse(userProfile.courses[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to initialize course:", error);
      }
    }
  }, [selectedCourseId, onSelectCourse]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const handleLanguageChange = (value: SummaryLanguage) => {
    setLanguage(value);
  };

  const handleManualTextInput = () => {
    setIsTextMode(true);
    setSelectedFile(null);
  };

  const handleFileUpload = () => {
    setIsTextMode(false);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    openaiService.setModel(value);
  };

  const handleSubmitText = () => {
    if (textContent.trim().length === 0) {
      toast.error("请输入课程内容");
      return;
    }
    if (!selectedCourseId) {
      toast.error("请先选择课程");
      return;
    }
    
    // Always generate quiz with all content
    if (generateAllContent) {
      onContentLoaded(textContent, true, quizDifficulty, language, selectedCourseId);
    } else {
      onContentLoaded(textContent, generateQuiz, quizDifficulty, language, selectedCourseId);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    if (!selectedCourseId) {
      toast.error("请先选择课程");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Always generate quiz with all content
        if (generateAllContent) {
          onContentLoaded(content, true, quizDifficulty, language, selectedCourseId);
        } else {
          onContentLoaded(content, generateQuiz, quizDifficulty, language, selectedCourseId);
        }
      } else {
        toast.error("无法读取文件内容");
      }
    };
    reader.onerror = () => {
      toast.error("读取文件出错");
    };
    if (selectedFile) {
      reader.readAsText(selectedFile);
    }
  };

  const handleSaveContent = () => {
    if (textContent.trim().length === 0) {
      toast.error("没有内容可保存");
      return;
    }
    
    if (!selectedCourseId) {
      toast.error("请先选择课程");
      return;
    }
    
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      let mistakes = JSON.parse(historyString);
      
      // Extract title from first line
      const firstLine = textContent.split('\n')[0] || '';
      let title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      
      const newItem = {
        id: Date.now().toString(),
        rawContent: textContent,
        timestamp: new Date(),
        title,
        courseId: selectedCourseId
      };
      
      const updatedHistory = [newItem, ...mistakes].slice(0, 50);
      
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
      toast.success("内容已保存，可在课程历史记录中查看");
    } catch (error) {
      console.error("保存内容失败:", error);
      toast.error("保存内容失败");
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <LanguageSelector 
              language={language} 
              onLanguageChange={handleLanguageChange} 
            />
          </div>

          <div className="flex items-center space-x-2">
            <SettingsPopover
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              generateQuiz={generateQuiz}
              setGenerateQuiz={setGenerateQuiz}
              quizDifficulty={quizDifficulty}
              setQuizDifficulty={setQuizDifficulty}
            />
          </div>
        </div>
      
        {isTextMode ? (
          <TextInput
            textContent={textContent}
            setTextContent={setTextContent}
            onHandleFileUpload={handleFileUpload}
            onSubmitText={handleSubmitText}
            isLoading={isLoading}
            onSaveContent={handleSaveContent}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
          />
        ) : (
          <FileUploader
            onDrop={onDrop}
            selectedFile={selectedFile}
            onHandleManualTextInput={handleManualTextInput}
            onHandleUpload={handleUpload}
            isLoading={isLoading}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
