
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, HelpCircle, BookOpenCheck } from "lucide-react";
import { CourseContent, SummaryLanguage, QuestionDifficulty, SummaryStyle, UserAnswer } from "@/types";
import FileUpload from "./FileUpload";
import CourseSummary from "./CourseSummary";
import QuizGenerator from "./QuizGenerator";
import MistakeCollection from "./MistakeCollection";

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
  onViewCourses: () => void;
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
  onViewCourses
}: MainTabsProps) => {
  // Add console log to see when tab changes
  console.log("MainTabs - activeTab:", activeTab);
  console.log("MainTabs - courseContent:", courseContent);
  
  // Check if questions exist before accessing their length
  const hasQuestions = courseContent?.questions && (
    (courseContent.questions.easy && courseContent.questions.easy.length > 0) ||
    (courseContent.questions.medium && courseContent.questions.medium.length > 0) ||
    (courseContent.questions.hard && courseContent.questions.hard.length > 0)
  );
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
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
          disabled={isLoading || isGeneratingQuiz || !hasQuestions}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          知识测验
        </TabsTrigger>
        <TabsTrigger value="mistakes">
          <BookOpenCheck className="mr-2 h-4 w-4" />
          错题本
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-4">
        <div className="flex justify-center">
          <FileUpload 
            onContentLoaded={handleContentLoaded} 
            isLoading={isLoading}
            selectedCourseId={selectedCourseId}
            onSelectCourse={onSelectCourse}
            generateAllContent={true}
          />
        </div>
      </TabsContent>

      <TabsContent value="summary" className="mt-4">
        <CourseSummary 
          summary={courseContent?.summary || null} 
          isLoading={isLoading}
          onStyleChange={handleStyleChange}
          onLanguageChange={handleLanguageChange}
          onGenerateQuiz={handleGenerateQuiz}
        />
      </TabsContent>

      <TabsContent value="quiz" className="mt-4">
        <QuizGenerator 
          questions={courseContent?.questions || null}
          isGenerating={isGeneratingQuiz}
          onDifficultyChange={handleDifficultyChange}
          saveUserAnswers={saveUserAnswersToHistory}
          onRegenerateQuiz={handleRegenerateQuiz}
        />
      </TabsContent>
      
      <TabsContent value="mistakes" className="mt-4">
        <MistakeCollection />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
