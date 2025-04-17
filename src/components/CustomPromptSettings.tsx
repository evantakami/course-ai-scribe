
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CustomPromptType, CustomPrompt } from "@/types";

const promptTypes: { value: CustomPromptType; label: string }[] = [
  { value: "summary", label: "摘要生成" },
  { value: "questions", label: "问题生成" },
  { value: "explanation", label: "答案解析" },
];

const CustomPromptSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CustomPromptType>("summary");
  const [summaryStyle, setSummaryStyle] = useState<"casual" | "academic" | undefined>("casual");
  const [promptContent, setPromptContent] = useState("");
  
  const handleSheetOpen = (open: boolean) => {
    if (open) {
      // Load current prompt when opening
      loadCurrentPrompt();
    }
    setIsOpen(open);
  };
  
  const loadCurrentPrompt = () => {
    let content: string;
    
    if (activeTab === "summary" && summaryStyle) {
      content = openaiService.getCustomPrompt(activeTab, summaryStyle);
    } else {
      content = openaiService.getCustomPrompt(activeTab);
    }
    
    setPromptContent(content);
  };
  
  const handleTabChange = (value: string) => {
    const tabValue = value as CustomPromptType;
    setActiveTab(tabValue);
    
    // Reset summary style when changing tabs
    if (tabValue !== "summary") {
      setSummaryStyle(undefined);
    } else if (!summaryStyle) {
      setSummaryStyle("casual");
    }
    
    // Load the prompt for the new tab
    setTimeout(() => {
      loadCurrentPrompt();
    }, 0);
  };
  
  const handleSummaryStyleChange = (value: string) => {
    const style = value as "casual" | "academic";
    setSummaryStyle(style);
    
    // Load the prompt for the new style
    setTimeout(() => {
      loadCurrentPrompt();
    }, 0);
  };

  const handleSavePrompt = () => {
    try {
      if (activeTab === "summary" && summaryStyle) {
        openaiService.setCustomPrompt(activeTab, promptContent, summaryStyle);
      } else {
        openaiService.setCustomPrompt(activeTab, promptContent);
      }
      
      toast.success("自定义提示词已保存");
    } catch (error) {
      console.error("Error saving custom prompt:", error);
      toast.error("保存自定义提示词失败");
    }
  };

  const handleResetPrompt = () => {
    try {
      if (activeTab === "summary" && summaryStyle) {
        openaiService.resetCustomPrompt(activeTab, summaryStyle);
      } else {
        openaiService.resetCustomPrompt(activeTab);
      }
      
      loadCurrentPrompt();
      toast.success("已重置为默认提示词");
    } catch (error) {
      console.error("Error resetting custom prompt:", error);
      toast.error("重置提示词失败");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Settings className="h-4 w-4" />
          自定义提示词
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>自定义提示词设置</SheetTitle>
          <SheetDescription>
            自定义AI生成内容的提示词，以获得更适合您需求的结果
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <Tabs 
            defaultValue="summary" 
            value={activeTab} 
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {promptTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeTab === "summary" && (
              <div className="mb-4">
                <Select 
                  value={summaryStyle} 
                  onValueChange={handleSummaryStyleChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择摘要样式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">通俗易懂</SelectItem>
                    <SelectItem value="academic">学术专业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <TabsContent value="summary" className="space-y-4">
              <Textarea 
                placeholder="输入摘要生成的提示词..."
                className="min-h-[200px]"
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <Textarea 
                placeholder="输入问题生成的提示词..."
                className="min-h-[200px]"
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="explanation" className="space-y-4">
              <Textarea 
                placeholder="输入答案解析的提示词..."
                className="min-h-[200px]"
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={handleResetPrompt}
            >
              重置为默认
            </Button>
            <div className="space-x-2">
              <SheetClose asChild>
                <Button variant="outline">
                  取消
                </Button>
              </SheetClose>
              <Button onClick={handleSavePrompt}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomPromptSettings;
