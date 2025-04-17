
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
    <SidebarMenuItem className="py-3">
      {editingTitle ? (
        <div className="p-2 w-full space-y-2" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-10"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveTitle();
              }
            }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 px-3"
              onClick={(e) => {
                e.stopPropagation();
                setEditingTitle(false);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              取消
            </Button>
            <Button 
              size="sm" 
              className="h-8 px-3"
              onClick={(e) => saveTitle(e)}
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <SidebarMenuButton 
          onClick={() => onSelectContent(item.rawContent)}
          className="group relative py-2"
        >
          <div className="space-y-2 w-full">
            <span className="block line-clamp-2 text-base">{item.title || "未命名笔记"}</span>
            
            {/* Status indicators */}
            <div className="flex flex-wrap gap-2">
              {hasSummaries && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-sm px-2 py-1 bg-blue-50">
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
                      <Badge variant="outline" className="text-sm px-2 py-1 bg-green-50">
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
                      <Badge variant="outline" className="text-sm px-2 py-1 bg-orange-50">
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
          </div>
          
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-1" 
              onClick={(e) => startEditTitle(e)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-1 text-red-500 hover:text-red-700" 
              onClick={(e) => onDeleteItem(item.id, e)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export default HistorySidebarItem;
