
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="glass border-x-0 border-b-0 mt-auto py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-gray-300">Course AI Scribe © {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">关于</a>
            <a href="#" className="hover:text-primary transition-colors">使用指南</a>
            <a href="#" className="hover:text-primary transition-colors">API 文档</a>
            <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
