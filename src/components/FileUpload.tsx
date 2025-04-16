
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback } from "react";
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
    language: SummaryLanguage
  ) => void;
  isLoading: boolean;
}

const FileUpload = ({ onContentLoaded, isLoading }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [isTextMode, setIsTextMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<SummaryLanguage>("chinese");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);
  const [quizDifficulty, setQuizDifficulty] = useState<QuestionDifficulty>("medium");
  const [selectedModel, setSelectedModel] = useState<string>(openaiService.getModel());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
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
    onContentLoaded(textContent, generateQuiz, quizDifficulty, language);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentLoaded(content, generateQuiz, quizDifficulty, language);
    };
    reader.onerror = () => {
      toast.error("读取文件出错");
    };
    reader.readAsText(selectedFile);
  };

  const handleSaveContent = () => {
    if (textContent.trim().length === 0) {
      toast.error("没有内容可保存");
      return;
    }
    
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const history = JSON.parse(historyString);
      
      const newItem = {
        id: Date.now().toString(),
        rawContent: textContent,
        timestamp: new Date()
      };
      
      const updatedHistory = [newItem, ...history].slice(0, 20);
      
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
      toast.success("内容已保存，可在历史记录中查看");
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
          />
        ) : (
          <FileUploader
            onDrop={onDrop}
            selectedFile={selectedFile}
            onHandleManualTextInput={handleManualTextInput}
            onHandleUpload={handleUpload}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
