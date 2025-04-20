
import { useState, useEffect } from "react";
import { Summary, SummaryStyle, SummaryLanguage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface CourseSummaryProps {
  summary: Summary | null;
  isLoading: boolean;
  onStyleChange: (style: SummaryStyle) => void;
  onLanguageChange: (language: SummaryLanguage) => void;
  onGenerateQuiz: () => void;
}

interface StyleSummary {
  [key: string]: string;
}

const CourseSummary = ({
  summary,
  isLoading,
  onStyleChange,
  onLanguageChange,
  onGenerateQuiz,
}: CourseSummaryProps) => {
  const [activeStyle, setActiveStyle] = useState<SummaryStyle>(summary?.style || "casual");
  const [savedSummaries, setSavedSummaries] = useState<StyleSummary>({});
  const [localLoading, setLocalLoading] = useState<{[key: string]: boolean}>({
    casual: false,
    academic: false,
    basic: false
  });
  const [summaryGenerated, setSummaryGenerated] = useState<boolean>(false);

  // Update saved summaries when new summary is received
  useEffect(() => {
    if (summary && !isLoading) {
      setSavedSummaries(prev => ({
        ...prev,
        [summary.style]: summary.content
      }));
      
      // Reset loading state for this style
      setLocalLoading(prev => ({
        ...prev,
        [summary.style]: false
      }));
      
      // Show generated animation
      setSummaryGenerated(true);
      const timer = setTimeout(() => setSummaryGenerated(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [summary, isLoading]);

  // Update activeStyle when summary changes and we don't have an activeStyle saved
  useEffect(() => {
    if (summary && summary.style) {
      setActiveStyle(summary.style);
    }
  }, [summary]);

  const handleStyleChange = (value: string) => {
    const style = value as SummaryStyle;
    setActiveStyle(style);
    
    // Only call the API if we don't have this style saved yet
    if (!savedSummaries[style]) {
      setLocalLoading(prev => ({
        ...prev,
        [style]: true
      }));
      onStyleChange(style);
    }
  };

  const handleLanguageChange = (value: string) => {
    const lang = value as SummaryLanguage;
    onLanguageChange(lang);
    // Clear saved summaries when language changes
    setSavedSummaries({});
    // Reset all loading states
    setLocalLoading({
      casual: false,
      academic: false,
      basic: false
    });
  };

  // Request all summary styles when content changes
  useEffect(() => {
    if (summary && Object.keys(savedSummaries).length === 1 && savedSummaries[summary.style]) {
      const styles: SummaryStyle[] = ["casual", "academic", "basic"];
      
      // Filter out the style we already have
      const missingStyles = styles.filter(style => style !== summary.style);
      
      // Set loading state for missing styles
      missingStyles.forEach(style => {
        setLocalLoading(prev => ({
          ...prev,
          [style]: true
        }));
      });
      
      // Request each missing style
      missingStyles.forEach(style => {
        onStyleChange(style);
      });
    }
  }, [summary, savedSummaries]);

  const languageOptions = [
    { value: "chinese", label: "中文" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" }
  ];

  // Determine if we should display loading state for current style
  const isCurrentStyleLoading = localLoading[activeStyle] || (isLoading && !savedSummaries[activeStyle]);

  const styleLabels = {
    casual: "通俗易懂",
    academic: "学术专业",
    basic: "基础概念"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full overflow-hidden border border-gray-200 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-summary-light to-white">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-summary-DEFAULT" />
            <CardTitle>课程摘要</CardTitle>
            {summaryGenerated && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                已生成
              </motion.div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Select 
              value={summary?.language || "chinese"} 
              onValueChange={handleLanguageChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[120px] border border-gray-300 shadow-sm">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={onGenerateQuiz} 
              disabled={isLoading || !summary}
              className="bg-edu-500 hover:bg-edu-600 text-white shadow-sm transition-all"
            >
              生成测验题
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs 
            defaultValue="casual" 
            value={activeStyle}
            onValueChange={handleStyleChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 rounded-none border-b">
              {Object.entries(styleLabels).map(([style, label]) => (
                <TabsTrigger 
                  key={style} 
                  value={style} 
                  disabled={isLoading}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-summary-DEFAULT rounded-none"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {isCurrentStyleLoading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-summary-DEFAULT mb-4" />
                <p className="text-gray-500">正在生成{styleLabels[activeStyle]}摘要...</p>
              </div>
            ) : savedSummaries[activeStyle] ? (
              <TabsContent value={activeStyle} className="mt-0 p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="prose prose-slate max-w-none"
                >
                  <ReactMarkdown>
                    {savedSummaries[activeStyle]}
                  </ReactMarkdown>
                </motion.div>
              </TabsContent>
            ) : summary ? (
              <TabsContent value={activeStyle} className="mt-0 p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="prose prose-slate max-w-none"
                >
                  <ReactMarkdown>
                    {summary.content}
                  </ReactMarkdown>
                </motion.div>
              </TabsContent>
            ) : (
              <div className="flex flex-col justify-center items-center py-16 text-gray-400">
                <BookOpen className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-center">上传内容后将自动生成摘要</p>
                <p className="text-sm mt-2">支持切换不同风格的摘要查看</p>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseSummary;
