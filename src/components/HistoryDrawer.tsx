
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <History className="h-4 w-4" />
          历史记录
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center">
            <Scroll className="mr-2 h-5 w-5" />
            历史内容
          </SheetTitle>
          <SheetDescription>
            查看和使用您之前保存的内容
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {historyItems.length} 个保存的内容
          </p>
          
          {historyItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Trash2 className="h-4 w-4" />
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
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-2">没有保存的历史内容</p>
              <p className="text-sm text-muted-foreground/70">
                处理内容时点击"保存"按钮将内容保存到历史记录
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <Card key={item.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between">
                      {formatDate(item.timestamp)}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {item.rawContent.length} 个字符
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
                      {truncateContent(item.rawContent)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      删除
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSelectContent(item.rawContent)}
                    >
                      使用
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
