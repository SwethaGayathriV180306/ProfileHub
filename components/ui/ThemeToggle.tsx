import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center flex-shrink-0
        ${theme === 'dark' 
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 shadow-inner' 
          : 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm border border-slate-200'
        } ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
