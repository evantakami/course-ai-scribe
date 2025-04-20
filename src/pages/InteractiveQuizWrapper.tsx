
import { FC } from 'react';
import InteractiveQuiz from './InteractiveQuiz';
import { PageProps } from '../types/componentProps';

const InteractiveQuizWrapper: FC<PageProps> = ({ initialContent, activeTab }) => {
  return <InteractiveQuiz />;
};

export default InteractiveQuizWrapper;
