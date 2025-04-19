
export interface CourseContent {
  rawContent: string | null;
  summary: Summary | null;
  questions: {
    easy?: Question[];
    medium?: Question[];
    hard?: Question[];
  } | null;
}

export interface Summary {
  content: string;
  style: SummaryStyle;
  language: SummaryLanguage;
  allStyles?: {
    [key in SummaryStyle]?: string;
  };
}

export type SummaryStyle = "academic" | "casual" | "basic";
export type SummaryLanguage = "english" | "chinese" | "spanish" | "french";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: QuestionDifficulty;
  explanation?: string;
}

export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  // 额外字段用于错题收集
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  timestamp?: Date | string;
  courseId?: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  timestamp: Date | string;
}

export interface HistoryItem {
  id: string;
  rawContent: string;
  timestamp: Date | string;
  title?: string;
  courseId: string;
  // 存储生成内容的新字段
  summaries?: StyleSummaries;
  questions?: {
    easy?: Question[];
    medium?: Question[];
    hard?: Question[];
  } | null;
  userAnswers?: UserAnswer[] | null;
  language?: SummaryLanguage;
}

export type CustomPromptType = 'summary' | 'questions' | 'explanation';

export interface CustomPrompt {
  type: CustomPromptType;
  content: string;
  style?: SummaryStyle;
}

export interface AIModelOption {
  value: string;
  label: string;
}

export const AI_MODELS: AIModelOption[] = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" }
];

export interface StyleSummaries {
  [style: string]: string;
}

export interface UserStats {
  totalQuizzes: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface UserProfile {
  username?: string;
  courses: Course[];
  quizStats: UserStats;
}
