
import { useState } from "react";
import { Summary, SummaryStyle } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface CourseSummaryProps {
  summary: Summary | null;
  isLoading: boolean;
  onStyleChange: (style: SummaryStyle) => void;
  onGenerateQuiz: () => void;
}

const CourseSummary = ({
  summary,
  isLoading,
  onStyleChange,
  onGenerateQuiz,
}: CourseSummaryProps) => {
  const [activeTab, setActiveTab] = useState<SummaryStyle>("casual");

  const handleTabChange = (value: string) => {
    const style = value as SummaryStyle;
    setActiveTab(style);
    if (summary?.style !== style) {
      onStyleChange(style);
    }
  };

  if (!summary && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>课程内容总结</span>
          <Button 
            onClick={onGenerateQuiz}
            disabled={isLoading || !summary}
            className="bg-edu-600 hover:bg-edu-700"
          >
            生成测验题
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="casual" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="casual">通俗风格</TabsTrigger>
            <TabsTrigger value="academic">学术风格</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-edu-500" />
              <span className="ml-2 text-edu-600">正在生成摘要...</span>
            </div>
          ) : (
            <TabsContent value={activeTab} className="mt-0">
              <div className="bg-white rounded-md p-4 text-left whitespace-pre-line">
                {summary?.content || ""}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CourseSummary;
