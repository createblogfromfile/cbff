import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
}

const Header: React.FC<HeaderProps> = ({ theme }) => {
  const primaryColorClass = `text-${theme.colors.primary}`;

  return (
    <header className={`py-6 px-8 border-b border-${theme.colors.border}`}>
      <div className="flex items-center space-x-4">
        <div
          className={`
            w-12 h-12 p-2 rounded-lg 
            flex-shrink-0
            bg-${theme.colors.background} 
            border border-${theme.colors.border}
          `}
        >
          <svg
            className={primaryColorClass}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 7H16" />
            <path d="M8 12H16" />
            <path d="M8 17H12" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My <span className={primaryColorClass}>Blog</span>
          </h1>
          <p className={`mt-1 text-sm text-${theme.colors.textSecondary}`}>
            Created by Dhruv Gowda
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
