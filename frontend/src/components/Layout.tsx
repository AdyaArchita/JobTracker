import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Sun, Moon, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 bg-mesh-light dark:bg-mesh-dark">
      {/* ─── Floating Header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
        <nav className="glass max-w-7xl mx-auto rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between pointer-events-auto border-surface-200/50 dark:border-white/5 shadow-lg shadow-black/5">
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-95">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white animate-pulse-soft" />
              </div>
              <span className="text-xl font-bold tracking-tight text-surface-950 dark:text-white">
                <span className="text-gradient pr-0.5">Job</span>
                <span className="text-slate-900 dark:text-white">Tracker</span>
              </span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'text-brand-600 bg-brand-500/10 dark:text-brand-400 dark:bg-brand-500/15'
                      : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200 hover:bg-surface-100/50 dark:hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-surface-500 hover:text-brand-600 hover:bg-brand-500/10 dark:hover:bg-brand-500/15 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 animate-scale-in" />
              ) : (
                <Moon className="w-5 h-5 animate-scale-in" />
              )}
            </button>

            {user && (
              <div className="flex items-center gap-4 pl-3 border-l border-surface-200 dark:border-white/10">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-surface-900 dark:text-surface-100">{user.name}</p>
                  <p className="text-[10px] text-surface-500 truncate max-w-[120px]">{user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-surface-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ─── Main Content ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto py-8">
        {children}
      </main>

      {/* ─── Toast Container Styling ────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .go313551347 { /* react-hot-toast class */
          background: ${theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)'} !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
          color: ${theme === 'dark' ? '#fff' : '#0f172a'} !important;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2) !important;
          border-radius: 16px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }
      `}} />
    </div>
  );
}
