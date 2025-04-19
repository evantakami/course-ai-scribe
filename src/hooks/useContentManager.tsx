
import { useState } from 'react';
import { CourseContent, SummaryStyle, SummaryLanguage, Question } from "@/types";
import { toast } from "sonner";
import { openaiService } from "@/services/openaiService";

export const useContentManager = () => {
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleContentLoaded = async (
    content: string,
    generateQuiz: boolean = true,
    courseId: string
  ) => {
    console.log("Content loaded in useContentManager:", { content, generateQuiz, courseId });
    
    if (!openaiService.getApiKey()) {
      toast.error("请先设置OpenAI API密钥");
      return false;
    }

    setIsLoading(true);
    
    // Initialize content state
    setCourseContent({ 
      rawContent: content,
      summary: null,
      questions: null
    });

    try {
      // Generate a simple summary for testing
      const summary = {
        content: "这是一个自动生成的摘要，展示了AI处理后的结果。",
        style: "casual" as SummaryStyle,
        language: "chinese" as SummaryLanguage,
        allStyles: {
          casual: "这是通俗易懂的摘要版本。",
          academic: "这是学术风格的摘要版本。",
          basic: "这是基础简单的摘要版本。"
        }
      };
      
      // Generate simple questions for testing, ensuring they match the Question type
      const easyQuestions: Question[] = [
        {
          id: 1,
          text: "这是一个简单的测试问题?",
          options: ["选项A", "选项B", "选项C", "选项D"],
          correctAnswer: 0,
          difficulty: "easy",
          explanation: "这是问题的解释"
        }
      ];
      
      // Update state with the mock data
      setTimeout(() => {
        setCourseContent({
          rawContent: content,
          summary,
          questions: generateQuiz ? {
            easy: easyQuestions,
            medium: [],
            hard: []
          } : null
        });
        
        // After processing, switch to summary tab
        setActiveTab("summary");
        setIsLoading(false);
        toast.success("内容处理完成");
      }, 2000);
      
      return true;
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("处理内容时出错，请重试");
      setIsLoading(false);
      return false;
    }
  };

  const handleStyleChange = async (style: SummaryStyle) => {
    if (!courseContent?.summary) return;
    
    // If we already have all styles, just update the current style without API call
    if (courseContent.summary.allStyles && courseContent.summary.allStyles[style]) {
      setCourseContent(prev => {
        if (!prev || !prev.summary || !prev.summary.allStyles) return prev;
        
        return {
          ...prev,
          summary: {
            ...prev.summary,
            style: style,
            content: prev.summary.allStyles[style] as string
          }
        };
      });
      return;
    }
  };

  return {
    courseContent,
    isLoading,
    activeTab,
    setActiveTab,
    handleContentLoaded,
    handleStyleChange,
  };
};
