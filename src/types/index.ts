
export interface Summary {
  content: string;
  style: SummaryStyle;
}

export type SummaryStyle = 'casual' | 'academic';

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
