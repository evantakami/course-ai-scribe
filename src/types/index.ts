export interface CourseContent {
  rawContent: string | null;
  summary: Summary | null;
  summaries?: Summary[];
  questions: {
    easy: Question[];
    medium: Question[];
    hard: Question[];
  } | null;
  terms?: Term[];
}

export interface Summary {
  content: string;
  style: SummaryStyle;
  language: SummaryLanguage;
}

export type SummaryStyle = "casual" | "academic" | "basic";
export type SummaryLanguage = "chinese" | "english" | "spanish" | "french";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Term {
  term: string;
  definition: string;
  category: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: QuestionDifficulty;
  explanation?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
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
