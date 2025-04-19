
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Summary, SummaryStyle } from "@/types";
import { Loader2, BookOpen, HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SummaryTabProps {
  summary: Summary | null;
  isLoading: boolean;
  onStyleChange: (style: SummaryStyle) => void;
  onGenerateQuiz: () => void;
}

const SummaryTab = ({
  summary,
  isLoading,
  onStyleChange,
  onGenerateQuiz
}: SummaryTabProps) => {
  const handleStyleChange = (value: string) => {
    onStyleChange(value as SummaryStyle);
  };

  return (
    <TabsContent value="summary" className="mt-2">
      {!summary && !isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">请先在"输入内容"标签页输入内容并处理</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              内容摘要
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select
                value={summary?.style || "casual"}
                onValueChange={handleStyleChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择风格" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">通俗易懂</SelectItem>
                  <SelectItem value="academic">学术专业</SelectItem>
                  <SelectItem value="basic">基础概念</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateQuiz}
                disabled={isLoading}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                生成测验题
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-edu-500" />
                <span className="ml-3 text-lg text-edu-600">生成摘要中...</span>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>
                  {summary?.content || ""}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default SummaryTab;
