
import React from 'react';
import { SummaryLanguage } from '@/types';

interface ContentProcessorProps {
  language: SummaryLanguage;
}

const ContentProcessor = ({ language }: ContentProcessorProps) => {
  return (
    <div>
      <p>处理语言: {language === 'chinese' ? '中文' : 
                   language === 'english' ? '英文' : 
                   language === 'spanish' ? '西班牙语' : '法语'}</p>
    </div>
  );
};

export default ContentProcessor;
