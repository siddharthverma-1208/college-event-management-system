import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    const { theme } = useApp();
    const isDark = theme === 'dark';

    return (
      <div className="space-y-1.5">
        {label && (
          <label className={cn(
            'block text-sm font-medium transition-colors',
            isDark ? 'text-slate-300' : 'text-slate-700'
          )}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border appearance-none transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              isDark
                ? cn(
                    'bg-slate-800 text-white',
                    error
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-600 focus:border-violet-500 focus:ring-violet-500/20'
                  )
                : cn(
                    'bg-white text-slate-900',
                    error
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20'
                  ),
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className={cn(
              'w-5 h-5 transition-colors',
              isDark ? 'text-slate-500' : 'text-slate-400'
            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
