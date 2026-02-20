import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl',
            'animate-slide-in-right min-w-[320px] max-w-[420px]',
            'border backdrop-blur-xl transition-all duration-300',
            'hover:scale-[1.02] cursor-pointer',
            {
              'bg-emerald-500/90 border-emerald-400/50 text-white shadow-emerald-500/25': toast.type === 'success',
              'bg-red-500/90 border-red-400/50 text-white shadow-red-500/25': toast.type === 'error',
              'bg-blue-500/90 border-blue-400/50 text-white shadow-blue-500/25': toast.type === 'info',
              'bg-amber-500/90 border-amber-400/50 text-white shadow-amber-500/25': toast.type === 'warning',
            }
          )}
          onClick={() => removeToast(toast.id)}
        >
          {/* Icon */}
          <div className="flex-shrink-0 p-1 rounded-full bg-white/20">
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          
          {/* Message */}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            className="flex-shrink-0 p-1.5 rounded-xl hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
