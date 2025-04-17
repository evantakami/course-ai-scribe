
import { useEffect, useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarRail
} from "@/components/ui/sidebar";
import { Edit2, X, Clock, LayoutList, Pen, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HistoryItem, UserAnswer } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  onSelectContent: (content: string) => void;
  saveUserAnswersToHistory?: (userAnswers: UserAnswer[]) => void;
}

const AppSidebar = ({ onSelectContent, saveUserAnswersToHistory }: AppSidebarProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    loadHistoryItems();
  }, []);

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
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const startEditTitle = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const saveTitle = (id: string) => {
    try {
      const updatedHistory = historyItems.map(item => 
        item.id === id ? { ...item, title: editTitle } : item
      );
      setHistoryItems(updatedHistory);
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
      setEditingId(null);
      toast.success("标题已更新");
    } catch (error) {
      console.error("Failed to update title:", error);
      toast.error("更新标题失败");
    }
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getHistoryItemStatus = (item: HistoryItem) => {
    const hasSummaries = item.summaries && Object.keys(item.summaries).length > 0;
    const hasQuiz = item.questions && item.questions.length > 0;
    const hasAnswers = item.userAnswers && item.userAnswers.length > 0;
    
    return { hasSummaries, hasQuiz, hasAnswers };
  };

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="pb-2">
        <div className="flex items-center px-2 pt-2">
          <LayoutList className="mr-2 h-5 w-5" />
          <span className="font-medium">历史记录</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>最近内容</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {historyItems.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无历史记录</p>
                </div>
              ) : (
                historyItems.map((item) => {
                  const { hasSummaries, hasQuiz, hasAnswers } = getHistoryItemStatus(item);
                  
                  return (
                    <SidebarMenuItem key={item.id}>
                      {editingId === item.id ? (
                        <div className="p-1 w-full">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="mb-1 h-8"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveTitle(item.id);
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(null);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveTitle(item.id);
                              }}
                            >
                              保存
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <SidebarMenuButton 
                          onClick={() => handleSelectContent(item.rawContent)}
                          className="group relative"
                        >
                          <span className="line-clamp-1">{item.title || "未命名笔记"}</span>
                          <span className="text-xs text-muted-foreground block mt-1">
                            {formatDate(item.timestamp)}
                          </span>
                          
                          {/* Status indicators */}
                          <div className="flex gap-1 mt-1">
                            {hasSummaries && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-blue-50">
                                <FileText className="h-3 w-3 mr-1" />
                                摘要
                              </Badge>
                            )}
                            {hasQuiz && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-green-50">
                                <HelpCircle className="h-3 w-3 mr-1" />
                                测验
                              </Badge>
                            )}
                            {hasAnswers && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-orange-50">
                                已答题
                              </Badge>
                            )}
                          </div>
                          
                          <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0" 
                              onClick={(e) => startEditTitle(item.id, item.title || "", e)}
                            >
                              <Pen className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700" 
                              onClick={(e) => handleDeleteItem(item.id, e)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="py-2">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          AI课程笔记助手 · {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
