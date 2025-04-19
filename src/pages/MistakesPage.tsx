
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MistakeCollection from "@/components/MistakeCollection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

const MistakesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="flex-1">
          <Header />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/input")}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  新增笔记
                </Button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-6">错题本</h1>
            
            <MistakeCollection />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MistakesPage;
