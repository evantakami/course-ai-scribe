
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import { openaiService } from "@/services/openaiService";

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    // Check if API key already exists
    const existingKey = openaiService.getApiKey();
    if (existingKey) {
      setIsKeySet(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    openaiService.setApiKey(apiKey.trim());
    setIsKeySet(true);
    onApiKeySet();
  };

  const handleReset = () => {
    openaiService.setApiKey("");
    setApiKey("");
    setIsKeySet(false);
    localStorage.removeItem("openai_api_key");
  };

  if (isKeySet) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-green-700">API Key已设置</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              重置API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Key className="h-5 w-5 mr-2" />
          输入OpenAI API Key
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono"
          />
          <div className="text-xs text-gray-500 mb-4">
            您的API密钥安全存储在本地浏览器中，不会被发送到我们的服务器。
          </div>
          <Button 
            type="submit" 
            disabled={!apiKey.trim()} 
            className="w-full bg-edu-600 hover:bg-edu-700"
          >
            保存
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
