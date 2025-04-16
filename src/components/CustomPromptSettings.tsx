import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { openaiService } from "@/services/openaiService";
import { SummaryStyle, CustomPromptType } from "@/types";

const formSchema = z.object({
  summary: z.string(),
  questions: z.string(),
  explanation: z.string(),
});

const CustomPromptSettings = () => {
  const [summaryPrompt, setSummaryPrompt] = useState<string>(openaiService.getCustomPrompt('summary'));
  const [questionsPrompt, setQuestionsPrompt] = useState<string>(openaiService.getCustomPrompt('questions'));
  const [explanationPrompt, setExplanationPrompt] = useState<string>(openaiService.getCustomPrompt('explanation'));
  const [isSummaryCustom, setIsSummaryCustom] = useState<boolean>(!!openaiService.getCustomPrompt('summary'));
  const [isQuestionsCustom, setIsQuestionsCustom] = useState<boolean>(!!openaiService.getCustomPrompt('questions'));
  const [isExplanationCustom, setIsExplanationCustom] = useState<boolean>(!!openaiService.getCustomPrompt('explanation'));
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("casual");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: summaryPrompt,
      questions: questionsPrompt,
      explanation: explanationPrompt,
    },
  });

  useEffect(() => {
    setSummaryPrompt(openaiService.getCustomPrompt('summary', summaryStyle));
    setQuestionsPrompt(openaiService.getCustomPrompt('questions'));
    setExplanationPrompt(openaiService.getCustomPrompt('explanation'));
    form.reset({
      summary: openaiService.getCustomPrompt('summary', summaryStyle),
      questions: openaiService.getCustomPrompt('questions'),
      explanation: openaiService.getCustomPrompt('explanation'),
    });
  }, [summaryStyle]);

  const handleStyleChange = (value: string) => {
    setSummaryStyle(value as SummaryStyle);
  };

  const handleSavePrompt = (type: CustomPromptType, value: string) => {
    openaiService.setCustomPrompt(type, value, summaryStyle);
    switch (type) {
      case 'summary':
        setSummaryPrompt(value);
        setIsSummaryCustom(true);
        break;
      case 'questions':
        setQuestionsPrompt(value);
        setIsQuestionsCustom(true);
        break;
      case 'explanation':
        setExplanationPrompt(value);
        setIsExplanationCustom(true);
        break;
    }
    toast({
      title: `${type === 'summary' ? '摘要' : type === 'questions' ? '问题' : '解释'}提示已保存`,
    });
  };

  const handleResetPrompt = (type: CustomPromptType) => {
    openaiService.resetCustomPrompt(type, summaryStyle);
    switch (type) {
      case 'summary':
        setSummaryPrompt(openaiService.getCustomPrompt('summary', summaryStyle));
        setIsSummaryCustom(false);
        break;
      case 'questions':
        setQuestionsPrompt(openaiService.getCustomPrompt('questions'));
        setIsQuestionsCustom(false);
        break;
      case 'explanation':
        setExplanationPrompt(openaiService.getCustomPrompt('explanation'));
        setIsExplanationCustom(false);
        break;
    }
    form.reset({
      summary: openaiService.getCustomPrompt('summary', summaryStyle),
      questions: openaiService.getCustomPrompt('questions'),
      explanation: openaiService.getCustomPrompt('explanation'),
    });
    toast({
      title: `${type === 'summary' ? '摘要' : type === 'questions' ? '问题' : '解释'}提示已重置为默认值`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>自定义提示语</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">摘要提示语</Label>
            <div className="flex items-center space-x-2">
              <Select onValueChange={handleStyleChange} defaultValue={summaryStyle}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择风格" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">通俗易懂</SelectItem>
                  <SelectItem value="academic">学术专业</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => handleResetPrompt('summary')}>
                重置
              </Button>
            </div>
          </div>
          <Textarea
            id="summary"
            value={summaryPrompt}
            onChange={(e) => setSummaryPrompt(e.target.value)}
            className="min-h-[100px]"
            onBlur={(e) => handleSavePrompt('summary', e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="questions">问题提示语</Label>
            <Button variant="outline" size="sm" onClick={() => handleResetPrompt('questions')}>
              重置
            </Button>
          </div>
          <Textarea
            id="questions"
            value={questionsPrompt}
            onChange={(e) => setQuestionsPrompt(e.target.value)}
            className="min-h-[100px]"
            onBlur={(e) => handleSavePrompt('questions', e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="explanation">解释提示语</Label>
            <Button variant="outline" size="sm" onClick={() => handleResetPrompt('explanation')}>
              重置
            </Button>
          </div>
          <Textarea
            id="explanation"
            value={explanationPrompt}
            onChange={(e) => setExplanationPrompt(e.target.value)}
            className="min-h-[100px]"
            onBlur={(e) => handleSavePrompt('explanation', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomPromptSettings;
