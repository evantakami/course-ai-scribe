
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-edu-600 to-edu-500 text-white py-6 px-4 md:px-6 shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <GraduationCap className="mr-3 h-8 w-8" />
          AI课程笔记助手
        </motion.h1>
        <motion.p 
          className="mt-2 text-edu-100 max-w-2xl opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          上传课程对话内容，通过AI生成全面摘要和个性化测验
        </motion.p>
      </div>
    </motion.header>
  );
};

export default Header;
