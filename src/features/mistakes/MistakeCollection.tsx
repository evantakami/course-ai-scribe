
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import MistakeList from "./MistakeList";
import MistakePractice from "./MistakePractice";
import { useMistakes } from "@/hooks/useMistakes";

const MistakeCollection = () => {
  const { 
    mistakes, 
    isPracticing,
    setIsPracticing,
    deleteMistake, 
    clearAllMistakes,
    updateMistakes
  } = useMistakes();

  return (
    <Card className="w-full">
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
            onUpdateMistakes={updateMistakes}
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
