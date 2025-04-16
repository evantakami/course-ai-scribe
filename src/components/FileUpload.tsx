
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useCallback } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";

interface FileUploadProps {
  onContentLoaded: (content: string) => void;
  isLoading: boolean;
}

const FileUpload = ({ onContentLoaded, isLoading }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [isTextMode, setIsTextMode] = useState<boolean>(false);

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

  const handleSubmitText = () => {
    if (textContent.trim().length === 0) {
      toast.error("请输入课程内容");
      return;
    }
    onContentLoaded(textContent);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentLoaded(content);
    };
    reader.onerror = () => {
      toast.error("读取文件出错");
    };
    reader.readAsText(selectedFile);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        {isTextMode ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">输入课程内容</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCloseTextMode}
              >
                <X className="h-4 w-4" />
              </Button>
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
