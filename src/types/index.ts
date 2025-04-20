
export interface UserAnswer {
  questionId: number;
  selectedOptionIndex: number; // Changed from selectedAnswer to match actual usage
  isCorrect: boolean;
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  timestamp?: Date | string;
  courseId?: string;
}
