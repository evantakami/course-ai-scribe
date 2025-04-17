
import { LayoutList, History } from "lucide-react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";

const SidebarHeader = () => {
  return (
    <Header className="pb-3 pt-3">
      <div className="flex items-center px-3">
        <History className="mr-2 h-5 w-5" />
        <span className="font-medium">历史记录</span>
      </div>
    </Header>
  );
};

export default SidebarHeader;
