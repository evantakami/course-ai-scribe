
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadTab from "@/features/tabs/UploadTab";
import SummaryTab from "@/features/tabs/SummaryTab";
import QuizTab from "@/features/tabs/QuizTab";
import MistakesTab from "@/features/tabs/MistakesTab";
import { useAppState } from "@/hooks/useAppState";
import GenerationProgress from "@/components/GenerationProgress";
import { FileText, BookOpen, HelpCircle, BookOpenCheck } from "lucide-react";

const MainContent = () => {
  const {
    activeTab,
    setActiveTab,
    courseContent,
    isLoading,
    isGeneratingQuiz,
    summaryProgress,
    quizProgress,
    handleContentLoaded,
    handleStyleChange,
    handleLanguageChange,
    handleGenerateQuiz,
    setCurrentQuizDifficulty,  // This is what we use instead of handleDifficultyChange
    saveUserAnswersToHistory,
    handleRegenerateQuiz,
    selectedCourseId,
    onSelectCourse
  } = useAppState();

  // Tab change handler
  const handleTabChange = (value: string) => {
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

      {/* Only show progress when actually generating */}
      <GenerationProgress 
        summaryProgress={summaryProgress}
        quizProgress={quizProgress}
        isGenerating={isLoading || isGeneratingQuiz}
      />

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
      />

      <QuizTab 
        questions={courseContent?.questions || null}
        isGenerating={isGeneratingQuiz}
        onDifficultyChange={setCurrentQuizDifficulty}  // Use setCurrentQuizDifficulty here
        saveUserAnswers={saveUserAnswersToHistory}
        onRegenerateQuiz={handleRegenerateQuiz}
      />

      <MistakesTab />
    </Tabs>
  );
};

export default MainContent;
