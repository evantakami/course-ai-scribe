
import { useState, useEffect } from "react";
import { HistoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Archive } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuizHistoryCategoriesProps {
  onSelectCategory?: (category: string | null) => void;
}

const QuizHistoryCategories = ({ onSelectCategory }: QuizHistoryCategoriesProps) => {
  const [categories, setCategories] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const history: HistoryItem[] = JSON.parse(historyString);
      
      const categoriesCount: {[key: string]: number} = {};
      
      history.forEach(item => {
        // Extract category from title or first line
        let category = "未分类";
        if (item.title) {
          const titleParts = item.title.split(' - ');
          if (titleParts.length > 0) {
            category = titleParts[0].trim();
          }
        }
        
        // Track categories with quiz answers
        if (item.userAnswers && item.userAnswers.length > 0) {
          if (categoriesCount[category]) {
            categoriesCount[category]++;
          } else {
            categoriesCount[category] = 1;
          }
        }
      });
      
      setCategories(categoriesCount);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleCategorySelect = (category: string | null) => {
    setActiveCategory(category);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">测验分类</h3>
      </div>
      
      <ScrollArea className="max-h-[120px]">
        <div className="flex flex-wrap gap-2 py-1">
          <Badge 
            variant={activeCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleCategorySelect(null)}
          >
            全部
          </Badge>
          
          {Object.keys(categories).length > 0 ? (
            Object.keys(categories).map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategorySelect(category)}
              >
                {category} ({categories[category]})
              </Badge>
            ))
          ) : (
            <div className="text-xs text-muted-foreground flex items-center">
              <Archive className="h-3 w-3 mr-1" />
              暂无测验分类
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuizHistoryCategories;
