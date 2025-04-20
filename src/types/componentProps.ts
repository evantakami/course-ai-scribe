
import { CourseContent, SummaryLanguage, QuestionDifficulty } from './index';

export interface PageProps {
  initialContent?: CourseContent | null;
  activeTab?: string;
  onContentLoaded?: (
    content: string,
    generateQuiz: boolean,
    quizDifficulty: QuestionDifficulty,
    language: SummaryLanguage,
    courseId: string
  ) => void;
  selectedCourseId?: string;
  onSelectCourse?: (courseId: string) => void;
  generateQuiz?: boolean;
  quizDifficulty?: QuestionDifficulty;
  isKeySet?: boolean;
  startLoading?: (message: string) => () => void;
}
