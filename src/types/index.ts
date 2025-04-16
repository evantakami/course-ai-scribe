

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
  { value: 'gpt4.1', label: 'GPT-4.1' },
  { value: 'gpt4.1-nano', label: 'GPT-4.1 Nano' },
  { value: 'gpt4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'o4-mini', label: 'O4 Mini' }
];

