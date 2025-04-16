
import { useState } from "react";
import { Summary, SummaryStyle, SummaryLanguage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CourseSummaryProps {
  summary: Summary | null;
  isLoading: boolean;
  onStyleChange: (style: SummaryStyle) => void;
  onLanguageChange: (language: SummaryLanguage) => void;
  onGenerateQuiz: () => void;
}

const CourseSummary = ({
  summary,
  isLoading,
  onStyleChange,
  onLanguageChange,
  onGenerateQuiz,
}: CourseSummaryProps) => {
  const [activeStyle, setActiveStyle] = useState<SummaryStyle>(summary?.style || "casual");

  const handleStyleChange = (value: string) => {
    const style = value as SummaryStyle;
    setActiveStyle(style);
    onStyleChange(style);
  };

  const handleLanguageChange = (value: string) => {
    onLanguageChange(value as SummaryLanguage);
  };

  const languageOptions = [
    { value: "chinese", label: "中文" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>课程摘要</CardTitle>
        <div className="flex items-center space-x-2">
          <Select 
            value={summary?.language || "chinese"} 
            onValueChange={handleLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={onGenerateQuiz} 
            disabled={isLoading || !summary}
            className="bg-edu-600 hover:bg-edu-700"
          >
            生成测验题
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="casual" 
          value={activeStyle}
          onValueChange={handleStyleChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="casual" disabled={isLoading}>通俗易懂</TabsTrigger>
            <TabsTrigger value="academic" disabled={isLoading}>学术专业</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-edu-500" />
              <span className="ml-2 text-edu-600">正在生成摘要...</span>
            </div>
          ) : summary ? (
            <TabsContent value={activeStyle} className="mt-0">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {summary.content}
                </div>
              </div>
            </TabsContent>
          ) : (
            <div className="text-center py-8 text-gray-500">
              上传内容后将自动生成摘要
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CourseSummary;
