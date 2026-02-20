import { ReactNode, useEffect } from 'react';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={cn(
          'fixed inset-0 backdrop-blur-sm animate-fade-in transition-colors',
          isDark ? 'bg-black/70' : 'bg-black/50'
        )}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative rounded-2xl shadow-2xl animate-modal-in',
            'border w-full transition-colors duration-300',
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200',
            {
              'max-w-sm': size === 'sm',
              'max-w-md': size === 'md',
              'max-w-lg': size === 'lg',
              'max-w-2xl': size === 'xl',
            }
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-t-2xl" />
          
          {/* Header */}
          <div className={cn(
            'flex items-center justify-between px-6 py-4 border-b transition-colors',
            isDark ? 'border-slate-700' : 'border-slate-100'
          )}>
            <h2 className={cn(
              'text-xl font-semibold transition-colors',
              isDark ? 'text-white' : 'text-slate-900'
            )}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-xl transition-all duration-200 hover:scale-105',
                isDark 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
