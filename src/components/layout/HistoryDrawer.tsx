
import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, BookOpenCheck, History, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryItem } from "@/types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryDrawer = ({ isOpen, onClose }: HistoryDrawerProps) => {
  const [activeTab, setActiveTab] = useState<string>("history");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      loadHistoryData();
    }
  }, [isOpen]);
  
  const loadHistoryData = () => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const history: HistoryItem[] = JSON.parse(historyString);
      setHistoryItems(history.slice(0, 10)); // Only load 10 most recent items
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistoryItems([]);
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh] glass border-b-0 border-x-0 rounded-t-xl bg-dark/60">
        <DrawerHeader className="flex justify-between items-center border-b border-gray-100/10 pb-4">
          <DrawerTitle className="text-xl font-semibold text-white flex items-center">
            <History className="mr-2 h-5 w-5 text-primary" />
            历史记录 & 复盘
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass bg-dark/30">
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
              >
                <History className="mr-2 h-4 w-4" />
                历史记录
              </TabsTrigger>
              <TabsTrigger 
                value="mistakes" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
              >
                <BookOpenCheck className="mr-2 h-4 w-4" />
                错题集
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-3">
                  {historyItems.length > 0 ? (
                    historyItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="glass-card hover:bg-white/20 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-white truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <FileText className="h-3 w-3 mr-1" />
                              <span>{formatDate(item.timestamp)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-white/10"
                            >
                              <BookOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">暂无历史记录</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="mistakes" className="mt-4">
              <div className="text-center py-12 text-gray-400">
                <BookOpenCheck className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm mb-2">暂无错题记录</p>
                <p className="text-xs">完成测验后，错题将自动显示在这里</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HistoryDrawer;
