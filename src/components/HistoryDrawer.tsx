
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Scroll, History, Clock, Trash2, ArrowRight } from "lucide-react";
import { HistoryItem } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HistoryDrawerProps {
  onSelectContent: (content: string) => void;
}

const HistoryDrawer = ({ onSelectContent }: HistoryDrawerProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistoryItems();
    }
  }, [isOpen]);

  const loadHistoryItems = () => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const history = JSON.parse(historyString);
      setHistoryItems(history);
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistoryItems([]);
    }
  };

  const handleSelectContent = (content: string) => {
    onSelectContent(content);
    setIsOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    try {
      const updatedHistory = historyItems.filter(item => item.id !== id);
      setHistoryItems(updatedHistory);
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
      toast.success("已从历史记录中删除");
    } catch (error) {
      console.error("Failed to delete history item:", error);
      toast.error("删除失败");
    }
  };

  const handleClearAllHistory = () => {
    try {
      localStorage.removeItem('content_history');
      setHistoryItems([]);
      toast.success("已清空所有历史记录");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("清空历史记录失败");
    }
  };

  const getHistoryItemStatus = (item: HistoryItem) => {
    const hasSummaries = item.summaries && Object.keys(item.summaries).length > 0;
    const hasQuiz = item.questions && item.questions.length > 0;
    const hasAnswers = item.userAnswers && item.userAnswers.length > 0;
    
    const summaryCount = hasSummaries ? Object.keys(item.summaries!).length : 0;
    const quizCount = hasQuiz ? item.questions!.length : 0;
    const answersCount = hasAnswers ? item.userAnswers!.length : 0;
    
    return { hasSummaries, hasQuiz, hasAnswers, summaryCount, quizCount, answersCount };
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-5 w-5" />
          历史记录
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center text-xl">
            <Scroll className="mr-3 h-6 w-6" />
            历史内容
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-base text-muted-foreground">
            {historyItems.length} 个保存的内容
          </p>
          
          {historyItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trash2 className="h-5 w-5" />
                  清空
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认清空历史记录</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将删除所有保存的历史内容，且无法恢复。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllHistory}>
                    确认清空
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100vh-220px)]">
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-16 w-16 text-muted-foreground/50 mb-6" />
              <p className="text-base text-muted-foreground mb-3">没有保存的历史内容</p>
              <p className="text-sm text-muted-foreground/70">
                处理内容时系统会自动保存到历史记录
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {historyItems.map((item) => {
                const { hasSummaries, hasQuiz, hasAnswers, summaryCount, quizCount, answersCount } = getHistoryItemStatus(item);
                
                return (
                  <Card key={item.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">
                        {item.title || item.rawContent.slice(0, 60) + '...'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-3 mt-2">
                        {hasSummaries && (
                          <Badge variant="outline" className="text-sm bg-blue-50 px-2 py-1">
                            {summaryCount} 份摘要
                          </Badge>
                        )}
                        {hasQuiz && (
                          <Badge variant="outline" className="text-sm bg-green-50 px-2 py-1">
                            {quizCount} 题测验
                          </Badge>
                        )}
                        {hasAnswers && (
                          <Badge variant="outline" className="text-sm bg-orange-50 px-2 py-1">
                            已答 {answersCount} 题
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </Button>
                      <Button 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleSelectContent(item.rawContent)}
                      >
                        使用
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
