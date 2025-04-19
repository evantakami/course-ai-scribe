
import React from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { SummaryLanguage } from '@/types';

interface ContentProcessorProps {
  language: SummaryLanguage;
  onLanguageChange: (language: SummaryLanguage) => void;
}

const ContentProcessor = ({ language, onLanguageChange }: ContentProcessorProps) => {
  return (
    <div>
      <LanguageSelector 
        value={language}
        onChange={onLanguageChange}
        disabled={false}
      />
    </div>
  );
};

export default ContentProcessor;
