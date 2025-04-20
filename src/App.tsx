
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import UploadContent from "./pages/UploadContent";
import SummaryReport from "./pages/SummaryReport";
import InteractiveQuiz from "./pages/InteractiveQuiz";
import RevisionCenter from "./pages/RevisionCenter";
import HistoryDrawer from "./components/layout/HistoryDrawer";
import ProgressBar from "./components/common/ProgressBar";
import ApiKeyModal from "./components/modals/ApiKeyModal";
import { openaiService } from "./services/openaiService";
import { QuestionDifficulty, SummaryLanguage } from "./types";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [isKeySet, setIsKeySet] = useState<boolean>(!!openaiService.getApiKey());
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(!isKeySet);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("default");
  const [generateQuiz, setGenerateQuiz] = useState<boolean>(true);
  const [quizDifficulty, setQuizDifficulty] = useState<QuestionDifficulty>("medium");

  useEffect(() => {
    // Check if API key is set
    setIsKeySet(!!openaiService.getApiKey());
  }, []);

  const handleApiKeySet = () => {
    setIsKeySet(true);
    setIsApiKeyModalOpen(false);
  };

  const toggleHistoryDrawer = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const startLoading = (message: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
    setLoadingProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingProgress(0);
    };
  };

  const handleContentLoaded = (
    content: string, 
    generateQuiz: boolean, 
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
    courseId: string
  ) => {
    // Placeholder function to satisfy the type requirements
    console.log("Content loaded", { content, generateQuiz, quizDifficulty, language, courseId });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col text-gray-50 relative">
              {/* Background Gradient */}
              <div className="fixed inset-0 bg-gradient-to-br from-dark-secondary to-dark -z-10" />
              
              {/* Top Navbar */}
              <Navbar 
                isKeySet={isKeySet} 
                onOpenApiModal={() => setIsApiKeyModalOpen(true)}
                onToggleHistory={toggleHistoryDrawer}
              />
              
              {/* Main Content */}
              <main className="flex-grow">
                <div className="content-container animate-fade-in">
                  <Routes>
                    <Route path="/" element={<Navigate to="/upload" replace />} />
                    <Route 
                      path="/upload" 
                      element={
                        <UploadContent 
                          isKeySet={isKeySet} 
                          startLoading={startLoading}
                          onContentLoaded={handleContentLoaded}
                          selectedCourseId={selectedCourseId}
                          onSelectCourse={handleSelectCourse}
                          generateQuiz={generateQuiz}
                          quizDifficulty={quizDifficulty}
                        />
                      } 
                    />
                    <Route path="/summary" element={<SummaryReport />} />
                    <Route path="/quiz" element={<InteractiveQuiz />} />
                    <Route path="/revision" element={<RevisionCenter />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
              
              {/* Footer */}
              <Footer />
              
              {/* Fixed Bottom Progress */}
              {isLoading && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                  <ProgressBar 
                    progress={loadingProgress} 
                    message={loadingMessage} 
                  />
                </div>
              )}
              
              {/* History Drawer */}
              <HistoryDrawer 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
              />
              
              {/* API Key Modal */}
              <ApiKeyModal 
                isOpen={isApiKeyModalOpen} 
                onClose={() => !isKeySet && setIsApiKeyModalOpen(false)}
                onApiKeySet={handleApiKeySet}
              />
            </div>
            
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
