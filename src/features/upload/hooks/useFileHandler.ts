
import { useState } from 'react';
import { toast } from "sonner";

export const useFileHandler = (onContentLoaded: (content: string) => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
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

  return {
    selectedFile,
    handleFileSelect,
    handleUpload
  };
};
