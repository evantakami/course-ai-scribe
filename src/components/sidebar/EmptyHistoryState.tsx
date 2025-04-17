
import { Clock } from "lucide-react";

const EmptyHistoryState = () => {
  return (
    <div className="text-center py-8 px-4 text-muted-foreground">
      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p className="text-sm font-medium mb-1">暂无历史记录</p>
      <p className="text-xs">保存内容后将显示在这里</p>
    </div>
  );
};

export default EmptyHistoryState;
