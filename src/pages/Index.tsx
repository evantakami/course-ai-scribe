
import { useState } from "react";
import { CourseContent, Summary, SummaryStyle, Question, QuestionDifficulty } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap } from "lucide-react";
import ApiKeyInput from "@/components/ApiKeyInput";
import FileUpload from "@/components/FileUpload";
import CourseSummary from "@/components/CourseSummary";
import QuizGenerator from "@/components/QuizGenerator";
import { openaiService } from "@/services/openaiService";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

  const handleApiKeySet = () => {
    setIsKeySet(true);
  };

  const handleContentLoaded = async (content: string) => {
    if (!isKeySet) {
      toast.error("请先设置OpenAI API密钥");
      return;
    }

    setIsLoading(true);
    setCourseContent({ rawContent: content });

    try {
      const summary = await openaiService.generateSummary(content, "casual");
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
      setActiveTab("summary");
      toast.success("课程内容已成功处理");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("处理内容时出错，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleChange = async (style: SummaryStyle) => {
    if (!courseContent?.rawContent) return;
    
    setIsLoading(true);
    try {
      const summary = await openaiService.generateSummary(
        courseContent.rawContent, 
        style
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
    } catch (error) {
      console.error("Error changing summary style:", error);
      toast.error("更改摘要样式时出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!courseContent?.rawContent) return;
    
    setIsGeneratingQuiz(true);
    try {
      const questions = await openaiService.generateQuestions(
        courseContent.rawContent,
        "medium",
        30
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, questions };
      });
      setActiveTab("quiz");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("生成测验题时出错");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleDifficultyChange = async (difficulty: QuestionDifficulty) => {
    if (!courseContent?.rawContent) return;
    
    setIsGeneratingQuiz(true);
    try {
      const questions = await openaiService.generateQuestions(
        courseContent.rawContent,
        difficulty,
        30
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, questions };
      });
    } catch (error) {
      console.error("Error generating quiz with new difficulty:", error);
      toast.error("生成不同难度的测验题时出错");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-edu-700 text-white py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <GraduationCap className="mr-2 h-8 w-8" />
            AI课程笔记助手
          </h1>
          <p className="mt-2 text-edu-100 max-w-2xl">
            上传课程对话内容，通过AI生成全面摘要和个性化测验
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {!isKeySet ? (
          <div className="flex justify-center my-8">
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <ApiKeyInput onApiKeySet={handleApiKeySet} />
            </div>
            
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" disabled={isLoading}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  上传内容
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  disabled={isLoading || !courseContent?.summary}
                >
                  总结
                </TabsTrigger>
                <TabsTrigger 
                  value="quiz" 
                  disabled={isLoading || isGeneratingQuiz || !courseContent?.questions}
                >
                  知识测验
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div className="flex justify-center">
                  <FileUpload 
                    onContentLoaded={handleContentLoaded} 
                    isLoading={isLoading} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <CourseSummary 
                  summary={courseContent?.summary || null} 
                  isLoading={isLoading}
                  onStyleChange={handleStyleChange}
                  onGenerateQuiz={handleGenerateQuiz}
                />
              </TabsContent>

              <TabsContent value="quiz" className="mt-4">
                <QuizGenerator 
                  questions={courseContent?.questions || null}
                  isGenerating={isGeneratingQuiz}
                  onDifficultyChange={handleDifficultyChange}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <footer className="bg-gray-100 py-6 px-4 border-t mt-10">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>使用OpenAI API驱动 · 所有处理在本地完成 · 您的数据不会被存储</p>
        </div>
      </footer>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
