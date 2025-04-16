
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, Save, RotateCcw } from "lucide-react";
import { CustomPrompt, SummaryStyle } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { openaiService } from "@/services/openaiService";

const CustomPromptSettings = () => {
  const [casualSummaryPrompt, setCasualSummaryPrompt] = useState("");
  const [academicSummaryPrompt, setAcademicSummaryPrompt] = useState("");
  const [questionsPrompt, setQuestionsPrompt] = useState("");
  const [explanationPrompt, setExplanationPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [activeSummaryStyle, setActiveSummaryStyle] = useState<SummaryStyle>("casual");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load current prompts from the service
      setCasualSummaryPrompt(openaiService.getCustomPrompt("summary", "casual"));
      setAcademicSummaryPrompt(openaiService.getCustomPrompt("summary", "academic"));
      setQuestionsPrompt(openaiService.getCustomPrompt("questions"));
      setExplanationPrompt(openaiService.getCustomPrompt("explanation"));
    }
  }, [isOpen]);

  const handleSaveSummaryPrompt = (style: SummaryStyle) => {
    try {
      const prompt = style === "casual" ? casualSummaryPrompt : academicSummaryPrompt;
      
      if (prompt.trim().length === 0) {
        toast.error("提示词不能为空");
        return;
      }
      
      openaiService.setCustomPrompt("summary", prompt, style);
      toast.success(`${style === "casual" ? "通俗易懂" : "学术专业"}提示词已保存`);
    } catch (error) {
      console.error("Failed to save prompt:", error);
      toast.error("保存提示词失败");
    }
  };

  const handleSavePrompt = (type: 'questions' | 'explanation') => {
    try {
      const promptMap = {
        'questions': questionsPrompt,
        'explanation': explanationPrompt
      };
      
      const prompt = promptMap[type];
      
      if (prompt.trim().length === 0) {
        toast.error("提示词不能为空");
        return;
      }
      
      openaiService.setCustomPrompt(type, prompt);
      toast.success("提示词已保存");
    } catch (error) {
      console.error("Failed to save prompt:", error);
      toast.error("保存提示词失败");
    }
  };

  const handleResetSummaryPrompt = (style: SummaryStyle) => {
    try {
      openaiService.resetCustomPrompt("summary", style);
      
      // Refresh the prompt in the UI
      if (style === "casual") {
        setCasualSummaryPrompt(openaiService.getCustomPrompt("summary", "casual"));
      } else {
        setAcademicSummaryPrompt(openaiService.getCustomPrompt("summary", "academic"));
      }
      
      toast.success(`${style === "casual" ? "通俗易懂" : "学术专业"}提示词已重置为默认值`);
    } catch (error) {
      console.error("Failed to reset prompt:", error);
      toast.error("重置提示词失败");
    }
  };

  const handleResetPrompt = (type: 'questions' | 'explanation') => {
    try {
      openaiService.resetCustomPrompt(type);
      
      // Refresh the prompt in the UI
      switch (type) {
        case 'questions':
          setQuestionsPrompt(openaiService.getCustomPrompt("questions"));
          break;
        case 'explanation':
          setExplanationPrompt(openaiService.getCustomPrompt("explanation"));
          break;
      }
      
      toast.success("已重置为默认提示词");
    } catch (error) {
      console.error("Failed to reset prompt:", error);
      toast.error("重置提示词失败");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Wand2 className="h-4 w-4" />
          提示词设置
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            自定义AI提示词
          </SheetTitle>
          <SheetDescription>
            自定义生成内容摘要和问题的提示词，使AI输出更符合您的需求
          </SheetDescription>
        </SheetHeader>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">摘要提示词</TabsTrigger>
            <TabsTrigger value="questions">问题提示词</TabsTrigger>
            <TabsTrigger value="explanation">解释提示词</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <Tabs 
              value={activeSummaryStyle} 
              onValueChange={setActiveSummaryStyle}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="casual">通俗易懂</TabsTrigger>
                <TabsTrigger value="academic">学术专业</TabsTrigger>
              </TabsList>
              
              <TabsContent value="casual" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  定制生成通俗易懂的课程内容摘要提示词。此提示词会影响AI如何以简单易懂的方式概括课程内容。
                </p>
                <Textarea
                  placeholder="输入通俗易懂摘要提示词..."
                  className="min-h-[200px]"
                  value={casualSummaryPrompt}
                  onChange={(e) => setCasualSummaryPrompt(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleResetSummaryPrompt("casual")}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    重置默认
                  </Button>
                  <Button 
                    onClick={() => handleSaveSummaryPrompt("casual")}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="academic" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  定制生成学术专业的课程内容摘要提示词。此提示词会影响AI如何以专业学术的方式概括课程内容。
                </p>
                <Textarea
                  placeholder="输入学术专业摘要提示词..."
                  className="min-h-[200px]"
                  value={academicSummaryPrompt}
                  onChange={(e) => setAcademicSummaryPrompt(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleResetSummaryPrompt("academic")}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    重置默认
                  </Button>
                  <Button 
                    onClick={() => handleSaveSummaryPrompt("academic")}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              定制生成测验问题的提示词。此提示词会影响AI如何创建课程内容相关的测验题。
            </p>
            <Textarea
              placeholder="输入自定义问题提示词..."
              className="min-h-[200px]"
              value={questionsPrompt}
              onChange={(e) => setQuestionsPrompt(e.target.value)}
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => handleResetPrompt('questions')}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                重置默认
              </Button>
              <Button 
                onClick={() => handleSavePrompt('questions')}
              >
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="explanation" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              定制测验解释的提示词。此提示词会影响AI如何解释测验题的答案。
            </p>
            <Textarea
              placeholder="输入自定义解释提示词..."
              className="min-h-[200px]"
              value={explanationPrompt}
              onChange={(e) => setExplanationPrompt(e.target.value)}
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => handleResetPrompt('explanation')}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                重置默认
              </Button>
              <Button 
                onClick={() => handleSavePrompt('explanation')}
              >
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default CustomPromptSettings;
