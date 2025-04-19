
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TabsContent } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, HelpCircle } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { useContentHistory } from "@/hooks/useContentHistory";
import SummaryTab from "@/features/tabs/components/SummaryTab";
import QuizTab from "@/features/tabs/components/QuizTab";
import { UserAnswer } from "@/types";

const SummaryQuizPage = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  const {
    courseContent,
    isLoading,
    isGeneratingQuiz,
    handleStyleChange,
    handleLanguageChange,
    handleGenerateQuiz,
    handleRegenerateQuiz,
    setCurrentQuizDifficulty,
    setActiveTab: setContentManagerActiveTab
  } = useContentManager();

  const { saveUserAnswersToHistory } = useContentHistory();

  useEffect(() => {
    // Check if there is content in session storage
    const storedContent = sessionStorage.getItem('current_content');
    const currentCourseId = sessionStorage.getItem('current_course_id');
    
    if (!contentId || !storedContent) {
      toast.error("没有找到内容，请返回重试");
      navigate('/');
    }
    
    // Sync tabs
    setContentManagerActiveTab(activeTab);
  }, [contentId, activeTab, navigate, setContentManagerActiveTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setContentManagerActiveTab(value);
  };

  const handleSaveUserAnswers = (answers: UserAnswer[]) => {
    if (!courseContent || answers.length === 0) return;
    
    const currentCourseId = sessionStorage.getItem('current_course_id') || '';
    saveUserAnswersToHistory(answers, courseContent, currentCourseId);
  };

  const handleBackToCoursePage = () => {
    const currentCourseId = sessionStorage.getItem('current_course_id');
    if (currentCourseId) {
      navigate(`/course/${currentCourseId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={handleBackToCoursePage}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回课程
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 mr-2"
                >
                  返回首页
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/mistakes")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  错题本
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  课程摘要
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  知识测验
                </TabsTrigger>
              </TabsList>
              
              <SummaryTab 
                summary={courseContent?.summary}
                isLoading={isLoading}
                onStyleChange={handleStyleChange}
                onLanguageChange={handleLanguageChange}
                onGenerateQuiz={handleGenerateQuiz}
                showGenerateControls={false}
              />
              
              <QuizTab 
                questions={courseContent?.questions}
                isGenerating={isGeneratingQuiz}
                onDifficultyChange={setCurrentQuizDifficulty}
                saveUserAnswers={handleSaveUserAnswers}
                onRegenerateQuiz={handleRegenerateQuiz}
              />
            </Tabs>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SummaryQuizPage;
