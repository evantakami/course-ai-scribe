
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Key, FileText, BookOpen, HelpCircle, BookOpenCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
}

const WelcomeModal = ({ isOpen, onClose, hasApiKey }: WelcomeModalProps) => {
  const [currentStep, setCurrentStep] = useState(hasApiKey ? 1 : 0);
  const [showModal, setShowModal] = useState(isOpen);
  
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);
  
  const steps = [
    {
      title: "设置 API Key",
      icon: Key,
      description: "首先需要设置您的 OpenAI API Key，以启用 AI 功能",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "上传内容",
      icon: FileText,
      description: "上传或输入您的课程内容，系统将自动处理",
      color: "text-edu-500",
      bgColor: "bg-edu-100"
    },
    {
      title: "查看摘要",
      icon: BookOpen,
      description: "AI 会生成多种风格的摘要，帮助您理解课程重点",
      color: "text-summary-DEFAULT",
      bgColor: "bg-summary-light"
    },
    {
      title: "测试知识",
      icon: HelpCircle,
      description: "通过生成的测验题巩固知识点，检验学习成果",
      color: "text-quiz-DEFAULT",
      bgColor: "bg-quiz-light"
    },
    {
      title: "复习错题",
      icon: BookOpenCheck,
      description: "错题将被自动收集，方便您集中复习薄弱环节",
      color: "text-mistake-DEFAULT",
      bgColor: "bg-mistake-light"
    }
  ];
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  
  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
      localStorage.setItem("onboarding_completed", "true");
    }, 300);
  };
  
  // Get the current step icon component
  const CurrentStepIcon = steps[currentStep].icon;
  
  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            欢迎使用 AI 课程笔记助手
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            让我们快速了解使用流程，帮助您提高学习效率
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="relative mb-8">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 z-0" />
            <div className="relative z-10 flex justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        transition: { delay: index * 0.2, duration: 0.3 }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index <= currentStep ? step.bgColor : "bg-gray-100"
                      } ${index <= currentStep ? step.color : "text-gray-400"}`}
                    >
                      {index < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </motion.div>
                    {index === 0 && hasApiKey && (
                      <div className="absolute -top-3 left-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        已完成
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center px-4 min-h-[120px] flex flex-col items-center"
            >
              <div className={`w-16 h-16 rounded-full ${steps[currentStep].bgColor} ${steps[currentStep].color} flex items-center justify-center mb-4`}>
                <CurrentStepIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{steps[currentStep].title}</h3>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-gray-200"
          >
            跳过
          </Button>
          <Button 
            onClick={handleNextStep}
            className="bg-edu-500 hover:bg-edu-600 text-white"
          >
            {currentStep < steps.length - 1 ? "下一步" : "开始使用"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
