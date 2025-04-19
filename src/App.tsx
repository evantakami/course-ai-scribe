
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InputPage from "./pages/InputPage";
import CoursePage from "./pages/CoursePage";
import SummaryQuizPage from "./pages/SummaryQuizPage";
import MistakesPage from "./pages/MistakesPage";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/summary-quiz/:contentId?" element={<SummaryQuizPage />} />
            <Route path="/mistakes" element={<MistakesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="bottom-center" />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
