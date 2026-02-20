import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

type Page = 'home' | 'register' | 'admin-login' | 'admin';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { isAdminLoggedIn, adminLogout, theme, toggleTheme } = useApp();

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
      'border-b backdrop-blur-xl',
      theme === 'dark' 
        ? 'bg-slate-900/80 border-slate-700/50' 
        : 'bg-white/80 border-slate-200/50'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300',
              'bg-gradient-to-br from-violet-600 to-indigo-600',
              'group-hover:shadow-violet-500/40 group-hover:scale-105'
            )}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                'text-lg font-bold transition-colors',
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              )}>
                EventHub
              </h1>
              <p className={cn(
                'text-xs -mt-0.5 transition-colors',
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              )}>
                College Events
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <NavLink
              active={currentPage === 'home'}
              onClick={() => onNavigate('home')}
              theme={theme}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Events</span>
            </NavLink>

            <NavLink
              active={currentPage === 'register'}
              onClick={() => onNavigate('register')}
              theme={theme}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="hidden sm:inline">Register</span>
            </NavLink>

            {isAdminLoggedIn ? (
              <>
                <NavLink
                  active={currentPage === 'admin'}
                  onClick={() => onNavigate('admin')}
                  theme={theme}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
                <button
                  onClick={adminLogout}
                  className={cn(
                    'ml-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                    theme === 'dark'
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  )}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                active={currentPage === 'admin-login'}
                onClick={() => onNavigate('admin-login')}
                theme={theme}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Admin</span>
              </NavLink>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'ml-2 p-2.5 rounded-xl transition-all duration-300 relative overflow-hidden',
                'hover:scale-105 active:scale-95',
                theme === 'dark'
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  children,
  active,
  onClick,
  theme
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  theme: 'light' | 'dark';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
        active
          ? theme === 'dark'
            ? 'bg-violet-500/20 text-violet-300'
            : 'bg-violet-100 text-violet-700'
          : theme === 'dark'
            ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      )}
    >
      {children}
    </button>
  );
}
