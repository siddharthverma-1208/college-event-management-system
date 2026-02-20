import { Event } from '../types';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventCard({ event, onRegister, showActions, onEdit, onDelete }: EventCardProps) {
  const { getRegistrationCount, theme } = useApp();
  const isDark = theme === 'dark';
  const count = getRegistrationCount(event.id);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <div
      className={cn(
        'group relative rounded-2xl border overflow-hidden',
        'transition-all duration-500 transform hover:-translate-y-2',
        'hover:shadow-2xl',
        isDark
          ? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 hover:shadow-violet-500/10'
          : 'bg-white border-slate-100 hover:border-violet-200 hover:shadow-violet-500/10'
      )}
    >
      {/* Animated gradient border on hover */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-2xl -z-10 blur-sm'
      )} />
      
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-80" />
      
      <div className="p-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors',
                  isUpcoming
                    ? isDark 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-emerald-100 text-emerald-700'
                    : isDark
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-slate-100 text-slate-600'
                )}
              >
                {isUpcoming ? '✨ Upcoming' : 'Past'}
              </span>
              <span className={cn(
                'text-xs transition-colors',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
                {count} registered
              </span>
            </div>
            <h3 className={cn(
              'text-xl font-bold transition-colors group-hover:text-violet-500',
              isDark ? 'text-white' : 'text-slate-900'
            )}>
              {event.eventName}
            </h3>
          </div>
          
          {/* Event icon */}
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-violet-500 to-indigo-600',
            'shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40',
            'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3'
          )}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className={cn(
            'flex items-center gap-3 transition-colors',
            isDark ? 'text-slate-400' : 'text-slate-600'
          )}>
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              isDark ? 'bg-violet-500/10' : 'bg-violet-50'
            )}>
              <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <div className={cn(
            'flex items-center gap-3 transition-colors',
            isDark ? 'text-slate-400' : 'text-slate-600'
          )}>
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'
            )}>
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm">{event.venue}</span>
          </div>

          {event.description && (
            <p className={cn(
              'text-sm line-clamp-2 mt-2 transition-colors',
              isDark ? 'text-slate-500' : 'text-slate-500'
            )}>
              {event.description}
            </p>
          )}
        </div>

        {/* Capacity bar */}
        {event.maxCapacity && (
          <div className="mb-5">
            <div className={cn(
              'flex justify-between text-xs mb-1.5 transition-colors',
              isDark ? 'text-slate-500' : 'text-slate-500'
            )}>
              <span>Registration</span>
              <span className="font-medium">{count} / {event.maxCapacity}</span>
            </div>
            <div className={cn(
              'h-2 rounded-full overflow-hidden transition-colors',
              isDark ? 'bg-slate-700' : 'bg-slate-100'
            )}>
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min((count / event.maxCapacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onRegister && isUpcoming && (
            <button
              onClick={onRegister}
              className={cn(
                'flex-1 px-4 py-2.5 font-semibold rounded-xl',
                'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
                'shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
                'transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              Register Now →
            </button>
          )}
          
          {showActions && (
            <>
              <button
                onClick={onEdit}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200 hover:scale-105',
                  isDark
                    ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-200 hover:scale-105',
                  isDark
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
