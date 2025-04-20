import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  HelpCircle, 
  BookOpenCheck, 
  History,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from '../common/ThemeToggle';
import { motion } from 'framer-motion';
import CustomPromptSettings from '../CustomPromptSettings';

interface NavbarProps {
  isKeySet: boolean;
  onOpenApiModal: () => void;
  onToggleHistory: () => void;
}

const Navbar = ({ isKeySet, onOpenApiModal, onToggleHistory }: NavbarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false);
  
  const navItems = [
    { path: '/upload', icon: FileText, label: '上传内容' },
    { path: '/summary', icon: BookOpen, label: '摘要报告' },
    { path: '/quiz', icon: HelpCircle, label: '互动测验' },
    { path: '/revision', icon: BookOpenCheck, label: '复盘中心' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSettingsClick = () => {
    setIsCustomPromptOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass backdrop-blur-md border-t-0 border-x-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <BookOpen className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-semibold text-white">Course AI Scribe</span>
              </motion.div>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  className={({ isActive }) => 
                    `navigation-item flex items-center space-x-1 ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onToggleHistory}
                className="text-gray-300 hover:text-primary hover:bg-white/10"
              >
                <History className="h-5 w-5" />
              </Button>
              
              {!isKeySet && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onOpenApiModal}
                  className="hover-glow text-white border-primary/50 hover:border-primary"
                >
                  设置 API Key
                </Button>
              )}

              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSettingsClick}
                className="text-gray-300 hover:text-primary hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="md:hidden text-gray-300 hover:text-primary hover:bg-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden glass border-t-0 py-2"
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'text-primary bg-white/10' 
                      : 'text-gray-300 hover:text-primary hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}

      <CustomPromptSettings 
        open={isCustomPromptOpen} 
        onOpenChange={(open) => setIsCustomPromptOpen(open)} 
      />
    </header>
  );
};

export default Navbar;
