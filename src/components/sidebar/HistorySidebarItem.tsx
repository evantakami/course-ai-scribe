
import { useState } from "react";
import { Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryItem } from "@/types";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HistorySidebarItemProps {
  item: HistoryItem;
  onSelectContent: (content: string) => void;
  onDeleteItem: (id: string, e: React.MouseEvent) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

const HistorySidebarItem = ({
  item,
  onSelectContent,
  onDeleteItem,
  onUpdateTitle
}: HistorySidebarItemProps) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title || "");

  const startEditTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(true);
    setEditTitle(item.title || "");
  };

  const saveTitle = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onUpdateTitle(item.id, editTitle);
    setEditingTitle(false);
    toast.success("标题已更新");
  };

  const getHistoryItemStatus = () => {
    const hasSummaries = item.summaries && Object.keys(item.summaries).length > 0;
    const hasQuiz = item.questions && item.questions.length > 0;
    const hasAnswers = item.userAnswers && item.userAnswers.length > 0;
    
    return { hasSummaries, hasQuiz, hasAnswers };
  };

  const { hasSummaries, hasQuiz, hasAnswers } = getHistoryItemStatus();

  return (
    <SidebarMenuItem>
      {editingTitle ? (
        <div className="p-1 w-full" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mb-1 h-8"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveTitle();
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
                setEditingTitle(false);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              className="h-6 px-2"
              onClick={(e) => saveTitle(e)}
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <SidebarMenuButton 
          onClick={() => onSelectContent(item.rawContent)}
          className="group relative"
        >
          <span className="line-clamp-1">{item.title || "未命名笔记"}</span>
          
          {/* Status indicators */}
          <div className="flex flex-wrap gap-1 mt-1">
            {hasSummaries && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-blue-50">
                      摘要
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>已生成{Object.keys(item.summaries || {}).length}种风格的摘要</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {hasQuiz && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-green-50">
                      测验
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.questions?.length || 0}道测试题</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {hasAnswers && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-5 bg-orange-50">
                      已答题
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>已完成{item.userAnswers?.length || 0}道题</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={(e) => startEditTitle(e)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700" 
              onClick={(e) => onDeleteItem(item.id, e)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export default HistorySidebarItem;
