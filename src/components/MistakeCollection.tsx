
import { useState, useEffect } from "react";
import { UserAnswer, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import MistakeList from "@/features/mistakes/components/MistakeList";
import MistakeDetail from "@/features/mistakes/components/MistakeDetail";
import MistakeFilters from "@/features/mistakes/components/MistakeFilters";
import { useMistakeCollection } from "@/features/mistakes/hooks/useMistakeCollection";

const MistakeCollection = () => {
  const {
    mistakes,
    selectedMistake,
    setSelectedMistake,
    deleteMistake,
    clearAllMistakes
  } = useMistakeCollection();
  
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    // Load courses
    const userProfileString = localStorage.getItem('user_profile');
    if (userProfileString) {
      const userProfile = JSON.parse(userProfileString);
      if (userProfile.courses) {
        setCourses(userProfile.courses);
      }
    }
  }, []);

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
                  <AlertDialogAction onClick={clearAllMistakes}>
                    确认清空
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <MistakeFilters
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          selectedCourseId={selectedCourseId}
          onCourseChange={setSelectedCourseId}
          courses={courses}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <MistakeList
              mistakes={filteredMistakes}
              selectedMistake={selectedMistake}
              onSelectMistake={setSelectedMistake}
              onDeleteMistake={deleteMistake}
              getCourseById={getCourseById}
            />
          </div>
          
          <div className="md:col-span-1">
            <MistakeDetail mistake={selectedMistake} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MistakeCollection;
