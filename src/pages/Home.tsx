import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';
import { Loading } from '../components/Loading';
import { cn } from '../utils/cn';

interface HomeProps {
  onNavigateToRegister: (eventId?: string) => void;
}

export function Home({ onNavigateToRegister }: HomeProps) {
  const { events, theme } = useApp();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter(event => {
    const isUpcoming = new Date(event.date) >= new Date();
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'past') return !isUpcoming;
    return true;
  });

  const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pt-16 transition-colors duration-300',
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    )}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className={cn(
          'absolute inset-0 mesh-gradient transition-opacity duration-500',
          isDark ? 'opacity-100' : 'opacity-100'
        )} />
        
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            'absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float',
            isDark ? 'bg-violet-500/20' : 'bg-violet-400/20'
          )} />
          <div className={cn(
            'absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float',
            isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/20'
          )} style={{ animationDelay: '1s' }} />
          <div className={cn(
            'absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl animate-float',
            isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/10'
          )} style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <span className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6',
              'border backdrop-blur-sm transition-all duration-300',
              isDark 
                ? 'bg-violet-500/10 text-violet-300 border-violet-500/30' 
                : 'bg-violet-100 text-violet-700 border-violet-200'
            )}>
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              {upcomingCount} Upcoming Events
            </span>
            
            {/* Main heading */}
            <h1 className={cn(
              'text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight',
              isDark ? 'text-white' : 'text-slate-900'
            )}>
              Discover & Register for
              <span className="block mt-2 gradient-text-animated">
                College Events
              </span>
            </h1>
            
            <p className={cn(
              'text-lg max-w-2xl mx-auto mb-10 leading-relaxed transition-colors',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}>
              Join exciting events, competitions, and workshops. Connect with peers and showcase your talents at our upcoming college events.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigateToRegister()}
                className={cn(
                  'px-8 py-3.5 font-semibold rounded-xl text-white',
                  'bg-gradient-to-r from-violet-600 to-indigo-600',
                  'shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
                  'transition-all duration-300 transform hover:scale-105 active:scale-95',
                  'hover:from-violet-500 hover:to-indigo-500'
                )}
              >
                Register Now →
              </button>
              <a
                href="#events"
                className={cn(
                  'px-8 py-3.5 font-semibold rounded-xl border transition-all duration-300',
                  isDark
                    ? 'bg-slate-800/50 text-white border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                )}
              >
                View Events
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: events.length, icon: '🎯', gradient: 'from-violet-500 to-purple-500' },
            { label: 'Upcoming', value: upcomingCount, icon: '📅', gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Categories', value: '5+', icon: '🏷️', gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Registrations', value: '500+', icon: '👥', gradient: 'from-orange-500 to-amber-500' },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                'relative rounded-2xl p-5 text-center transition-all duration-300',
                'border backdrop-blur-sm hover:scale-105 cursor-default',
                'animate-fade-in-up group',
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50'
                  : 'bg-white border-slate-100 hover:border-violet-200 shadow-sm hover:shadow-lg'
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={cn(
                'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                `bg-gradient-to-br ${stat.gradient} blur-xl -z-10`
              )} style={{ transform: 'scale(0.8)', opacity: 0.1 }} />
              
              <span className="text-2xl">{stat.icon}</span>
              <p className={cn(
                'text-3xl font-bold mt-2 transition-colors',
                isDark ? 'text-white' : 'text-slate-900'
              )}>
                {stat.value}
              </p>
              <p className={cn(
                'text-sm transition-colors',
                isDark ? 'text-slate-500' : 'text-slate-500'
              )}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className={cn(
              'text-2xl font-bold transition-colors',
              isDark ? 'text-white' : 'text-slate-900'
            )}>
              Browse Events
            </h2>
            <p className={cn(
              'mt-1 transition-colors',
              isDark ? 'text-slate-400' : 'text-slate-500'
            )}>
              Find and register for events that interest you
            </p>
          </div>

          {/* Filter Tabs */}
          <div className={cn(
            'flex p-1 rounded-xl transition-colors',
            isDark ? 'bg-slate-800' : 'bg-slate-100'
          )}>
            {(['all', 'upcoming', 'past'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  filter === f
                    ? isDark
                      ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found"
            description="There are no events matching your filter. Try a different filter or check back later."
            actionLabel="View All Events"
            onAction={() => setFilter('all')}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <EventCard
                  event={event}
                  onRegister={() => onNavigateToRegister(event.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={cn(
        'py-12 border-t transition-colors',
        isDark 
          ? 'bg-slate-800/50 border-slate-800' 
          : 'bg-slate-900 text-slate-400'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">EventHub</span>
          </div>
          <p className={cn(
            'text-sm transition-colors',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
            © 2024 College Event Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
