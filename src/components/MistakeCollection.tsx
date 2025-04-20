import React, { useState, useEffect } from "react";
import { UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, BookOpen, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

const MistakeCollection = () => {
  const [mistakes, setMistakes] = useState<UserAnswer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMistake, setSelectedMistake] = useState<UserAnswer | null>(null);
  const [customExplanation, setCustomExplanation] = useState<string>("");

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const loadedMistakes = JSON.parse(mistakesString);
      setMistakes(loadedMistakes);
    } catch (error) {
      console.error("Failed to load mistake collection:", error);
    }
  };

  const clearMistakes = () => {
    localStorage.removeItem('mistake_collection');
    setMistakes([]);
    toast.success("错题本已清空");
  };

  const removeMistake = (questionId: number) => {
    const updatedMistakes = mistakes.filter(mistake => mistake.questionId !== questionId);
    localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
    setMistakes(updatedMistakes);
    toast.success("题目已从错题本移除");
  };

  const handleOpenDialog = (mistake: UserAnswer) => {
    setSelectedMistake(mistake);
    setCustomExplanation(mistake.explanation || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMistake(null);
    setCustomExplanation("");
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomExplanation(e.target.value);
  };

  const handleSaveExplanation = () => {
    if (!selectedMistake) return;

    const updatedMistakes = mistakes.map(mistake => {
      if (mistake.questionId === selectedMistake.questionId) {
        return { ...mistake, explanation: customExplanation };
      }
      return mistake;
    });

    localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes));
    setMistakes(updatedMistakes);
    setSelectedMistake({ ...selectedMistake, explanation: customExplanation });
    toast.success("解析已保存");
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("内容已复制到剪贴板");
  };

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        错题本为空
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">错题本</h1>
      
      <div className="mb-4">
        <Button onClick={clearMistakes} variant="destructive">
          清空错题本
        </Button>
      </div>

      {mistakes.map((mistake, index) => (
        <div key={index} className="mb-6 last:mb-0">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-grow">
              <div className="font-medium text-lg">{mistake.question}</div>
              
              <div className="mt-3 space-y-2">
                {mistake.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className={`
                    p-3 rounded-md border 
                    ${optionIndex === mistake.correctAnswer ? 'bg-green-50 border-green-200' : 
                     optionIndex === mistake.selectedOptionIndex ? 'bg-red-50 border-red-200' : 
                     'border-gray-100'}
                  `}>
                    <div className="flex">
                      <div className="flex-grow">{option}</div>
                      {optionIndex === mistake.correctAnswer && (
                        <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                      )}
                      {optionIndex === mistake.selectedOptionIndex && optionIndex !== mistake.correctAnswer && (
                        <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center text-sm font-medium text-blue-800">
                    <HelpCircle className="mr-1 h-4 w-4" />
                    解析
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyToClipboard(mistake.explanation || "暂无解析")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-700 prose max-w-none">
                  <ReactMarkdown>{mistake.explanation || "暂无解析"}</ReactMarkdown>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenDialog(mistake)}
                >
                  编辑解析
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeMistake(mistake.questionId)}
                >
                  移除
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dialog for editing explanation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑解析</DialogTitle>
            <DialogDescription>
              编辑题目解析，帮助你更好地理解错题。
            </DialogDescription>
          </DialogHeader>
          {selectedMistake && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="explanation"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
                >
                  解析内容
                </label>
                <Textarea
                  id="explanation"
                  value={customExplanation}
                  onChange={handleExplanationChange}
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
              取消
            </Button>
            <Button type="submit" onClick={handleSaveExplanation}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MistakeCollection;
