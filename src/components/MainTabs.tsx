
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Book, HelpCircle, History, XCircle } from "lucide-react";
import { CourseContent } from "@/types";

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  courseContent: CourseContent | null;
}

const MainTabs = ({ activeTab, setActiveTab, courseContent }: MainTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="upload" className="gap-2">
          <FileText className="h-4 w-4" />
          输入内容
        </TabsTrigger>
        <TabsTrigger value="summary" className="gap-2" disabled={!courseContent?.rawContent}>
          <Book className="h-4 w-4" />
          总结
        </TabsTrigger>
        <TabsTrigger value="quiz" className="gap-2" disabled={!courseContent?.rawContent}>
          <HelpCircle className="h-4 w-4" />
          测验
        </TabsTrigger>
        <TabsTrigger value="mistakes" className="gap-2">
          <XCircle className="h-4 w-4" />
          错题本
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2">
          <History className="h-4 w-4" />
          历史记录
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default MainTabs;
