import { useState, FormEvent, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { cn } from '../utils/cn';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { adminLogin, addToast, isAdminLoggedIn, theme } = useApp();
  const isDark = theme === 'dark';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      onSuccess();
    }
  }, [isAdminLoggedIn, onSuccess]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      addToast('error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = adminLogin(username, password);
    setIsLoading(false);

    if (success) {
      addToast('success', '👋 Welcome back, Admin!');
      onSuccess();
    } else {
      addToast('error', 'Invalid credentials. Please try again.');
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pt-16 flex items-center justify-center p-4 transition-colors duration-300',
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    )}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float',
          isDark ? 'bg-violet-500/15' : 'bg-violet-400/10'
        )} />
        <div className={cn(
          'absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float',
          isDark ? 'bg-indigo-500/15' : 'bg-indigo-400/10'
        )} style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className={cn(
          'rounded-2xl border overflow-hidden transition-all duration-300',
          isDark
            ? 'bg-slate-800/80 border-slate-700/50 shadow-2xl shadow-black/30'
            : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'
        )}>
          {/* Top gradient */}
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={cn(
                'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
                'bg-gradient-to-br from-violet-600 to-indigo-600',
                'shadow-xl shadow-violet-500/25 animate-float'
              )}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className={cn(
                'text-2xl font-bold mb-1 transition-colors',
                isDark ? 'text-white' : 'text-slate-900'
              )}>
                Admin Login
              </h1>
              <p className={cn(
                'transition-colors',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}>
                Sign in to access the dashboard
              </p>
            </div>

            {/* Demo Credentials Notice 
            <div className={cn(
              'mb-6 p-4 rounded-xl border transition-colors',
              isDark
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-amber-50 border-amber-200'
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  'p-1.5 rounded-lg',
                  isDark ? 'bg-amber-500/10' : 'bg-amber-100'
                )}>
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className={cn(
                    'font-semibold transition-colors',
                    isDark ? 'text-amber-400' : 'text-amber-800'
                  )}>
                    Demo Credentials
                  </p>
                  <p className={cn(
                    'mt-0.5 transition-colors',
                    isDark ? 'text-amber-400/70' : 'text-amber-600'
                  )}>
                    Username: <code className={cn(
                      'px-1.5 py-0.5 rounded',
                      isDark ? 'bg-amber-500/10' : 'bg-amber-100'
                    )}>admin</code>
                  </p>
                  <p className={cn(
                    'transition-colors',
                    isDark ? 'text-amber-400/70' : 'text-amber-600'
                  )}>
                    Password: <code className={cn(
                      'px-1.5 py-0.5 rounded',
                      isDark ? 'bg-amber-500/10' : 'bg-amber-100'
                    )}>admin123</code>
                  </p>
                </div>
              </div>
            </div> */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'absolute right-3 top-9 transition-colors',
                    isDark 
                      ? 'text-slate-500 hover:text-slate-300' 
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Security notice */}
            <div className="mt-6 text-center">
              <p className={cn(
                'text-xs flex items-center justify-center gap-1.5 transition-colors',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure session management enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
