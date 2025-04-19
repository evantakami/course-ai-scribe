
import { useState, useEffect } from "react";
import { UserAnswer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
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

  const handleUpdateMistakes = (newAnswers: UserAnswer[]) => {
    try {
      // Only update correctly answered questions
      const correctAnswers = newAnswers.filter(answer => answer.isCorrect);
      
      if (correctAnswers.length > 0) {
        // Remove correct answers from mistake collection
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
            onDeleteMistake={deleteMistake}
            onClearAll={clearAllMistakes}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MistakeCollection;
