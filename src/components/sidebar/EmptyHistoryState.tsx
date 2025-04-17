
import { Clock } from "lucide-react";

const EmptyHistoryState = () => {
  return (
    <div className="text-center py-4 text-muted-foreground">
      <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
      <p className="text-sm">暂无历史记录</p>
    </div>
  );
};

export default EmptyHistoryState;
