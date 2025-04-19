
import { UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MistakeListProps {
  mistakes: UserAnswer[];
  onStartPractice: () => void;
  onDeleteMistake: (questionId: number) => void;
}

const MistakeList = ({ mistakes, onStartPractice, onDeleteMistake }: MistakeListProps) => {
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

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {mistakes.map((mistake) => (
          <Card key={mistake.questionId} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatDate(mistake.timestamp)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteMistake(mistake.questionId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <ReactMarkdown>{mistake.question}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MistakeList;
