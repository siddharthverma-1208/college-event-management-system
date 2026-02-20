import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loading({ size = 'md', fullScreen = false }: LoadingProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {/* Animated spinner with gradient */}
      <div className="relative">
        <div
          className={cn(
            'rounded-full animate-spin',
            sizeClasses[size],
            isDark 
              ? 'border-slate-700 border-t-violet-400' 
              : 'border-violet-200 border-t-violet-600'
          )}
        />
        {/* Glow effect */}
        <div className={cn(
          'absolute inset-0 rounded-full blur-md opacity-50',
          'bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse'
        )} style={{ transform: 'scale(0.8)' }} />
      </div>
      
      {size !== 'sm' && (
        <div className="flex flex-col items-center gap-1">
          <p className={cn(
            'text-sm font-medium animate-pulse transition-colors',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
            Loading...
          </p>
          {/* Loading dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-1.5 h-1.5 rounded-full animate-bounce',
                  isDark ? 'bg-violet-400' : 'bg-violet-500'
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={cn(
        'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-colors',
        isDark ? 'bg-slate-900/90' : 'bg-white/80'
      )}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
