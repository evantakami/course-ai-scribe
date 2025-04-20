import { useState, useEffect } from "react";
import { UserAnswer, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trash2, BookOpen, HelpCircle, Filter } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MistakeCollection = () => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedMistake, setSelectedMistake] = useState<UserAnswer | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Load mistakes
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const parsed = JSON.parse(mistakesString);
      setMistakes(parsed);
      
      // Load courses
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses) {
          setCourses(userProfile.courses);
        }
      }
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

  const getCourseById = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  // Filter mistakes based on selected tab and course
  const filteredMistakes = mistakes.filter(m => {
    // First filter by tab
    if (selectedTab === "recent") {
      const date = typeof m.timestamp === 'string' 
        ? new Date(m.timestamp) 
        : m.timestamp;
      if (!date || (new Date().getTime() - new Date(date).getTime() > 7 * 24 * 60 * 60 * 1000)) {
        return false;
      }
    }
    
    // Then filter by course if selected
    if (selectedCourseId) {
      return m.courseId === selectedCourseId;
    }
    
    return true;
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
        
        <div className="flex items-center gap-2">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Tabs 
            defaultValue="all" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="recent">最近一周</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select 
            value={selectedCourseId || "all"} 
            onValueChange={setSelectedCourseId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="筛选课程" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部课程</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id} className="flex items-center">
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
                  {filteredMistakes.map((mistake) => {
                    const course = mistake.courseId ? getCourseById(mistake.courseId) : undefined;
                    
                    return (
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
                          <div className="text-sm font-medium line-clamp-2">
                            {mistake.question ? (
                              <ReactMarkdown>{mistake.question}</ReactMarkdown>
                            ) : (
                              `问题 #${mistake.questionId}`
                            )}
                          </div>
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
                        
                        <div className="flex justify-between items-center">
                          {mistake.timestamp && (
                            <p className="text-xs text-gray-500">
                              {formatDate(mistake.timestamp)}
                            </p>
                          )}
                          
                          {course && (
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5">
                                {course.icon ? (
                                  <AvatarImage src={course.icon} alt={course.name} />
                                ) : null}
                                <AvatarFallback className={`text-[10px] ${course.color} text-white`}>
                                  {course.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs ml-1 text-muted-foreground">{course.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="md:col-span-1">
            {selectedMistake ? (
              <div className="bg-white p-4 rounded-lg border h-[500px] overflow-auto">
                <div className="text-lg font-medium mb-4">
                  <ReactMarkdown>{selectedMistake.question || ""}</ReactMarkdown>
                </div>
                
                {selectedMistake.options && (
                  <div className="space-y-3 mb-6">
                    {selectedMistake.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`
                          flex items-start space-x-2 rounded-md p-3 border
                          ${option === mistake.selectedOptionIndex ? 'bg-red-100 text-red-600' : ''}
                        `}
                      >
                        <div className="flex-grow font-normal">
                          <ReactMarkdown>{option}</ReactMarkdown>
                        </div>
                        {index === selectedMistake.correctAnswer ? (
                          <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                        ) : index === selectedMistake.selectedOptionIndex ? (
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
      </CardContent>
    </Card>
  );
};

export default MistakeCollection;
