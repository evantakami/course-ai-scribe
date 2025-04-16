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
