
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BookOpenCheck, HelpCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetApiKey: (key: string) => void;
}

const WelcomeModal = ({ isOpen, onClose, onSetApiKey }: WelcomeModalProps) => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("请输入有效的 API Key");
      return;
    }

    setIsLoading(true);
    
    // Simulate API key validation
    setTimeout(() => {
      onSetApiKey(apiKey);
      setIsLoading(false);
      toast.success("API Key 设置成功");
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xl glass border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            欢迎使用 Course AI Scribe
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            这是一款帮助您从课程内容中提取关键知识点及生成测验的AI助手
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="welcome" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 bg-dark/20">
            <TabsTrigger value="welcome">欢迎</TabsTrigger>
            <TabsTrigger value="features">功能介绍</TabsTrigger>
            <TabsTrigger value="apikey">设置 API Key</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="welcome" className="mt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <BookOpen className="h-16 w-16 text-primary mb-2" />
                  <h2 className="text-2xl font-bold text-white">智能课程助手</h2>
                  <p className="text-gray-300 max-w-md">
                    上传您的课程内容，AI 将自动提取关键知识点，生成摘要，并创建测验题帮助您巩固学习。
                  </p>
                  <div className="pt-4">
                    <Button onClick={() => setActiveTab("features")} className="bg-primary hover:bg-primary/90 text-white hover-glow">
                      了解更多
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        智能摘要
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-300">自动提取课程中的关键知识点，生成不同风格的摘要内容</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                        智能测验
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-300">根据课程内容自动生成不同难度的测验题，帮助您巩固学习</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center">
                        <BookOpenCheck className="h-5 w-5 mr-2 text-primary" />
                        学习复盘
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-300">收集错题并提供个性化学习建议，帮助您提升薄弱环节</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button onClick={() => setActiveTab("apikey")} className="bg-primary hover:bg-primary/90 text-white hover-glow">
                    开始使用
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="apikey" className="mt-6">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-primary" />
                      设置 API Key
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      需要设置 OpenAI API Key 才能使用 AI 功能
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300">
                        请输入您的 OpenAI API Key，可以在 OpenAI 官网获取：
                        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary ml-1 hover:underline">
                          https://platform.openai.com/api-keys
                        </a>
                      </p>
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-dark/30 border-gray-700 text-white"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("features")} className="border-gray-700 text-gray-300">
                      返回
                    </Button>
                    <Button 
                      onClick={handleSetApiKey} 
                      disabled={isLoading} 
                      className="bg-primary hover:bg-primary/90 text-white hover-glow"
                    >
                      {isLoading ? "设置中..." : "确认设置"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <DialogFooter className="mt-6 text-xs text-gray-500">
          Course AI Scribe © {new Date().getFullYear()} 版权所有
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
