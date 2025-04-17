
import { useEffect, useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu,
  SidebarRail
} from "@/components/ui/sidebar";
import { HistoryItem, UserAnswer } from "@/types";
import { toast } from "sonner";
import HistorySidebarItem from "../sidebar/HistorySidebarItem";
import SidebarHeader from "../sidebar/SidebarHeader";
import EmptyHistoryState from "../sidebar/EmptyHistoryState";

interface AppSidebarProps {
  onSelectContent: (content: string) => void;
  saveUserAnswersToHistory?: (userAnswers: UserAnswer[]) => void;
}

const AppSidebar = ({ onSelectContent }: AppSidebarProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

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

  const handleUpdateTitle = (id: string, title: string) => {
    try {
      const updatedHistory = historyItems.map(item => 
        item.id === id ? { ...item, title } : item
      );
      setHistoryItems(updatedHistory);
      localStorage.setItem('content_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to update title:", error);
      toast.error("更新标题失败");
    }
  };

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>最近内容</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {historyItems.length === 0 ? (
                <EmptyHistoryState />
              ) : (
                historyItems.map((item) => (
                  <HistorySidebarItem 
                    key={item.id}
                    item={item}
                    onSelectContent={handleSelectContent}
                    onDeleteItem={handleDeleteItem}
                    onUpdateTitle={handleUpdateTitle}
                  />
                ))
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
