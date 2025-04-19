
import React from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { SummaryLanguage } from '@/types';

interface FileUploadProps {
  language: SummaryLanguage;
  onLanguageChange: (value: SummaryLanguage) => void;
}

const FileUpload = ({ language, onLanguageChange }: FileUploadProps) => {
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

export default FileUpload;
