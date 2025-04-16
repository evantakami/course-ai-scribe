
import { GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-edu-700 text-white py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <GraduationCap className="mr-2 h-8 w-8" />
          AI课程笔记助手
        </h1>
        <p className="mt-2 text-edu-100 max-w-2xl">
          上传课程对话内容，通过AI生成全面摘要和个性化测验
        </p>
      </div>
    </header>
  );
};

export default Header;
