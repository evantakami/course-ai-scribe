
import { toast as sonnerToast } from "sonner";

// Re-export sonner's toast functions for backwards compatibility
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
