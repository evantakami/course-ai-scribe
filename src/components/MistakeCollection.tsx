
import { useState, useEffect } from "react";
import { UserAnswer, Course } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MistakeList from "@/features/mistakes/components/MistakeList";
import MistakePractice from "@/features/mistakes/components/MistakePractice";
import { useMistakeCollection } from "@/features/mistakes/hooks/useMistakeCollection";

const MistakeCollection = () => {
  const { 
    mistakes, 
    deleteMistake, 
    clearAllMistakes
  } = useMistakeCollection();
  
  const [isPracticing, setIsPracticing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && Array.isArray(userProfile.courses)) {
          setCourses(userProfile.courses);
          if (userProfile.courses.length > 0) {
            setSelectedCourseId(userProfile.courses[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
      toast.error("加载课程失败");
    }
  };

  const handleUpdateMistakes = (newAnswers: UserAnswer[]) => {
    try {
      const correctAnswers = newAnswers.filter(answer => answer.isCorrect);
      
      if (correctAnswers.length > 0) {
        correctAnswers.forEach(answer => {
          deleteMistake(answer.questionId);
        });
        
        toast.success(`恭喜！已掌握 ${correctAnswers.length} 道题目`);
      }
    } catch (error) {
      console.error("Failed to update mistakes:", error);
      toast.error("更新错题本失败");
    }
  };

  const getMistakesByCourseid = (courseId: string) => {
    return mistakes.filter(mistake => mistake.courseId === courseId);
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          错题本
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedCourseId} onValueChange={setSelectedCourseId}>
          <TabsList className="mb-4">
            {courses.map(course => (
              <TabsTrigger key={course.id} value={course.id}>
                {course.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {courses.map(course => (
            <TabsContent key={course.id} value={course.id}>
              {isPracticing ? (
                <MistakePractice
                  mistakes={getMistakesByCourseid(course.id)}
                  onBackToList={() => setIsPracticing(false)}
                  onUpdateMistakes={handleUpdateMistakes}
                />
              ) : (
                <MistakeList
                  mistakes={getMistakesByCourseid(course.id)}
                  onStartPractice={() => setIsPracticing(true)}
                  onDeleteMistake={deleteMistake}
                  onClearAll={clearAllMistakes}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MistakeCollection;
