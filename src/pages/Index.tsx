
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SummaryLanguage, SummaryStyle, CourseContent, Question, QuestionDifficulty, UserAnswer } from "@/types";
import { openaiService } from "@/services/openaiService";
import MainTabs from "@/components/MainTabs";
import TopControls from "@/components/TopControls";

const Index = () => {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("default");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);
  const [quizDifficulty, setQuizDifficulty] = useState<QuestionDifficulty>("medium");

  useEffect(() => {
    // Load saved settings
    const savedModel = openaiService.getModel();
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  useEffect(() => {
    // Update API model when it changes
    openaiService.setModel(selectedModel);
  }, [selectedModel]);

  // 同时生成所有摘要
  const generateAllSummaries = async (content: string, language: SummaryLanguage) => {
    try {
      const styles: SummaryStyle[] = ["casual", "academic", "basic"];
      
      const summaryPromises = styles.map(style => 
        openaiService.generateSummary(content, style, language)
      );
      
      const allSummaries = await Promise.all(summaryPromises);
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          summary: allSummaries[0]  // Default to first summary style
        };
      });
      
      toast.success("所有风格摘要已生成");
      return allSummaries;
    } catch (error) {
      console.error("Error generating summaries:", error);
      toast.error("生成摘要时出错");
      throw error;
    }
  };

  // 同时生成所有难度的问题
  const generateAllQuestions = async (content: string, language: SummaryLanguage) => {
    try {
      const [easyQuestionsPromise, mediumQuestionsPromise, hardQuestionsPromise] = [
        openaiService.generateQuestions(content, "easy", 10, language),
        openaiService.generateQuestions(content, "medium", 10, language),
        openaiService.generateQuestions(content, "hard", 10, language)
      ];
      
      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
        easyQuestionsPromise, 
        mediumQuestionsPromise, 
        hardQuestionsPromise
      ]);
      
      setCourseContent(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          questions: {
            easy: easyQuestions,
            medium: mediumQuestions,
            hard: hardQuestions
          }
        };
      });
      
      toast.success("所有难度测验题已生成");
      return { easy: easyQuestions, medium: mediumQuestions, hard: hardQuestions };
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("生成测验题时出错");
      throw error;
    }
  };

  // 处理内容加载
  const handleContentLoaded = async (
    content: string, 
    generateQuiz: boolean, 
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage = "chinese",
    courseId: string
  ) => {
    try {
      setIsLoading(true);
      setSelectedCourseId(courseId);
      
      // Set initial state with raw content
      setCourseContent({
        rawContent: content,
        summary: null,
        questions: null
      });

      // Real API processing instead of fake processing
      if (!openaiService.getApiKey()) {
        toast.error("请先设置 OpenAI API Key");
        setIsLoading(false);
        return;
      }
      
      // 并行生成所有内容
      const summaryPromise = generateAllSummaries(content, language);
      const questionsPromise = generateQuiz ? generateAllQuestions(content, language) : null;
      
      // 等待所有结果
      const [summaries, questions] = await Promise.all([
        summaryPromise,
        questionsPromise
      ]);
      
      // 更新状态
      setCourseContent(prev => {
        if (!prev) return null;
        return {
          rawContent: content,
          summary: summaries[0], // 默认使用第一个样式
          summaries: summaries,  // 存储所有摘要
          questions: questions || null
        };
      });
      
      // 更新标签页
      setActiveTab("summary");
      
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleChange = (style: SummaryStyle) => {
    // 实现摘要样式切换功能
    if (!courseContent || !courseContent.summaries) return;
    
    const selectedSummary = courseContent.summaries.find(s => s.style === style);
    if (selectedSummary) {
      setCourseContent({
        ...courseContent,
        summary: selectedSummary
      });
    }
  };

  const handleLanguageChange = (language: SummaryLanguage) => {
    // 实现语言切换功能
  };

  const handleGenerateQuiz = () => {
    // 实现生成测验功能
  };

  const handleDifficultyChange = (difficulty: QuestionDifficulty) => {
    // 实现难度切换功能
  };

  const saveUserAnswersToHistory = (userAnswers: UserAnswer[]) => {
    // 实现保存答案到历史记录功能
  };

  const handleRegenerateQuiz = (difficulty: QuestionDifficulty) => {
    // 实现重新生成测验功能
  };

  const onSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const onViewCourses = () => {
    // 实现查看课程功能
    setActiveTab("upload");
  };

  const handleApiKeySet = () => {
    toast.success("API Key已设置");
  };

  const handleSelectHistoryContent = (content: string) => {
    // 实现从历史记录选择内容的功能
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <TopControls 
        onSelectHistoryContent={handleSelectHistoryContent}
        onApiKeySet={handleApiKeySet}
        onViewCourses={onViewCourses}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        generateQuiz={generateQuiz}
        setGenerateQuiz={setGenerateQuiz}
        quizDifficulty={quizDifficulty}
        setQuizDifficulty={setQuizDifficulty}
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
        saveUserAnswersToHistory={saveUserAnswersToHistory}
        handleRegenerateQuiz={handleRegenerateQuiz}
        selectedCourseId={selectedCourseId}
        onSelectCourse={onSelectCourse}
        onViewCourses={onViewCourses}
      />
    </div>
  );
};

export default Index;
