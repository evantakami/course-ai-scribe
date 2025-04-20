
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown = ({ content, className }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={cn(
        'prose prose-invert max-w-none',
        'prose-headings:text-white prose-headings:font-semibold',
        'prose-h1:text-2xl prose-h1:mt-4 prose-h1:mb-4',
        'prose-h2:text-xl prose-h2:mt-4 prose-h2:mb-3',
        'prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2',
        'prose-p:text-gray-300 prose-p:my-2',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-primary prose-strong:font-semibold',
        'prose-ul:my-2 prose-li:my-1 prose-li:text-gray-300',
        'prose-ol:my-2 prose-ol:text-gray-300',
        'prose-pre:bg-dark/30 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg',
        'prose-code:text-primary prose-code:bg-dark/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        className
      )}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
