
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SummaryLanguage } from "@/types";
import LanguageSelector from "@/components/LanguageSelector";

interface ContentProcessorProps {
  content: string;
  isProcessing: boolean;
  selectedLanguage: SummaryLanguage;
  onLanguageChange: (language: SummaryLanguage) => void;
  onProcess: () => void;
}

const ContentProcessor = ({
  content,
  isProcessing,
  selectedLanguage,
  onLanguageChange,
  onProcess
}: ContentProcessorProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>内容处理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <LanguageSelector 
              language={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
            
            <Button
              onClick={onProcess}
              disabled={!content || isProcessing}
              className="bg-edu-600 hover:bg-edu-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                "开始处理"
              )}
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">
              {content || "请输入或上传内容"}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentProcessor;
