
import { useState, useEffect } from "react";
import { Summary, SummaryStyle } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, BookText, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import TerminologySidebar from "./TerminologySidebar";

interface CourseSummaryProps {
  summary: Summary | null;
  summaries?: Summary[];
  rawContent: string;
  onStyleChange: (style: SummaryStyle) => void;
}

interface Term {
  term: string;
  definition: string;
  category: string;
}

const CourseSummary = ({ summary, summaries, rawContent, onStyleChange }: CourseSummaryProps) => {
  const [activeStyle, setActiveStyle] = useState<SummaryStyle>(summary?.style || "casual");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [extractedTerms, setExtractedTerms] = useState<Term[] | null>(null);

  useEffect(() => {
    if (summary) {
      setActiveStyle(summary.style);
    }
  }, [summary]);

  useEffect(() => {
    // Extract terms from the basic style summary if available
    if (summaries) {
      const basicSummary = summaries.find(s => s.style === "basic");
      if (basicSummary && basicSummary.content) {
        try {
          // Find JSON content between ```json and ``` or try the entire content
          const jsonMatch = basicSummary.content.match(/```json\s*([\s\S]*?)\s*```/) || 
                           basicSummary.content.match(/\[\s*{\s*"term"/);
          
          if (jsonMatch) {
            let jsonContent = jsonMatch[1] || jsonMatch[0];
            // If the content starts with [ but doesn't end with ], try to find the end
            if (jsonContent.trim().startsWith('[') && !jsonContent.trim().endsWith(']')) {
              const endPos = basicSummary.content.lastIndexOf(']');
              if (endPos > -1) {
                jsonContent = basicSummary.content.substring(
                  basicSummary.content.indexOf('['), 
                  endPos + 1
                );
              }
            }
            
            const terms = JSON.parse(jsonContent);
            if (Array.isArray(terms) && terms.length > 0) {
              setExtractedTerms(terms);
            }
          }
        } catch (error) {
          console.error("Error parsing terminology JSON:", error);
        }
      }
    }
  }, [summaries]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStyleChange = (style: SummaryStyle) => {
    setActiveStyle(style);
    onStyleChange(style);
  };

  if (!summary) {
    return <div className="text-center py-8 text-gray-500">加载摘要中...</div>;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={activeStyle === "casual" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStyleChange("casual")}
          >
            <BookText className="h-4 w-4 mr-2" />
            通俗易懂
          </Button>
          <Button
            variant={activeStyle === "academic" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStyleChange("academic")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            学术专业
          </Button>
          <Button
            variant={activeStyle === "basic" ? "default" : "outline"}
            size="sm"
            onClick={() => handleStyleChange("basic")}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            基础概念
          </Button>
        </div>
        
        {extractedTerms && extractedTerms.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
          >
            术语表 ({extractedTerms.length})
          </Button>
        )}
      </div>

      <Card className="p-6 overflow-auto bg-white">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{summary.content}</ReactMarkdown>
        </div>
      </Card>

      {/* Terminology Sidebar */}
      <TerminologySidebar 
        terms={extractedTerms} 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
    </div>
  );
};

export default CourseSummary;
