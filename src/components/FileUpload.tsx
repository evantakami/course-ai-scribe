import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useCallback, useEffect } from "react";
import { UploadCloud, FileText, X, Settings, Save } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  SummaryLanguage, 
  QuestionDifficulty,
  AIModelOption,
  AI_MODELS
} from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { openaiService } from "@/services/openaiService";

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/rtf': ['.rtf'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    onDropRejected: (rejections) => {
      if (rejections[0].errors[0].code === 'file-too-large') {
        toast.error("文件过大，请上传小于10MB的文件");
      } else {
        toast.error("不支持的文件类型，请上传文本文件");
      }
    }
  });

  const handleManualTextInput = () => {
    setIsTextMode(true);
    setSelectedFile(null);
  };

  const handleFileUpload = () => {
    setIsTextMode(false);
  };

  const handleCloseTextMode = () => {
    setIsTextMode(false);
    setTextContent("");
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

  const languageOptions = [
    { value: "chinese", label: "中文" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" }
  ];

  const difficultyOptions = [
    { value: "easy", label: "简单" },
    { value: "medium", label: "普通" },
    { value: "hard", label: "困难" }
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={(value) => setLanguage(value as SummaryLanguage)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">AI模型设置</h4>
                  <div className="space-y-2">
                    <Label htmlFor="model">选择模型</Label>
                    <Select value={selectedModel} onValueChange={handleModelChange}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="选择AI模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map(model => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="generateQuiz" 
                        checked={generateQuiz} 
                        onCheckedChange={(checked) => 
                          setGenerateQuiz(checked as boolean)
                        }
                      />
                      <Label htmlFor="generateQuiz">上传时直接生成测验题</Label>
                    </div>
                    
                    {generateQuiz && (
                      <div className="ml-6 mt-2">
                        <Label htmlFor="difficulty">测验难度</Label>
                        <Select 
                          value={quizDifficulty} 
                          onValueChange={(value) => 
                            setQuizDifficulty(value as QuestionDifficulty)
                          }
                        >
                          <SelectTrigger id="difficulty" className="mt-1">
                            <SelectValue placeholder="选择难度" />
                          </SelectTrigger>
                          <SelectContent>
                            {difficultyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      
        {isTextMode ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">输入课程内容</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveContent}
                  disabled={textContent.trim().length === 0}
                >
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleFileUpload}
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
              onClick={handleSubmitText}
              disabled={isLoading || textContent.trim().length === 0}
            >
              {isLoading ? "处理中..." : "处理内容"}
            </Button>
          </div>
        ) : (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragActive ? "border-edu-500 bg-edu-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-edu-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">上传课程内容</h3>
              <p className="text-sm text-gray-500 mb-4">
                拖放文本文件到这里，或点击选择文件
              </p>
              
              <Button
                variant="outline"
                className="mb-4"
              >
                选择文件
              </Button>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <Button 
                variant="link" 
                onClick={handleManualTextInput}
                className="text-edu-600"
              >
                <FileText className="mr-2 h-4 w-4" />
                手动输入内容
              </Button>
              
              {selectedFile && (
                <div className="flex items-center">
                  <p className="text-sm font-medium mr-2">{selectedFile.name}</p>
                  <Button 
                    className="bg-edu-600 hover:bg-edu-700" 
                    onClick={handleUpload}
                    disabled={isLoading}
                  >
                    {isLoading ? "处理中..." : "上传并处理"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
