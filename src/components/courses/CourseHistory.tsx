import { useState, useEffect } from "react";
import { HistoryItem, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ChevronRight, 
  File, 
  Book, 
  HelpCircle, 
  Trash2,
  Calendar
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CourseHistoryProps {
  courseId: string;
  onBackClick: () => void;
  onSelectContent: (content: string) => void;
}

const CourseHistory = ({ courseId, onBackClick, onSelectContent }: CourseHistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = () => {
    try {
      // Load course data
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        const foundCourse = userProfile.courses?.find((c: Course) => c.id === courseId);
        if (foundCourse) {
          setCourse(foundCourse);
        }
      }

      // Load history items for this course
      const historyString = localStorage.getItem('content_history') || '[]';
      const allHistory: HistoryItem[] = JSON.parse(historyString);
      const filteredHistory = allHistory.filter(item => item.courseId === courseId);
      setHistoryItems(filteredHistory);
    } catch (error) {
      console.error("Failed to load course history:", error);
      toast.error("加载课程历史记录失败");
    }
  };

  const handleDeleteItem = (id: string) => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const allHistory: HistoryItem[] = JSON.parse(historyString);
      const updatedHistory = allHistory.filter(item => item.id !== id);
      
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
      
      // Update local state
      setHistoryItems(historyItems.filter(item => item.id !== id));
      
      toast.success("已从历史记录中删除");
    } catch (error) {
      console.error("Failed to delete history item:", error);
      toast.error("删除失败");
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

  const getHistoryItemStatus = (item: HistoryItem) => {
    const hasSummaries = item.summaries && Object.keys(item.summaries).length > 0;
    const hasQuiz = item.questions && (
      (item.questions.easy && item.questions.easy.length > 0) ||
      (item.questions.medium && item.questions.medium.length > 0) ||
      (item.questions.hard && item.questions.hard.length > 0)
    );
    const hasAnswers = item.userAnswers && item.userAnswers.length > 0;
    
    return { hasSummaries, hasQuiz, hasAnswers };
  };

  const handleSelectItem = (item: HistoryItem) => {
    try {
      // Store the complete history item in session storage
      sessionStorage.setItem('selected_history_item', JSON.stringify(item));
      
      // Pass the raw content to the parent component
      onSelectContent(item.rawContent);
    } catch (error) {
      console.error("Failed to select history item:", error);
      toast.error("加载历史内容失败");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBackClick}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        
        {course && (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              {course.icon ? (
                <AvatarImage src={course.icon} alt={course.name} />
              ) : null}
              <AvatarFallback className={`${course.color} text-white`}>
                {course.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{course.name}</h2>
          </div>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="text-center py-10">
          <File className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无课程笔记</h3>
          <p className="text-muted-foreground">
            在"输入内容"页面添加课程内容，系统将自动保存到这里
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => {
            const { hasSummaries, hasQuiz, hasAnswers } = getHistoryItemStatus(item);
            
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-2">
                      {item.title || "未命名笔记"}
                    </h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除这条历史记录吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hasSummaries && (
                      <Badge variant="outline" className="bg-blue-50">
                        <Book className="h-3 w-3 mr-1" />
                        已生成摘要
                      </Badge>
                    )}
                    {hasQuiz && (
                      <Badge variant="outline" className="bg-green-50">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        有测验题
                      </Badge>
                    )}
                    {hasAnswers && (
                      <Badge variant="outline" className="bg-orange-50">
                        已答题
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.timestamp)}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-1 ml-auto"
                    onClick={() => handleSelectItem(item)}
                  >
                    使用此内容
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseHistory;
