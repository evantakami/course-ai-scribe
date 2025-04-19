
import { useState, useEffect } from "react";
import { UserAnswer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import MistakeList from "@/features/mistakes/components/MistakeList";
import MistakePractice from "@/features/mistakes/components/MistakePractice";

const MistakeCollection = () => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const parsed = JSON.parse(mistakesString);
      setMistakes(parsed);
    } catch (error) {
      console.error("Failed to load mistakes:", error);
      setMistakes([]);
    }
  };

  const handleDeleteMistake = (questionId: number) => {
    try {
      const updatedMistakes = mistakes.filter(m => m.questionId !== questionId);
      setMistakes(updatedMistakes);
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
      toast.success("已从错题本中删除");
    } catch (error) {
      console.error("Failed to delete mistake:", error);
      toast.error("删除失败");
    }
  };

  const handleUpdateMistakes = (newAnswers: UserAnswer[]) => {
    try {
      // Only update correctly answered questions
      const correctAnswers = newAnswers.filter(answer => answer.isCorrect);
      
      if (correctAnswers.length > 0) {
        // Remove correct answers from mistake collection
        const updatedMistakes = mistakes.filter(mistake => 
          !correctAnswers.some(answer => answer.questionId === mistake.questionId)
        );
        
        setMistakes(updatedMistakes);
        localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
        
        toast.success(`恭喜！已掌握 ${correctAnswers.length} 道题目`);
      }
    } catch (error) {
      console.error("Failed to update mistakes:", error);
      toast.error("更新错题本失败");
    }
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
        {isPracticing ? (
          <MistakePractice
            mistakes={mistakes}
            onBackToList={() => setIsPracticing(false)}
            onUpdateMistakes={handleUpdateMistakes}
          />
        ) : (
          <MistakeList
            mistakes={mistakes}
            onStartPractice={() => setIsPracticing(true)}
            onDeleteMistake={handleDeleteMistake}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MistakeCollection;
