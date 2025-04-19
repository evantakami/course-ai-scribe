
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [contentLoaded, setContentLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const {
    courseContent,
    isLoading,
    isGeneratingQuiz,
    handleStyleChange,
    handleLanguageChange,
    handleGenerateQuiz,
    handleRegenerateQuiz,
    setCurrentQuizDifficulty,
    setActiveTab: setContentManagerActiveTab,
    handleContentLoaded
  } = useContentManager();

  const { saveUserAnswersToHistory, getHistoryItemById } = useContentHistory();
  const [loadedFromHistory, setLoadedFromHistory] = useState(false);

  useEffect(() => {
    console.log("SummaryQuizPage initialized with contentId:", contentId);
    
    // Check if there is content in session storage
    const storedContent = sessionStorage.getItem('current_content');
    const currentCourseId = sessionStorage.getItem('current_course_id');
    
    if (!contentId) {
      console.error("No content ID found, redirecting to home");
      toast.error("没有找到内容，请返回重试");
      navigate('/');
      return;
    }
    
    // First attempt: Try to use content directly from session storage
    if (storedContent && currentCourseId && !loadedFromHistory && !contentLoaded) {
      console.log("Using content from sessionStorage, length:", storedContent.length);
      const language = sessionStorage.getItem('content_language') || "chinese";
      
      try {
        handleContentLoaded(
          storedContent,
          true,
          "medium",
          language,
          currentCourseId
        );
        setContentLoaded(true);
      } catch (error) {
        console.error("Error processing content from session storage:", error);
        toast.error("处理内容时出错，请重试");
      }
    } 
    // Second attempt: Try to load from history if not in session storage
    else if ((!storedContent || !currentCourseId || !contentLoaded) && contentId && !loadedFromHistory) {
      console.log("Trying to load content from history for ID:", contentId);
      
      try {
        const historyItem = getHistoryItemById(contentId);
        
        if (historyItem && historyItem.rawContent) {
          console.log("Content found in history:", historyItem.id);
          sessionStorage.setItem('current_content', historyItem.rawContent);
          sessionStorage.setItem('current_course_id', historyItem.courseId);
          
          const language = historyItem.language || "chinese";
          console.log("Loading content from history with language:", language);
          
          handleContentLoaded(
            historyItem.rawContent,
            true,
            "medium",
            language,
            historyItem.courseId
          );
          
          setLoadedFromHistory(true);
          setContentLoaded(true);
        } else {
          console.error("Content not found in history for ID:", contentId);
          toast.error("没有找到内容，请返回重试");
        }
      } catch (error) {
        console.error("Error loading from history:", error);
        toast.error("加载历史内容失败，请重试");
      }
    }
    
    // Sync tabs
    setContentManagerActiveTab(activeTab);
    setLoading(false);
  }, [contentId, activeTab, navigate, setContentManagerActiveTab, getHistoryItemById, handleContentLoaded, loadedFromHistory, contentLoaded]);

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    setContentManagerActiveTab(value);
  };

  const handleSaveUserAnswers = (answers: UserAnswer[]) => {
    if (!courseContent || answers.length === 0) return;
    
    const currentCourseId = sessionStorage.getItem('current_course_id') || '';
    console.log("Saving user answers for course:", currentCourseId);
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

  // Conditionally render based on content loading state
  const renderContent = () => {
    if (loading || isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-edu-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-lg">正在加载内容...</span>
        </div>
      );
    }
    
    if (!courseContent && !isLoading) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-4">无法加载内容</h3>
          <p className="text-muted-foreground mb-6">
            找不到请求的内容或无法处理，请返回课程页面重试
          </p>
          <Button onClick={handleBackToCoursePage}>
            返回课程页面
          </Button>
        </div>
      );
    }
    
    return (
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
        
        <TabsContent value="summary">
          <SummaryTab 
            summary={courseContent?.summary}
            isLoading={isLoading}
            onStyleChange={handleStyleChange}
            onLanguageChange={handleLanguageChange}
            onGenerateQuiz={handleGenerateQuiz}
            showGenerateControls={true}
          />
        </TabsContent>
        
        <TabsContent value="quiz">
          <QuizTab 
            questions={courseContent?.questions}
            isGenerating={isGeneratingQuiz}
            onDifficultyChange={setCurrentQuizDifficulty}
            saveUserAnswers={handleSaveUserAnswers}
            onRegenerateQuiz={handleRegenerateQuiz}
          />
        </TabsContent>
      </Tabs>
    );
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
            
            {renderContent()}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SummaryQuizPage;
