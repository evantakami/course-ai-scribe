


export interface Summary {
  content: string;
  style: SummaryStyle;
  language: SummaryLanguage;
}

export type SummaryStyle = 'casual' | 'academic';
export type SummaryLanguage = 'english' | 'chinese' | 'spanish' | 'french';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: QuestionDifficulty;
  explanation?: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect?: boolean;
}

export interface CourseContent {
  rawContent: string;
  summary?: Summary;
  questions?: Question[];
}

export interface AIModelOption {
  value: string;
  label: string;
}

export const AI_MODELS: AIModelOption[] = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4.5-preview', label: 'GPT-4.5 Preview' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
];


