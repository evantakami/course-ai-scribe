
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, BookOpenCheck, Copy, Download, ArrowRight } from "lucide-react";
import { SummaryStyle, SummaryLanguage } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const SummaryReport = () => {
  const navigate = useNavigate();
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("casual");
  const [language, setLanguage] = useState<SummaryLanguage>("chinese");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summaryContent, setSummaryContent] = useState<string>(
    "# 摘要示例\n\n这是一个示例摘要，实际内容将根据您上传的课程内容生成。摘要将包含课程的关键知识点、重要概念和核心观点。\n\n## 主要内容\n\n- **概念一**：这里是概念一的简要解释和重要性\n- **概念二**：这里是概念二的简要解释和适用场景\n- **概念三**：这里是概念三的详细说明和示例\n\n## 核心要点\n\n1. 第一个要点及其解释\n2. 第二个要点及其具体应用\n3. 第三个要点及其注意事项\n\n## 总结\n\n本课程主要讲解了上述三个核心概念，它们之间的关系是互相补充、递进的。掌握这些概念对于理解整个学科领域具有重要意义。"
  );

  useEffect(() => {
    // Simulate loading summary on style change
    handleStyleChange(summaryStyle);
  }, []);

  const handleStyleChange = (style: SummaryStyle) => {
    setIsLoading(true);
    setSummaryStyle(style);
    
    // Simulate API call
    setTimeout(() => {
      let newContent = "";
      
      // Different content based on style for demo
      if (style === "academic") {
        newContent = "# 学术风格摘要\n\n本文档旨在提供一个**结构化且全面**的概述，涵盖课程中提出的主要理论框架、方法论及其应用场景。\n\n## 理论基础\n\n本课程基于**认知科学**和**信息处理理论**，探讨了人类学习过程中的关键机制。特别强调了**工作记忆**与**长期记忆**的相互作用，以及它们在知识构建中的核心作用。\n\n## 方法论分析\n\n1. **分散练习效应**：研究表明，将学习内容分散在多个时间段进行复习，相比集中学习在同一时段，能够显著提高知识保留率。具体数据显示，分散学习可提升记忆保留率达40%-60%。\n\n2. **检索练习技术**：通过主动尝试回忆信息，而非简单重复阅读，可增强神经连接强度并建立更稳固的记忆编码。该技术与传统复习方法的对比研究表明，检索练习可将长期知识保留提升约35%。\n\n3. **元认知监控策略**：培养学习者对自身理解程度的准确评估能力，包括理解监控、进度评估及适应性调整学习策略。\n\n## 综合评价\n\n课程所呈现的研究成果具有**显著的实证支持**，各项技术之间存在协同效应，共同构成了一个系统性的学习优化框架。";
      } else if (style === "casual") {
        newContent = "# 通俗易懂版摘要\n\n这门课主要告诉我们如何**更有效地学习**，用简单方法提高学习效果。\n\n## 学习的基本原理\n\n我们的大脑就像一个处理信息的电脑：短期记忆就是正在运行的程序，长期记忆则是硬盘存储。要学好东西，关键是把信息从"临时区"转移到"永久区"。\n\n## 实用学习技巧\n\n1. **间隔学习法**：与其一次学3小时，不如分成3天每天学1小时。这就像健身一样，适当休息反而更有效！研究表明这样做记忆效果能提高一半左右。\n\n2. **主动回忆法**：别只是反复读材料，读完合上书，试着回忆刚才读了什么。这个简单动作能让你的记忆更牢固，比单纯重复阅读强35%左右。\n\n3. **自我评估法**：经常问自己"我真的懂了吗？"，遇到不懂的马上解决，而不是假装理解。\n\n## 学以致用\n\n这些方法不是什么高深理论，而是每个人现在就能用的实用技巧。今天学完就可以应用在你的学习中，无论你是学生还是上班族。";
      } else {
        newContent = "# 基础知识点列表\n\n## 核心术语与概念\n\n- **有效学习** (提高记忆保留和理解的方法)\n- **工作记忆** (短期存储信息的脑部系统)\n- **长期记忆** (永久性知识储存系统)\n- **记忆巩固** (将信息从短期记忆转移到长期记忆的过程)\n\n## 实用学习方法\n\n1. **间隔重复法**\n   - 功能：防止遗忘曲线下降\n   - 操作方式：将学习分散到多个时间段\n   - 效果：比集中学习提高约50%的记忆保留率\n\n2. **主动回忆练习**\n   - 功能：增强记忆提取能力\n   - 操作方式：不看材料尝试回忆内容\n   - 适用场景：任何需要记忆的学习内容\n\n3. **元认知监控**\n   - 功能：评估自己的理解程度\n   - 操作方式：定期自测，找出知识盲点\n   - 何时使用：学习过程中的各个阶段\n\n## 实施步骤\n\n1. 制定学习计划，包含间隔时间点\n2. 每次学习后进行回忆练习\n3. 定期自测评估理解程度\n4. 根据自测结果调整学习重点";
      }
      
      setSummaryContent(newContent);
      setIsLoading(false);
    }, 1000);
  };

  const handleLanguageChange = (value: SummaryLanguage) => {
    setIsLoading(true);
    setLanguage(value);
    
    // Simulate API call for language change
    setTimeout(() => {
      let newContent = "";
      
      if (value === "english") {
        newContent = "# Summary\n\n## Core Concepts\n\nThis course covers the following key topics:\n\n- **Effective Learning**: Methods to improve memory retention and understanding\n- **Working Memory**: The brain system that temporarily stores information\n- **Long-term Memory**: The permanent knowledge storage system\n- **Memory Consolidation**: The process of transferring information from short-term to long-term memory\n\n## Practical Learning Methods\n\n1. **Spaced Repetition**\n   - Function: Prevents forgetting curve decline\n   - How to use: Spread learning across multiple time periods\n   - Effect: Improves memory retention by about 50% compared to massed learning\n\n2. **Active Recall Practice**\n   - Function: Strengthens memory retrieval ability\n   - How to use: Try to recall content without looking at materials\n   - Application: Any learning content that needs to be memorized\n\n3. **Metacognitive Monitoring**\n   - Function: Evaluate your own level of understanding\n   - How to use: Regular self-testing, identifying knowledge gaps\n   - When to use: At various stages of the learning process";
      } else if (value === "spanish") {
        newContent = "# Resumen\n\n## Conceptos Principales\n\nEste curso cubre los siguientes temas clave:\n\n- **Aprendizaje Efectivo**: Métodos para mejorar la retención de memoria y comprensión\n- **Memoria de Trabajo**: El sistema cerebral que almacena temporalmente la información\n- **Memoria a Largo Plazo**: El sistema de almacenamiento permanente de conocimientos\n- **Consolidación de la Memoria**: El proceso de transferir información de la memoria a corto plazo a la memoria a largo plazo\n\n## Métodos Prácticos de Aprendizaje\n\n1. **Repetición Espaciada**\n   - Función: Previene la caída de la curva de olvido\n   - Cómo utilizarla: Distribuir el aprendizaje en múltiples períodos de tiempo\n   - Efecto: Mejora la retención de memoria aproximadamente un 50% en comparación con el aprendizaje masivo\n\n2. **Práctica de Recuperación Activa**\n   - Función: Fortalece la capacidad de recuperación de la memoria\n   - Cómo utilizarla: Intentar recordar el contenido sin mirar los materiales\n   - Aplicación: Cualquier contenido de aprendizaje que necesite ser memorizado";
      } else if (value === "french") {
        newContent = "# Résumé\n\n## Concepts Clés\n\nCe cours couvre les sujets clés suivants :\n\n- **Apprentissage Efficace** : Méthodes pour améliorer la rétention de mémoire et la compréhension\n- **Mémoire de Travail** : Le système cérébral qui stocke temporairement l'information\n- **Mémoire à Long Terme** : Le système de stockage permanent des connaissances\n- **Consolidation de la Mémoire** : Le processus de transfert d'informations de la mémoire à court terme à la mémoire à long terme\n\n## Méthodes Pratiques d'Apprentissage\n\n1. **Répétition Espacée**\n   - Fonction : Prévient le déclin de la courbe d'oubli\n   - Comment l'utiliser : Répartir l'apprentissage sur plusieurs périodes de temps\n   - Effet : Améliore la rétention de mémoire d'environ 50% par rapport à l'apprentissage massé\n\n2. **Pratique de Rappel Actif**\n   - Fonction : Renforce la capacité de récupération de la mémoire\n   - Comment l'utiliser : Essayer de se rappeler du contenu sans regarder les documents\n   - Application : Tout contenu d'apprentissage qui doit être mémorisé";
      } else {
        newContent = summaryContent;
      }
      
      setSummaryContent(newContent);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(summaryContent);
    toast.success("摘要已复制到剪贴板");
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([summaryContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `课程摘要_${summaryStyle}_${language}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("摘要已下载");
  };

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
          <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
            <CardTitle className="text-xl text-white flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              课程内容摘要
            </CardTitle>
            <CardDescription className="text-gray-300">
              AI 根据您的内容生成的关键知识点摘要
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column - Controls */}
          <div className="md:col-span-1 space-y-6">
            <Card className="glass border-0">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-white mb-3">摘要风格</h3>
                <Tabs 
                  value={summaryStyle} 
                  onValueChange={(value) => handleStyleChange(value as SummaryStyle)}
                  orientation="vertical"
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto bg-dark/20 p-1 w-full">
                    <TabsTrigger 
                      value="academic" 
                      className="justify-start w-full data-[state=active]:bg-white/10 data-[state=active]:text-primary py-3 px-4"
                    >
                      学术专业
                    </TabsTrigger>
                    <TabsTrigger 
                      value="casual" 
                      className="justify-start w-full data-[state=active]:bg-white/10 data-[state=active]:text-primary py-3 px-4"
                    >
                      通俗易懂
                    </TabsTrigger>
                    <TabsTrigger 
                      value="basic" 
                      className="justify-start w-full data-[state=active]:bg-white/10 data-[state=active]:text-primary py-3 px-4"
                    >
                      基础知识点
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="glass border-0">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-white mb-3">摘要语言</h3>
                <Select value={language} onValueChange={(value) => handleLanguageChange(value as SummaryLanguage)}>
                  <SelectTrigger className="bg-dark/20 border-gray-700 text-white">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent className="glass border-gray-700">
                    <SelectItem value="chinese">中文</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              
              <CardFooter className="px-4 py-3 pt-0 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-white border-gray-700 hover:bg-white/10"
                  onClick={handleCopyContent}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制内容
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-white border-gray-700 hover:bg-white/10"
                  onClick={handleDownloadSummary}
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载摘要
                </Button>
              </CardFooter>
            </Card>
            
            <Button 
              className="w-full bg-primary hover:bg-primary-hover text-white hover-glow"
              onClick={() => navigate('/quiz')}
            >
              前往测验
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          {/* Right Column - Summary Content */}
          <div className="md:col-span-4">
            <Card className="glass border-0 h-full">
              <CardHeader className="pb-2 px-6 pt-5 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">
                    {summaryStyle === "academic" ? "学术专业摘要" : 
                     summaryStyle === "casual" ? "通俗易懂摘要" : 
                     "基础知识点"}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <BookOpenCheck className="h-4 w-4 text-primary" />
                    <span>AI 生成的课程摘要</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[60vh]">
                  <div className="p-6">
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4 bg-white/5" />
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-4/5 bg-white/5" />
                        <Skeleton className="h-6 w-2/3 bg-white/5 mt-6" />
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-3/4 bg-white/5" />
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        {/* This would be a Markdown renderer in a real app */}
                        <div className="whitespace-pre-wrap">
                          {summaryContent.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-2xl font-bold text-white mt-2 mb-4">{line.slice(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-xl font-bold text-white mt-5 mb-3">{line.slice(3)}</h2>;
                            } else if (line.startsWith('### ')) {
                              return <h3 key={index} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(4)}</h3>;
                            } else if (line.startsWith('- ')) {
                              const content = line.slice(2);
                              if (content.includes('**')) {
                                const parts = content.split('**');
                                return (
                                  <div key={index} className="flex items-baseline mb-2">
                                    <div className="text-primary mr-2">•</div>
                                    <div>
                                      {parts.map((part, i) => {
                                        return i % 2 === 1 ? 
                                          <strong key={i} className="text-primary">{part}</strong> : 
                                          <span key={i}>{part}</span>;
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div key={index} className="flex items-baseline mb-2">
                                  <div className="text-primary mr-2">•</div>
                                  <div>{content}</div>
                                </div>
                              );
                            } else if (line.match(/^\d+\. /)) {
                              const number = line.match(/^\d+/)[0];
                              const content = line.slice(number.length + 2);
                              if (content.includes('**')) {
                                const parts = content.split('**');
                                return (
                                  <div key={index} className="flex items-baseline mb-2">
                                    <div className="text-primary mr-2 font-medium">{number}.</div>
                                    <div>
                                      {parts.map((part, i) => {
                                        return i % 2 === 1 ? 
                                          <strong key={i} className="text-primary">{part}</strong> : 
                                          <span key={i}>{part}</span>;
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div key={index} className="flex items-baseline mb-2">
                                  <div className="text-primary mr-2 font-medium">{number}.</div>
                                  <div>{content}</div>
                                </div>
                              );
                            } else if (line === '') {
                              return <div key={index} className="h-4"></div>;
                            } else {
                              if (line.includes('**')) {
                                const parts = line.split('**');
                                return (
                                  <p key={index} className="mb-3">
                                    {parts.map((part, i) => {
                                      return i % 2 === 1 ? 
                                        <strong key={i} className="text-primary">{part}</strong> : 
                                        <span key={i}>{part}</span>;
                                    })}
                                  </p>
                                );
                              }
                              return <p key={index} className="mb-3">{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SummaryReport;
