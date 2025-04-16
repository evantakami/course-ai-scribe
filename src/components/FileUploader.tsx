
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  selectedFile: File | null;
  onHandleManualTextInput: () => void;
  onHandleUpload: () => void;
  isLoading: boolean;
}

const FileUploader = ({
  onDrop,
  selectedFile,
  onHandleManualTextInput,
  onHandleUpload,
  isLoading
}: FileUploaderProps) => {
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

  return (
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
          onClick={onHandleManualTextInput}
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
              onClick={onHandleUpload}
              disabled={isLoading}
            >
              {isLoading ? "处理中..." : "上传并处理"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploader;
