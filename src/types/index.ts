
export interface CourseContent {
  rawContent: string | null;
  summary: Summary | null;
  questions: Question[] | null;
}

export interface Summary {
  content: string;
  style: SummaryStyle;
  language: SummaryLanguage;
}

export type SummaryStyle = "casual" | "academic";
export type SummaryLanguage = "english" | "chinese";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: QuestionDifficulty;
}

export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface HistoryItem {
  id: string;
  rawContent: string;
  timestamp: Date | string;
  title?: string;
}

export type CustomPromptType = 'summary' | 'questions' | 'explanation';

export interface CustomPrompt {
  type: CustomPromptType;
  content: string;
}

export interface AIModelOption {
  value: string;
  label: string;
}

export const AI_MODELS: AIModelOption[] = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" }
];
