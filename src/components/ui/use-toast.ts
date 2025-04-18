
import { toast as sonnerToast } from "sonner";

// Re-export sonner's toast functions
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
