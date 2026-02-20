import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

type Page = 'home' | 'register' | 'admin-login' | 'admin';

function AppContent() {
  const { isAdminLoggedIn, theme } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();

  // Handle navigation
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedEventId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle register navigation with event pre-selection
  const handleNavigateToRegister = (eventId?: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Redirect to login if not authenticated for admin pages
  useEffect(() => {
    if (currentPage === 'admin' && !isAdminLoggedIn) {
      setCurrentPage('admin-login');
    }
  }, [currentPage, isAdminLoggedIn]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-900 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Navigation */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Page content */}
      <main className="transition-all duration-300">
        {currentPage === 'home' && (
          <Home onNavigateToRegister={handleNavigateToRegister} />
        )}

        {currentPage === 'register' && (
          <Register
            preselectedEventId={selectedEventId}
            onSuccess={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'admin-login' && (
          <AdminLogin onSuccess={() => handleNavigate('admin')} />
        )}

        {currentPage === 'admin' && isAdminLoggedIn && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
