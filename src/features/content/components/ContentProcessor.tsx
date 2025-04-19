
import React from 'react';
import { SummaryLanguage } from '@/types';

interface ContentProcessorProps {
  language: SummaryLanguage;
}

const ContentProcessor = ({ language }: ContentProcessorProps) => {
  return (
    <div>
      <p>处理语言: 中文</p>
    </div>
  );
};

export default ContentProcessor;
