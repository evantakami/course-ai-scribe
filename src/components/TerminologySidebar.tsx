
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Search, X, BookOpen, ChevronLeft } from "lucide-react";

interface Term {
  term: string;
  definition: string;
  category: string;
}

interface TerminologySidebarProps {
  terms: Term[] | null;
  isOpen: boolean;
  onToggle: () => void;
}

const TerminologySidebar = ({ terms, isOpen, onToggle }: TerminologySidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  // Reset selected term when terms change
  useEffect(() => {
    setSelectedTerm(null);
    setActiveCategory(null);
  }, [terms]);

  if (!terms || terms.length === 0) {
    return (
      <div className={`fixed right-0 top-0 bottom-0 w-72 bg-background/80 backdrop-blur-md border-l border-border shadow-lg transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              术语表
            </h3>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">无可用术语</p>
          </div>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = Array.from(new Set(terms.map(term => term.category)));
  
  // Filter terms based on search and category
  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || term.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Collapse/Expand Button */}
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onToggle}
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-30 rounded-l-md rounded-r-none transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        disabled={isOpen}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-background/80 backdrop-blur-md border-l border-border shadow-lg transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              术语表 ({terms.length})
            </h3>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索术语..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1.5 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="p-3 border-b overflow-x-auto">
            <div className="flex space-x-2">
              <Badge
                variant={activeCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(null)}
              >
                全部
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            <div className={`flex-1 overflow-hidden transition-all ${selectedTerm ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
              <ScrollArea className="h-full">
                <div className="p-3 divide-y">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map((term, index) => (
                      <div
                        key={index}
                        className="py-2 cursor-pointer hover:bg-muted/50 px-2 rounded"
                        onClick={() => setSelectedTerm(term)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{term.term}</h4>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {term.definition.substring(0, 60)}...
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      未找到匹配的术语
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {selectedTerm && (
              <div className={`border-l transition-all ${selectedTerm ? 'block w-full md:w-1/2' : 'hidden'}`}>
                <div className="h-full flex flex-col">
                  <div className="p-3 border-b flex items-center justify-between">
                    <h3 className="font-medium">{selectedTerm.term}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedTerm(null)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <Card className="m-3 border">
                      <CardHeader className="py-3">
                        <Badge>{selectedTerm.category}</Badge>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p>{selectedTerm.definition}</p>
                      </CardContent>
                    </Card>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TerminologySidebar;
