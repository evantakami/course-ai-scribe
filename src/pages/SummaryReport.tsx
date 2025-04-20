
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SummaryLanguage, SummaryStyle } from '@/types';
import Markdown from '@/components/common/Markdown';
import { toast } from "sonner";

interface SummaryReportProps {
  initialContent?: any;
  activeTab?: string;
}

const SummaryReport = ({ initialContent, activeTab }: SummaryReportProps) => {
  const navigate = useNavigate();
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("academic");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Process initialContent if available
    if (initialContent && initialContent.summary) {
      setSummary(initialContent.summary);
    }
  }, [initialContent]);

  const handleStyleChange = (style: SummaryStyle) => {
    setSummaryStyle(style);
    // In a real app, this would regenerate the summary with the new style
    // or select a different summary from a set of pre-generated ones
    toast.info(`已切换到${style === "academic" ? "学术" : style === "casual" ? "通俗" : "基础"}风格`);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">摘要报告</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <Tabs defaultValue="academic" onValueChange={(value) => handleStyleChange(value as SummaryStyle)}>
          <TabsList>
            <TabsTrigger value="academic">学术风格</TabsTrigger>
            <TabsTrigger value="casual">通俗风格</TabsTrigger>
            <TabsTrigger value="basic">基础风格</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {summary ? (
            <Markdown content={summary} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              {loading ? (
                <p>生成摘要中，请稍候...</p>
              ) : (
                <p>未找到摘要内容，请先上传并处理内容。</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryReport;
