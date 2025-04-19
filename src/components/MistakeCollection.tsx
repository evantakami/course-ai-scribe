
import { useState } from "react";
import { UserAnswer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import MistakeList from "@/features/mistakes/components/MistakeList";
import MistakePractice from "@/features/mistakes/components/MistakePractice";
import { useMistakeCollection } from "@/features/mistakes/hooks/useMistakeCollection";
import { useCourseView } from "@/hooks/useCourseView";
import { useContentHistory } from "@/hooks/useContentHistory";

const MistakeCollection = () => {
  const { selectedCourseId } = useCourseView();
  const { 
    mistakes, 
    deleteMistake, 
    clearAllMistakes
  } = useMistakeCollection(selectedCourseId);
  
  const [isPracticing, setIsPracticing] = useState(false);
  const { saveToHistory } = useContentHistory();

  const handleUpdateMistakes = (newAnswers: UserAnswer[]) => {
    try {
      // Update the mistake collection with new answers (including attempts)
      // but DO NOT remove correct answers
      const updatedMistakes = mistakes.map(mistake => {
        const updatedMistake = newAnswers.find(a => a.questionId === mistake.questionId);
        return updatedMistake || mistake;
      });
      
      // Save to localStorage
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
      
      // Save to history
      if (selectedCourseId) {
        saveToHistory({ 
          rawContent: "错题练习",
          summary: null,
          questions: {
            easy: [], 
            medium: updatedMistakes.map(m => ({
              id: m.questionId,
              text: m.question,
              options: m.options,
              correctAnswer: m.correctAnswer,
              explanation: m.explanation,
              difficulty: "medium"
            })),
            hard: []
          }
        }, selectedCourseId);
      }
      
      // Show toast about practice results
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      if (correctCount > 0) {
        toast.success(`本次练习正确: ${correctCount} 道题`);
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
