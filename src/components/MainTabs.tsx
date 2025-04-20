
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, HelpCircle, BookOpenCheck } from "lucide-react";
import { CourseContent, SummaryLanguage, QuestionDifficulty, SummaryStyle, UserAnswer } from "@/types";
import FileUpload from "./FileUpload";
import CourseSummary from "./CourseSummary";
import QuizGenerator from "./QuizGenerator";
import MistakeCollection from "./MistakeCollection";
import { motion, AnimatePresence } from "framer-motion";

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
  
  // Define icon and indicator styling for each tab
  const tabStyles = {
    upload: {
      bgActive: "bg-white",
      bgInactive: "bg-transparent",
      textActive: "text-edu-700",
      textInactive: "text-muted-foreground",
      indicator: "bg-edu-500"
    },
    summary: {
      bgActive: "bg-white",
      bgInactive: "bg-transparent",
      textActive: "text-summary-DEFAULT",
      textInactive: "text-muted-foreground",
      indicator: "bg-summary-DEFAULT"
    },
    quiz: {
      bgActive: "bg-white",
      bgInactive: "bg-transparent",
      textActive: "text-quiz-DEFAULT",
      textInactive: "text-muted-foreground",
      indicator: "bg-quiz-DEFAULT"
    },
    mistakes: {
      bgActive: "bg-white",
      bgInactive: "bg-transparent",
      textActive: "text-mistake-DEFAULT",
      textInactive: "text-muted-foreground",
      indicator: "bg-mistake-DEFAULT"
    }
  };
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TabsList className="relative w-full grid grid-cols-4 p-1 rounded-xl bg-muted/80 backdrop-blur sticky top-0 z-10">
          <TabsTrigger 
            value="upload" 
            disabled={isLoading}
            className="relative rounded-lg data-[state=active]:bg-white data-[state=active]:text-edu-700 data-[state=active]:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span className="text-sm">输入内容</span>
            </div>
            {activeTab === "upload" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-edu-500"
                layoutId="tab-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="summary" 
            disabled={isLoading || !courseContent?.summary}
            className="relative rounded-lg data-[state=active]:bg-white data-[state=active]:text-summary-DEFAULT data-[state=active]:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="text-sm">摘要</span>
            </div>
            {activeTab === "summary" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-summary-DEFAULT"
                layoutId="tab-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="quiz" 
            disabled={isLoading || isGeneratingQuiz || !hasQuestions}
            className="relative rounded-lg data-[state=active]:bg-white data-[state=active]:text-quiz-DEFAULT data-[state=active]:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">知识测验</span>
            </div>
            {activeTab === "quiz" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-quiz-DEFAULT"
                layoutId="tab-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="mistakes"
            className="relative rounded-lg data-[state=active]:bg-white data-[state=active]:text-mistake-DEFAULT data-[state=active]:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center">
              <BookOpenCheck className="mr-2 h-4 w-4" />
              <span className="text-sm">错题本</span>
            </div>
            {activeTab === "mistakes" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-mistake-DEFAULT"
                layoutId="tab-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </TabsTrigger>
        </TabsList>
      </motion.div>

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
                <FileUpload 
                  onContentLoaded={handleContentLoaded} 
                  isLoading={isLoading}
                  selectedCourseId={selectedCourseId}
                  onSelectCourse={onSelectCourse}
                  generateAllContent={true}
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
                isLoading={isLoading}
                onStyleChange={handleStyleChange}
                onLanguageChange={handleLanguageChange}
                onGenerateQuiz={handleGenerateQuiz}
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
