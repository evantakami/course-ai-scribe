
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, ExternalLink, Check, AlertCircle } from "lucide-react";
import { openaiService } from "@/services/openaiService";
import { toast } from "sonner";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySet: () => void;
}

const ApiKeyModal = ({ isOpen, onClose, onApiKeySet }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setError("请输入您的 API Key");
      return;
    }

    // Basic format validation
    if (!apiKey.startsWith("sk-") || apiKey.length < 20) {
      setError("API Key 格式不正确，应以 sk- 开头");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      // Save the API key (we'll simulate verification)
      setTimeout(() => {
        openaiService.setApiKey(apiKey);
        setIsVerifying(false);
        onApiKeySet();
        toast.success("API Key 设置成功");
      }, 1500);
    } catch (error) {
      setIsVerifying(false);
      setError("验证 API Key 失败，请检查后重试");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md glass border-0 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            设置 OpenAI API Key
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            需要设置您的 OpenAI API Key 才能使用 AI 功能
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card bg-dark/40 mb-4"
          >
            <h3 className="text-sm font-medium text-white mb-2">如何获取 API Key:</h3>
            <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
              <li>登录 OpenAI 官方平台账户</li>
              <li>在设置页面找到 "API keys" 选项</li>
              <li>点击 "Create new secret key" 创建新密钥</li>
              <li>复制生成的密钥并粘贴到下方</li>
            </ol>
            <div className="mt-3">
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs flex items-center text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                前往 OpenAI 平台
              </a>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium text-gray-200">
                API Key
              </label>
              <div className="relative">
                <Input 
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10 bg-dark/20 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                />
                {apiKey && apiKey.startsWith("sk-") && apiKey.length >= 20 && (
                  <Check className="h-4 w-4 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                )}
              </div>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-400 text-xs flex items-start"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <DialogFooter className="mt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-dark-accent"
          >
            取消
          </Button>
          <Button 
            onClick={handleSaveApiKey}
            disabled={isVerifying}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            {isVerifying ? "验证中..." : "保存并验证"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
