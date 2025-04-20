
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  FileText, 
  Upload, 
  Check, 
  Info, 
  FileUp,
  ChevronRight
} from "lucide-react";
import { SummaryLanguage, QuestionDifficulty } from "@/types";
import { openaiService } from "@/services/openaiService";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CourseSelector from "@/components/courses/CourseSelector";

interface UploadContentProps {
  isKeySet: boolean;
  startLoading: (message: string) => () => void;
  onContentLoaded: (
    content: string, 
    generateQuiz: boolean, 
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
    courseId: string
  ) => void;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  generateQuiz: boolean;
  quizDifficulty: QuestionDifficulty;
}

const UploadContent = ({ 
  isKeySet, 
  startLoading, 
  onContentLoaded, 
  selectedCourseId,
  onSelectCourse,
  generateQuiz,
  quizDifficulty
}: UploadContentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>("paste");
  const [textContent, setTextContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<SummaryLanguage>("chinese");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCourseSelectorOpen, setIsCourseSelectorOpen] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
      } else {
        toast.error("不支持的文件类型，请上传文本文件");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
      } else {
        toast.error("不支持的文件类型，请上传文本文件");
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = ["text/plain", "application/pdf", "text/markdown"];
    return validTypes.includes(file.type) || file.name.endsWith(".txt") || file.name.endsWith(".md");
  };

  const handleProcessContent = async () => {
    if (!isKeySet) {
      toast.error("请先设置 OpenAI API Key");
      return;
    }

    let contentToProcess = "";

    if (activeTab === "paste") {
      if (!textContent.trim()) {
        toast.error("请输入课程内容");
        return;
      }
      contentToProcess = textContent;
    } else {
      if (!selectedFile) {
        toast.error("请先选择文件");
        return;
      }
      
      try {
        contentToProcess = await readFileContent(selectedFile);
      } catch (error) {
        toast.error("读取文件失败，请重试");
        return;
      }
    }

    if (!selectedCourseId) {
      toast.error("请先选择课程分类");
      return;
    }

    const stopLoading = startLoading("正在生成摘要和测验题...");

    try {
      saveToHistory(contentToProcess);
      
      // 修改：强制生成所有内容，总是设置generateQuiz为true
      onContentLoaded(
        contentToProcess, 
        true, // 始终生成测验题
        quizDifficulty, 
        language, 
        selectedCourseId
      );
      
      console.log("Content processing started:", {
        contentLength: contentToProcess.length,
        generateQuiz: true,
        quizDifficulty,
        language,
        selectedCourseId
      });
      
      stopLoading();
    } catch (error) {
      stopLoading();
      console.error("Content processing error:", error);
      toast.error("处理内容失败，请重试");
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("读取文件失败"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("读取文件失败"));
      };
      
      reader.readAsText(file);
    });
  };

  const saveToHistory = (content: string) => {
    try {
      const firstLine = content.split('\n')[0] || '';
      const title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      
      const newItem = {
        id: Date.now().toString(),
        rawContent: content,
        timestamp: new Date(),
        title,
        courseId: selectedCourseId,
        language
      };
      
      const historyString = localStorage.getItem('content_history') || '[]';
      const history = JSON.parse(historyString);
      
      const updatedHistory = [newItem, ...history].slice(0, 50);
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <Card className="glass border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/10">
            <CardTitle className="text-xl text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              上传或粘贴课程内容
            </CardTitle>
            <CardDescription className="text-gray-300">
              AI 将分析内容并生成摘要与测验题
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">课程分类</label>
                <Dialog open={isCourseSelectorOpen} onOpenChange={setIsCourseSelectorOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => setIsCourseSelectorOpen(true)}
                    >
                      {selectedCourseId ? "选择课程分类" : "选择课程分类"}
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>选择课程分类</DialogTitle>
                    <CourseSelector 
                      selectedCourseId={selectedCourseId} 
                      onSelectCourse={(id) => {
                        onSelectCourse(id);
                        setIsCourseSelectorOpen(false);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">摘要语言</label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as SummaryLanguage)}>
                    <SelectTrigger className="bg-dark/20 border-gray-700 text-white">
                      <SelectValue placeholder="选择语言" />
                    </SelectTrigger>
                    <SelectContent className="glass border-gray-700">
                      <SelectItem value="chinese">中文</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Español</SelectItem>
                      <SelectItem value="french">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="glass-card bg-dark/40">
                <div className="flex space-x-3">
                  <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white mb-1">
                      AI 将处理您的课程内容，自动生成：
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>三种风格的课程摘要（学术、通俗、基础）</li>
                      <li>包含详细解释的互动测验题</li>
                      <li>术语表与知识点提取</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 glass bg-dark/30 mb-4">
                  <TabsTrigger
                    value="paste"
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    粘贴文本
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    上传文件
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="paste" className="mt-0">
                  <Textarea 
                    placeholder="在此粘贴或输入课程内容..."
                    value={textContent}
                    onChange={handleTextChange}
                    className="min-h-[200px] bg-dark/20 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                  />
                </TabsContent>
                
                <TabsContent value="upload" className="mt-0">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                      ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-500'}
                      ${selectedFile ? 'bg-dark/30' : 'bg-dark/20'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".txt,.md,.pdf"
                    />
                    
                    {selectedFile ? (
                      <div className="py-4">
                        <Check className="mx-auto h-10 w-10 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">文件已选择</h3>
                        <p className="text-sm text-gray-300 mb-4 break-all">
                          {selectedFile.name}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                        >
                          重新选择
                        </Button>
                      </div>
                    ) : (
                      <>
                        <FileUp className="mx-auto h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">上传课程内容</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          拖放文本文件到这里，或点击选择文件
                        </p>
                        
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                        >
                          选择文件
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between px-6 py-4 bg-dark/20 border-t border-white/10">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-white/10"
              disabled
            >
              <Info className="h-4 w-4 mr-2" />
              查看使用说明
            </Button>
            
            <Button 
              onClick={handleProcessContent}
              disabled={
                (activeTab === "paste" && !textContent.trim()) || 
                (activeTab === "upload" && !selectedFile) ||
                !selectedCourseId
              }
              className="bg-primary hover:bg-primary-hover text-white hover-glow"
            >
              开始处理
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadContent;
