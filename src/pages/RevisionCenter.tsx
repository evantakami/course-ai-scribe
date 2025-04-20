import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, TrendingUp, History, Search, Eye, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import { HistoryItem, UserAnswer } from "@/types";

interface RevisionCenterProps {
  initialContent?: any;
  activeTab?: string;
}

const RevisionCenter = ({ initialContent, activeTab }: RevisionCenterProps) => {
  const [localActiveTab, setLocalActiveTab] = useState<string>("history");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [mistakeItems, setMistakeItems] = useState<UserAnswer[]>([]);
  
  useEffect(() => {
    loadHistoryData();
    loadMistakesData();

    // Process initialContent if available
    if (initialContent && initialContent.courseId) {
      setSelectedCourseId(initialContent.courseId);
    }
  }, [initialContent]);
  
  const loadHistoryData = () => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const history: HistoryItem[] = JSON.parse(historyString);
      setHistoryItems(history);
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistoryItems([]);
    }
  };
  
  const loadMistakesData = () => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const mistakes: UserAnswer[] = JSON.parse(mistakesString);
      setMistakeItems(mistakes);
    } catch (error) {
      console.error("Failed to load mistakes:", error);
      setMistakeItems([]);
    }
  };
  
  const filteredHistory = historyItems.filter(item => {
    const matchesCourse = selectedCourseId === "all" || item.courseId === selectedCourseId;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });
  
  const filteredMistakes = mistakeItems.filter(item => {
    const matchesCourse = selectedCourseId === "all" || item.courseId === selectedCourseId;
    const matchesSearch = item.question?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Generate mock chart data
  const quizData = [
    { name: '简单', 正确: 8, 错误: 2, amt: 10 },
    { name: '中等', 正确: 6, 错误: 4, amt: 10 },
    { name: '困难', 正确: 4, 错误: 6, amt: 10 },
  ];
  
  const pieData = [
    { name: '学术摘要', value: 31 },
    { name: '通俗摘要', value: 45 },
    { name: '基础摘要', value: 24 },
  ];
  
  const COLORS = ['#FF6A00', '#00E5FF', '#D700FF'];

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Header Card */}
        <Card className="glass border-0 mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/20 to-secondary/20 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-white flex items-center">
                  <BookOpenCheck className="mr-2 h-5 w-5 text-accent" />
                  复盘中心
                </CardTitle>
                <CardDescription className="text-gray-300">
                  查看历史内容、错题集和学习报告
                </CardDescription>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger className="bg-dark/20 border-gray-700 text-white w-full sm:w-[180px]">
                    <SelectValue placeholder="选择课程" />
                  </SelectTrigger>
                  <SelectContent className="glass border-gray-700">
                    <SelectItem value="all">所有课程</SelectItem>
                    <SelectItem value="default">通用课程</SelectItem>
                    <SelectItem value="programming">编程开发</SelectItem>
                    <SelectItem value="language">语言学习</SelectItem>
                    <SelectItem value="science">科学研究</SelectItem>
                    <SelectItem value="business">商业管理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Main Content */}
        <Tabs value={localActiveTab} onValueChange={setLocalActiveTab} className="w-full">
          <TabsList className="glass bg-dark/30 mb-6">
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
            >
              <History className="h-4 w-4 mr-2" />
              历史记录
            </TabsTrigger>
            <TabsTrigger
              value="mistakes"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
            >
              <BookOpenCheck className="h-4 w-4 mr-2" />
              错题集
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-primary"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              学习报告
            </TabsTrigger>
          </TabsList>
          
          {/* History Tab */}
          <TabsContent value="history" className="mt-0">
            <Card className="glass border-0">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-medium text-white">课程内容历史</h3>
                  
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="搜索历史记录..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 bg-dark/20 border-gray-700 text-white placeholder:text-gray-500 w-full sm:w-[240px]"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {filteredHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistory.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="glass-card hover:bg-white/20 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-base font-medium text-white truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <Badge className="bg-accent/20 text-accent hover:bg-accent/30 border-0 ml-2 flex-shrink-0">
                            {item.courseId === "default" ? "通用" : 
                             item.courseId === "programming" ? "编程" :
                             item.courseId === "language" ? "语言" :
                             item.courseId === "science" ? "科学" :
                             item.courseId === "business" ? "商业" : "其他"}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-3 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(item.timestamp)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">
                              {item.language === "chinese" ? "中文" : 
                               item.language === "english" ? "英文" :
                               item.language === "spanish" ? "西班牙语" : "法语"}
                            </Badge>
                            
                            {item.summaries && (
                              <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 border-0">
                                摘要
                              </Badge>
                            )}
                            
                            {item.questions && (
                              <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 border-0">
                                测验
                              </Badge>
                            )}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm mb-2">暂无历史记录</p>
                    <p className="text-xs">处理内容后，将自动保存到历史记录</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Mistakes Tab */}
          <TabsContent value="mistakes" className="mt-0">
            <Card className="glass border-0">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-medium text-white">错题集</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Select defaultValue="all">
                        <SelectTrigger className="pl-8 bg-dark/20 border-gray-700 text-white w-full sm:w-[140px]">
                          <SelectValue placeholder="难度" />
                        </SelectTrigger>
                        <SelectContent className="glass border-gray-700">
                          <SelectItem value="all">所有难度</SelectItem>
                          <SelectItem value="easy">简单</SelectItem>
                          <SelectItem value="medium">普通</SelectItem>
                          <SelectItem value="hard">困难</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="搜索错题..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 bg-dark/20 border-gray-700 text-white placeholder:text-gray-500 w-full sm:w-[240px]"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {filteredMistakes.length > 0 ? (
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                      {filteredMistakes.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className="glass-card hover:bg-white/20 cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-base font-medium text-white pr-2">
                              {item.question || "错题示例问题？"}
                            </h4>
                            <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0 ml-2 flex-shrink-0">
                              错题
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-gray-300 mb-2">
                              <span className="text-red-400 font-medium">您的选择：</span> {item.options?.[item.selectedOptionIndex] || '未知'}
                            </div>
                            <div className="text-sm text-gray-300">
                              <span className="text-green-400 font-medium">正确答案：</span> {item.options?.[item.correctAnswer] || "选项B"}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-400 mt-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(item.timestamp)}</span>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                            >
                              查看解释
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpenCheck className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm mb-2">暂无错题记录</p>
                    <p className="text-xs">完成测验后，错题将自动保存到这里</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-white">测验完成情况</CardTitle>
                  <CardDescription className="text-gray-400">
                    各难度级别的测验答题情况统计
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={quizData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#222', borderColor: '#555' }} 
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="正确" fill="#FF6A00" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="错误" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-white">摘要风格使用情况</CardTitle>
                  <CardDescription className="text-gray-400">
                    不同摘要风格的使用比例
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={70}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#222', borderColor: '#555' }} 
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default RevisionCenter;
