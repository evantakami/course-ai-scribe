
import { Course, HistoryItem } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarClock, FileText, HelpCircle } from "lucide-react";

interface CourseCardProps {
  course: Course;
  historyItems?: HistoryItem[];
  onClick: (courseId: string) => void;
}

const CourseCard = ({ course, historyItems = [], onClick }: CourseCardProps) => {
  // Count items and questions for this course
  const itemCount = historyItems.length;
  
  // Count total questions across all history items
  const questionCount = historyItems.reduce((total, item) => {
    if (!item.questions) return total;
    return total + (
      (item.questions.easy?.length || 0) + 
      (item.questions.medium?.length || 0) + 
      (item.questions.hard?.length || 0)
    );
  }, 0);
  
  // Last updated
  const lastUpdated = historyItems.length > 0 
    ? new Date(historyItems[0].timestamp) 
    : new Date(course.timestamp);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card 
      className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
      onClick={() => onClick(course.id)}
    >
      <div className={`h-2 ${course.color}`} />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <Avatar className="h-14 w-14">
            {course.icon ? (
              <AvatarImage src={course.icon} alt={course.name} />
            ) : null}
            <AvatarFallback className={`${course.color} text-white text-lg`}>
              {course.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <h3 className="font-semibold text-lg mt-4 line-clamp-1">{course.name}</h3>
        
        {course.description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{course.description}</p>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground mt-4 gap-4">
          <div className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            {itemCount} 项笔记
          </div>
          <div className="flex items-center">
            <HelpCircle className="h-3 w-3 mr-1" />
            {questionCount} 题测验
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarClock className="h-3 w-3 mr-1" />
          最近更新: {formatDate(lastUpdated)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
