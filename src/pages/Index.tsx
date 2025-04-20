import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SummaryLanguage, SummaryStyle, CourseContent, Question, QuestionDifficulty, UserAnswer } from "@/types";
import { openaiService } from "@/services/openaiService";
import MainTabs from "@/components/MainTabs";
import TopControls from "@/components/TopControls";

interface IndexProps {
  initialContent?: CourseContent | null;
  initialGenerateQuiz?: boolean;
  initialQuizDifficulty?: QuestionDifficulty;
  initialCourseId?: string;
  activeTab?: string;
}

const Index = ({
  initialContent = null,
  initialGenerateQuiz = true,
  initialQuizDifficulty = "medium",
  initialCourseId = "default",
  activeTab = "upload"
}: IndexProps) => {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(initialContent);
  const [currentActiveTab, setCurrentActiveTab] = useState<string>(activeTab);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(initialGenerateQuiz);
  const [quizDifficulty, setQuizDifficulty] = useState<QuestionDifficulty>(initialQuizDifficulty);

  useEffect(() => {
    console.log("Index component mounted with:", {
      initialContent,
      initialGenerateQuiz,
      initialQuizDifficulty,
      initialCourseId,
      activeTab,
      courseContent
    });

    if (initialContent?.rawContent && !initialContent.summary) {
      handleContentLoaded(
        initialContent.rawContent,
        true,
        initialQuizDifficulty,
        "chinese",
        initialCourseId
      );
    }
  }, []);

  useEffect(() => {
    const savedModel = openaiService.getModel();
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  useEffect(() => {
    openaiService.setModel(selectedModel);
  }, [selectedModel]);

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
          summary: allSummaries[0], 
          summaries: allSummaries
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

  const generateAllQuestions = async (content: string, language: SummaryLanguage) => {
    try {
      setIsGeneratingQuiz(true);
      
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
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

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
      
      setCourseContent({
        rawContent: content,
        summary: null,
        questions: null
      });

      if (!openaiService.getApiKey()) {
        toast.error("请先设置 OpenAI API Key");
        setIsLoading(false);
        return;
      }
      
      const summaryPromise = generateAllSummaries(content, language);
      const questionsPromise = generateAllQuestions(content, language);
      
      const [summaries, questions] = await Promise.all([
        summaryPromise,
        questionsPromise
      ]);
      
      setCourseContent(prev => {
        if (!prev) return null;
        return {
          rawContent: content,
          summary: summaries[0],
          summaries: summaries,
          questions: questions || null
        };
      });
      
      if (currentActiveTab === "upload") {
        setCurrentActiveTab("summary");
      }
      
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleChange = (style: SummaryStyle) => {
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
  };

  const handleGenerateQuiz = () => {
  };

  const handleDifficultyChange = (difficulty: QuestionDifficulty) => {
  };

  const saveUserAnswersToHistory = (userAnswers: UserAnswer[]) => {
  };

  const handleRegenerateQuiz = (difficulty: QuestionDifficulty) => {
  };

  const onSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const onViewCourses = () => {
    setCurrentActiveTab("upload");
  };

  const handleApiKeySet = () => {
    toast.success("API Key已设置");
  };

  const handleSelectHistoryContent = (content: string) => {
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
        activeTab={currentActiveTab}
        setActiveTab={setCurrentActiveTab}
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
