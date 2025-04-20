
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, HelpCircle, BookOpenCheck } from "lucide-react";
import { CourseContent, SummaryLanguage, QuestionDifficulty, SummaryStyle, UserAnswer } from "@/types";
import FileUploader from "@/components/FileUploader"; // Updated import name to match the file
import CourseSummary from "./CourseSummary";
import QuizGenerator from "./QuizGenerator";
import MistakeCollection from "./MistakeCollection";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  
  // Track selected file state within MainTabs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Check if questions exist before accessing their length
  const hasQuestions = courseContent?.questions && (
    (courseContent.questions.easy && courseContent.questions.easy.length > 0) ||
    (courseContent.questions.medium && courseContent.questions.medium.length > 0) ||
    (courseContent.questions.hard && courseContent.questions.hard.length > 0)
  );
  
  const tabVariants = {
    hidden: (direction: number) => ({
      x: direction * 20,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: (direction: number) => ({
      x: direction * -20,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };
  
  // Handle file selection
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };
  
  // Handle manual text input
  const handleManualTextInput = () => {
    // This would normally navigate to a text input view
    console.log("Navigate to manual text input");
  };
  
  // Handle upload
  const handleUpload = () => {
    if (selectedFile) {
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          // Process with hardcoded values for now
          handleContentLoaded(
            content,
            true,
            "medium" as QuestionDifficulty,
            "chinese" as SummaryLanguage,
            selectedCourseId
          );
        }
      };
      reader.readAsText(selectedFile);
    }
  };
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="grid w-full grid-cols-4 p-1 rounded-xl bg-muted/80 backdrop-blur">
        <TabsTrigger 
          value="upload" 
          disabled={isLoading}
          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-edu-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span className="text-sm">输入内容</span>
        </TabsTrigger>
        <TabsTrigger 
          value="summary" 
          disabled={isLoading || !courseContent?.summary}
          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-edu-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span className="text-sm">总结</span>
        </TabsTrigger>
        <TabsTrigger 
          value="quiz" 
          disabled={isLoading || isGeneratingQuiz || !hasQuestions}
          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-edu-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">知识测验</span>
        </TabsTrigger>
        <TabsTrigger 
          value="mistakes"
          className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-edu-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          <BookOpenCheck className="mr-2 h-4 w-4" />
          <span className="text-sm">错题本</span>
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait" initial={false}>
        {activeTab === "upload" && (
          <motion.div
            key="upload"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            custom={1}
          >
            <TabsContent value="upload" className="mt-0">
              <div className="flex justify-center">
                <FileUploader 
                  onDrop={handleFileDrop}
                  selectedFile={selectedFile}
                  onHandleManualTextInput={handleManualTextInput}
                  onHandleUpload={handleUpload}
                  isLoading={isLoading}
                  selectedCourseId={selectedCourseId}
                  onSelectCourse={onSelectCourse}
                />
              </div>
            </TabsContent>
          </motion.div>
        )}

        {activeTab === "summary" && (
          <motion.div
            key="summary"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            custom={-1}
          >
            <TabsContent value="summary" className="mt-0">
              <CourseSummary 
                summary={courseContent?.summary || null} 
                summaries={courseContent?.summaries}
                rawContent={courseContent?.rawContent || ""}
                onStyleChange={handleStyleChange}
              />
            </TabsContent>
          </motion.div>
        )}

        {activeTab === "quiz" && (
          <motion.div
            key="quiz"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            custom={-1}
          >
            <TabsContent value="quiz" className="mt-0">
              <QuizGenerator 
                questions={courseContent?.questions || null}
                isGenerating={isGeneratingQuiz}
                onDifficultyChange={handleDifficultyChange}
                saveUserAnswers={saveUserAnswersToHistory}
                onRegenerateQuiz={handleRegenerateQuiz}
              />
            </TabsContent>
          </motion.div>
        )}

        {activeTab === "mistakes" && (
          <motion.div
            key="mistakes"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            custom={-1}
          >
            <TabsContent value="mistakes" className="mt-0">
              <MistakeCollection />
            </TabsContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Tabs>
  );
};

export default MainTabs;
