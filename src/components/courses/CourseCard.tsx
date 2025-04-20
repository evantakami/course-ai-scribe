
import { format } from "date-fns";
import { Book, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Course, HistoryItem } from "@/types";
import CourseIcon from "./CourseIcon";

interface CourseCardProps {
  course: Course;
  historyItems: HistoryItem[];
  onClick: () => void;
}

const CourseCard = ({ course, historyItems, onClick }: CourseCardProps) => {
  // Get the most recent history item
  const mostRecentItem = historyItems.length > 0
    ? historyItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;

  // Format the date for display
  const formattedDate = mostRecentItem
    ? format(new Date(mostRecentItem.timestamp), "yyyy-MM-dd")
    : format(new Date(course.timestamp), "yyyy-MM-dd");

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <CourseIcon course={course} size="lg" />
        <div>
          <CardTitle className="text-lg">{course.name}</CardTitle>
          <CardDescription>
            {course.description || "无描述"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{historyItems.length} 个内容</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 pt-2 pb-2 text-xs text-muted-foreground flex items-center">
        <Book className="h-3.5 w-3.5 mr-1.5" />
        {mostRecentItem ? mostRecentItem.title || "最近更新内容" : "尚未添加内容"}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
