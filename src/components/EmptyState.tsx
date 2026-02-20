import { ReactNode } from 'react';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
      <div className={cn(
        'w-20 h-20 rounded-2xl flex items-center justify-center mb-6',
        'bg-gradient-to-br shadow-lg transition-all duration-300',
        isDark 
          ? 'from-violet-500/20 to-indigo-500/20 shadow-violet-500/10' 
          : 'from-violet-100 to-indigo-100 shadow-violet-500/10'
      )}>
        {icon || (
          <svg className={cn(
            'w-10 h-10 transition-colors',
            isDark ? 'text-violet-400' : 'text-violet-500'
          )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      
      <h3 className={cn(
        'text-xl font-bold mb-2 transition-colors',
        isDark ? 'text-white' : 'text-slate-900'
      )}>
        {title}
      </h3>
      <p className={cn(
        'max-w-sm mb-6 transition-colors',
        isDark ? 'text-slate-400' : 'text-slate-500'
      )}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
