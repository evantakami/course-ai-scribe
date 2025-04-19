
import { useState } from 'react';
import { UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash2, Eye, EyeOff, Play, TrashIcon } from "lucide-react";
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

interface MistakeListProps {
  mistakes: UserAnswer[];
  onStartPractice: () => void;
  onDeleteMistake: (questionId: number) => void;
  onClearAll?: () => void;
}

const MistakeList = ({ mistakes, onStartPractice, onDeleteMistake, onClearAll }: MistakeListProps) => {
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null);

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>暂无错题记录</p>
      </div>
    );
  }

  const toggleExpand = (questionId: number) => {
    if (expandedMistake === questionId) {
      setExpandedMistake(null);
    } else {
      setExpandedMistake(questionId);
    }
  };

  return (
    <div className="space-y-4">
      {mistakes.length > 0 && (
        <div className="flex justify-between mb-4">
          {onClearAll && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  清空错题本
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认清空错题本</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要清空所有错题吗？此操作无法撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll} className="bg-red-500 hover:bg-red-600">
                    确认清空
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button 
            onClick={onStartPractice}
            className="bg-edu-600 hover:bg-edu-700 ml-auto"
          >
            <Play className="mr-2 h-4 w-4" />
            开始练习
          </Button>
        </div>
      )}
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {mistakes.map((mistake) => (
            <Card key={mistake.questionId} className="relative">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDate(mistake.timestamp)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(mistake.questionId)}
                      title={expandedMistake === mistake.questionId ? "收起详情" : "查看详情"}
                    >
                      {expandedMistake === mistake.questionId ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteMistake(mistake.questionId)}
                      title="删除错题"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <ReactMarkdown>{mistake.question}</ReactMarkdown>
                </div>
                
                {expandedMistake === mistake.questionId && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">选项：</div>
                    <div className="space-y-2">
                      {mistake.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded-md ${
                            index === mistake.correctAnswer 
                              ? "bg-green-100 border border-green-300" 
                              : index === mistake.selectedOption 
                                ? "bg-red-100 border border-red-300" 
                                : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <ReactMarkdown>{option}</ReactMarkdown>
                        </div>
                      ))}
                    </div>
                    
                    {mistake.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className="text-sm font-medium mb-1">题目解析：</div>
                        <div className="text-sm">
                          <ReactMarkdown>{mistake.explanation}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MistakeList;
