
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, HelpCircle, BookOpenCheck } from "lucide-react";
import { CourseContent, SummaryLanguage, QuestionDifficulty, SummaryStyle, UserAnswer } from "@/types";
import UploadTab from "@/features/tabs/components/UploadTab";
import SummaryTab from "@/features/tabs/components/SummaryTab";
import QuizTab from "@/features/tabs/components/QuizTab";
import MistakesTab from "@/features/tabs/components/MistakesTab";
import GenerationProgress from "./GenerationProgress";

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  courseContent: CourseContent | null;
  isLoading: boolean;
  isGeneratingQuiz: boolean;
  handleContentLoaded: (
    content: string,
    generateQuiz: boolean,
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
    courseId: string
  ) => void;
  handleStyleChange: (style: SummaryStyle) => void;
  handleLanguageChange: (language: SummaryLanguage) => void;
  handleGenerateQuiz: () => void;
  handleDifficultyChange: (difficulty: QuestionDifficulty) => void;
  saveUserAnswersToHistory?: (userAnswers: UserAnswer[]) => void;
  handleRegenerateQuiz?: (difficulty: QuestionDifficulty) => void;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onViewCourses?: () => void;
  summaryProgress?: number;
  quizProgress?: number;
}

const MainTabs = ({
  activeTab,
  setActiveTab,
  courseContent,
  isLoading,
  isGeneratingQuiz,
  handleContentLoaded,
  handleStyleChange,
  handleLanguageChange,
  handleGenerateQuiz,
  handleDifficultyChange,
  saveUserAnswersToHistory,
  handleRegenerateQuiz,
  selectedCourseId,
  onSelectCourse,
  onViewCourses,
  summaryProgress = 0,
  quizProgress = 0
}: MainTabsProps) => {
  // Simple tab change handler that doesn't trigger regeneration or processing
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="upload" disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          输入内容
        </TabsTrigger>
        <TabsTrigger 
          value="summary" 
          disabled={isLoading || !courseContent?.summary}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          总结
        </TabsTrigger>
        <TabsTrigger 
          value="quiz" 
          disabled={isLoading || isGeneratingQuiz || !courseContent?.questions}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          知识测验
        </TabsTrigger>
        <TabsTrigger value="mistakes">
          <BookOpenCheck className="mr-2 h-4 w-4" />
          错题本
        </TabsTrigger>
      </TabsList>

      {/* Only show progress when actually generating, not when switching tabs */}
      {(isLoading || isGeneratingQuiz) && (
        <GenerationProgress 
          summaryProgress={summaryProgress}
          quizProgress={quizProgress}
          isGenerating={isLoading || isGeneratingQuiz}
        />
      )}

      <UploadTab 
        isLoading={isLoading}
        handleContentLoaded={handleContentLoaded}
        selectedCourseId={selectedCourseId}
        onSelectCourse={onSelectCourse}
      />

      <SummaryTab 
        summary={courseContent?.summary || null}
        isLoading={isLoading}
        onStyleChange={handleStyleChange}
        onLanguageChange={handleLanguageChange}
        onGenerateQuiz={handleGenerateQuiz}
        showGenerateControls={true}
      />

      <QuizTab 
        questions={courseContent?.questions || null}
        isGenerating={isGeneratingQuiz}
        onDifficultyChange={handleDifficultyChange}
        saveUserAnswers={saveUserAnswersToHistory}
        onRegenerateQuiz={handleRegenerateQuiz}
      />

      <MistakesTab />
    </Tabs>
  );
};

export default MainTabs;
