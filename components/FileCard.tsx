import React from 'react';
import { ParsedMarkdown } from '../types';
import { Theme } from '../types';

interface FileCardProps {
  file: ParsedMarkdown;
  theme: Theme;
  onClick: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, theme, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-${theme.colors.surface}
        border border-${theme.colors.border}
        rounded-lg p-6
        cursor-pointer
        transition-all duration-300
        hover:border-${theme.colors.primary}
        hover:shadow-lg
        hover:shadow-${theme.colors.primary}/20
        hover:-translate-y-1
      `}
    >
      <h2 className={`text-xl font-bold text-${theme.colors.textPrimary}`}>{file.title}</h2>
      {file.date && (
        <p className={`mt-1 text-xs text-${theme.colors.textSecondary}`}>
          {file.date}
        </p>
      )}
      <p className={`mt-2 text-${theme.colors.textSecondary} text-sm line-clamp-3`}>
        {file.description || 'No description provided.'}
      </p>
    </div>
  );
};

export default FileCard;
