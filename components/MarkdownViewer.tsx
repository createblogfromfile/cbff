import React from 'react';
import { ParsedMarkdown } from '../types';
import { Theme } from '../types';

interface MarkdownViewerProps {
  file: ParsedMarkdown;
  theme: Theme;
  onBack: () => void;
}

// A very simple component to render markdown-like content to HTML
const SimpleRenderer: React.FC<{ content: string, theme: Theme }> = ({ content, theme }) => {
    const lines = content.split('\n');
    
    return (
        <div className="prose prose-invert max-w-none">
            {lines.map((line, index) => {
                if (line.startsWith('# ')) {
                    return <h1 key={index} className={`text-4xl font-bold mt-6 mb-4 text-${theme.colors.textPrimary}`}>{line.substring(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className={`text-3xl font-bold mt-5 mb-3 text-${theme.colors.textPrimary}`}>{line.substring(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={index} className={`text-2xl font-bold mt-4 mb-2 text-${theme.colors.textPrimary}`}>{line.substring(4)}</h3>;
                }
                if (line.trim() === '') {
                    // This creates a paragraph break
                    return null;
                }
                return <p key={index} className={`mb-4 leading-relaxed text-${theme.colors.textSecondary}`}>{line}</p>;
            })}
        </div>
    );
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ file, theme, onBack }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className={`
          bg-${theme.colors.primary}
          text-white
          font-bold
          py-2 px-4 rounded-lg
          mb-8
          transition-colors duration-300
          hover:bg-${theme.colors.hover}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${theme.colors.background} focus:ring-${theme.colors.primary}
          flex items-center space-x-2
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>Back to Articles</span>
      </button>
      
      <article className={`p-8 rounded-lg bg-${theme.colors.surface} border border-${theme.colors.border}`}>
        <SimpleRenderer content={file.content} theme={theme} />
      </article>
    </div>
  );
};

// Add a simple fade-in animation to tailwind config
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default MarkdownViewer;
