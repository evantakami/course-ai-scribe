
import ApiKeyInput from "@/components/ApiKeyInput";
import UserAccount from "@/components/UserAccount";
import CustomPromptSettings from "@/components/CustomPromptSettings";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, History, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface TopControlsProps {
  onSelectHistoryContent: (content: string) => void;
  onApiKeySet: () => void;
  onViewCourses: () => void;
}

const TopControls = ({ onSelectHistoryContent, onApiKeySet, onViewCourses }: TopControlsProps) => {
  return (
    <motion.div 
      className="flex justify-between mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex space-x-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:bg-edu-50 hover:text-edu-600 transition-colors"
                onClick={onViewCourses}
              >
                <BookOpen className="h-5 w-5" />
                我的课程
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 px-3 text-sm">历史记录</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2 p-2">
                  <li className="px-2 py-1 text-sm font-medium text-center text-muted-foreground">
                    最近浏览
                  </li>
                  <li className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start gap-2"
                      onClick={() => {}}
                    >
                      <History className="h-4 w-4" />
                      查看全部历史
                    </Button>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-edu-50"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <UserAccount />
        <ApiKeyInput onApiKeySet={onApiKeySet} />
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-edu-50"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TopControls;
