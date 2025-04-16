
import { useState, useEffect } from "react";
import { UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trash2, BookOpen, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MistakeCollection = () => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedMistake, setSelectedMistake] = useState<UserAnswer | null>(null);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const parsed = JSON.parse(mistakesString);
      setMistakes(parsed);
    } catch (error) {
      console.error("Failed to load mistakes:", error);
      setMistakes([]);
    }
  };

  const handleDeleteMistake = (questionId: number) => {
    try {
      const updatedMistakes = mistakes.filter(m => m.questionId !== questionId);
      setMistakes(updatedMistakes);
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
      toast.success("已从错题本中删除");
      
      if (selectedMistake?.questionId === questionId) {
        setSelectedMistake(null);
      }
    } catch (error) {
      console.error("Failed to delete mistake:", error);
      toast.error("删除失败");
    }
  };

  const handleClearAllMistakes = () => {
    try {
      localStorage.removeItem('mistake_collection');
      setMistakes([]);
      setSelectedMistake(null);
      toast.success("已清空错题本");
    } catch (error) {
      console.error("Failed to clear mistakes:", error);
      toast.error("清空错题本失败");
    }
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredMistakes = selectedTab === "all" 
    ? mistakes 
    : mistakes.filter(m => {
        if (selectedTab === "recent") {
          const date = typeof m.timestamp === 'string' 
            ? new Date(m.timestamp) 
            : m.timestamp;
          return date && (new Date().getTime() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000);
        }
        return false;
      });

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          错题本
          <Badge variant="outline" className="ml-2">
            {mistakes.length}
          </Badge>
        </CardTitle>
        
        {mistakes.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                清空
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认清空错题本</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作将删除所有保存的错题，且无法恢复。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllMistakes}>
                  确认清空
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="all" 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="all">所有错题</TabsTrigger>
            <TabsTrigger value="recent">最近一周</TabsTrigger>
          </TabsList>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <ScrollArea className="h-[500px] pr-4">
                {filteredMistakes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-2">错题本中暂无内容</p>
                    <p className="text-sm text-muted-foreground/70">
                      做错的题目会自动收集到这里，方便您复习
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMistakes.map((mistake) => (
                      <div 
                        key={mistake.questionId}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedMistake?.questionId === mistake.questionId
                            ? "bg-blue-50 border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedMistake(mistake)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {mistake.question || `问题 #${mistake.questionId}`}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMistake(mistake.questionId);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {mistake.timestamp && (
                          <p className="text-xs text-gray-500">
                            {formatDate(mistake.timestamp)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="md:col-span-1">
              {selectedMistake ? (
                <div className="bg-white p-4 rounded-lg border h-[500px] overflow-auto">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedMistake.question}
                  </h3>
                  
                  {selectedMistake.options && (
                    <div className="space-y-3 mb-6">
                      {selectedMistake.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`
                            flex items-start space-x-2 rounded-md p-3 border
                            ${index === selectedMistake.correctAnswer ? 'bg-green-50 border-green-200' :
                              index === selectedMistake.selectedOption ? 'bg-red-50 border-red-200' :
                              'border-gray-100'}
                          `}
                        >
                          <div className="flex-grow font-normal">
                            {option}
                          </div>
                          {index === selectedMistake.correctAnswer ? (
                            <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                          ) : index === selectedMistake.selectedOption ? (
                            <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedMistake.explanation && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="flex items-center text-sm font-medium text-blue-800 mb-2">
                        <HelpCircle className="mr-1 h-4 w-4" />
                        解析
                      </h4>
                      <div className="text-sm text-gray-700 prose max-w-none">
                        <ReactMarkdown>{selectedMistake.explanation}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center border rounded-lg p-6">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-2">选择一个错题查看详情</p>
                  <p className="text-sm text-muted-foreground/70">
                    点击左侧错题列表中的一项以查看详细信息
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MistakeCollection;
