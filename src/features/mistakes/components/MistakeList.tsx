
import { UserAnswer, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MistakeListProps {
  mistakes: UserAnswer[];
  selectedMistake: UserAnswer | null;
  onSelectMistake: (mistake: UserAnswer) => void;
  onDeleteMistake: (questionId: number) => void;
  getCourseById: (id: string) => Course | undefined;
}

const MistakeList = ({ 
  mistakes, 
  selectedMistake, 
  onSelectMistake, 
  onDeleteMistake,
  getCourseById
}: MistakeListProps) => {
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

  return (
    <ScrollArea className="h-[500px] pr-4">
      {mistakes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-2">错题本中暂无内容</p>
          <p className="text-sm text-muted-foreground/70">
            做错的题目会自动收集到这里，方便您复习
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((mistake) => {
            const course = mistake.courseId ? getCourseById(mistake.courseId) : undefined;
            
            return (
              <div 
                key={mistake.questionId}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedMistake?.questionId === mistake.questionId
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectMistake(mistake)}
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
                      onDeleteMistake(mistake.questionId);
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
  );
};

export default MistakeList;
