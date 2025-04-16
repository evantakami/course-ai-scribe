
import { useState } from "react";
import { CourseContent, Summary, SummaryStyle, SummaryLanguage, Question, QuestionDifficulty } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { openaiService } from "@/services/openaiService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopControls from "@/components/TopControls";
import MainTabs from "@/components/MainTabs";

const Index = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SummaryLanguage>("chinese");

  const handleApiKeySet = () => {
    setIsKeySet(true);
  };

  const handleContentLoaded = async (
    content: string, 
    generateQuiz: boolean = false, 
    quizDifficulty: QuestionDifficulty = "medium",
    language: SummaryLanguage = "chinese"
  ) => {
    if (!isKeySet) {
      toast.error("请先设置OpenAI API密钥");
      return;
    }

    setIsLoading(true);
    setCurrentLanguage(language);
    setCourseContent({ rawContent: content });

    try {
      const summary = await openaiService.generateSummary(content, "casual", language);
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
      setActiveTab("summary");
      toast.success("课程内容已成功处理");

      // Generate quiz if requested
      if (generateQuiz) {
        setIsGeneratingQuiz(true);
        try {
          const questions = await openaiService.generateQuestions(
            content,
            quizDifficulty,
            30,
            language
          );
          
          setCourseContent(prev => {
            if (!prev) return null;
            return { ...prev, questions };
          });
        } catch (error) {
          console.error("Error generating quiz:", error);
          toast.error("生成测验题时出错");
        } finally {
          setIsGeneratingQuiz(false);
        }
      }
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
        style,
        currentLanguage
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

  const handleLanguageChange = async (language: SummaryLanguage) => {
    if (!courseContent?.rawContent) return;
    setCurrentLanguage(language);
    
    setIsLoading(true);
    try {
      const summary = await openaiService.generateSummary(
        courseContent.rawContent, 
        courseContent.summary?.style || "casual",
        language
      );
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { ...prev, summary };
      });
    } catch (error) {
      console.error("Error changing summary language:", error);
      toast.error("更改摘要语言时出错");
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
        30,
        currentLanguage
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
        30,
        currentLanguage
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

  const handleSelectHistoryContent = (content: string) => {
    setActiveTab("upload");
    setCourseContent(null);
    
    setTimeout(() => {
      handleContentLoaded(content, false, "medium", currentLanguage);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {!isKeySet ? (
          <div className="flex justify-center my-8">
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        ) : (
          <>
            <TopControls 
              onSelectHistoryContent={handleSelectHistoryContent} 
              onApiKeySet={handleApiKeySet} 
            />
            
            <MainTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              courseContent={courseContent}
              isLoading={isLoading}
              isGeneratingQuiz={isGeneratingQuiz}
              handleContentLoaded={handleContentLoaded}
              handleStyleChange={handleStyleChange}
              handleLanguageChange={handleLanguageChange}
              handleGenerateQuiz={handleGenerateQuiz}
              handleDifficultyChange={handleDifficultyChange}
            />
          </>
        )}
      </main>

      <Footer />
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
