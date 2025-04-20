
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  message: string;
}

const ProgressBar = ({ progress, message }: ProgressBarProps) => {
  return (
    <motion.div 
      initial={{ y: 48 }}
      animate={{ y: 0 }}
      exit={{ y: 48 }}
      transition={{ duration: 0.3 }}
      className="glass h-12 px-4 flex items-center"
    >
      <div className="flex-1 mr-4">
        <div className="h-2 bg-gray-200/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center whitespace-nowrap">
        <span className="text-sm mr-2">{message}</span>
        <span className="text-sm font-medium text-primary">{progress}%</span>
      </div>
    </motion.div>
  );
};

export default ProgressBar;
