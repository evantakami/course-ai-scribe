
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MistakeCollection from "@/components/MistakeCollection";

const RevisionCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Header Card */}
        <Card className="glass border-0 mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white flex items-center">
                  复盘中心
                </CardTitle>
                <CardDescription className="text-gray-300">
                  查看错题并进行复习
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => navigate('/interactive-quiz')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回测验
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        {/* Main Content */}
        <Card className="glass border-0">
          <CardContent className="p-6">
            <MistakeCollection />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RevisionCenter;
