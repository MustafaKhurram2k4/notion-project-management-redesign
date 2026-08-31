import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { LoginPage } from './LoginPage';
import { SignUpPage } from './SignUpPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { Compass, Sun, Moon, Laptop } from 'lucide-react';

export const AuthContainer: React.FC = () => {
  const { authView } = useAuth();
  const { theme, setTheme } = useWorkspace();

  return (
    <div className="min-h-screen bg-[#F6F6F4] dark:bg-[#0A0A0A] text-[#141416] dark:text-[#E2E2E2] flex flex-col justify-between antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans relative overflow-hidden">
      {/* Subtle Architectural Background Grid Columns */}
      <div className="fixed inset-0 grid grid-cols-12 pointer-events-none opacity-[0.03] dark:opacity-[0.04] z-0 max-w-full">
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="h-full" />
      </div>

      {/* Top Bar with Logo & Theme Switcher */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-serif font-bold text-neutral-900 dark:text-white tracking-[0.2em] uppercase">
                WAYPOINT
              </span>
              <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/10">
                EDITION
              </span>
            </div>
            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              Initiative & Delivery Studio
            </p>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="flex items-center p-1 bg-neutral-200/70 dark:bg-white/5 rounded-lg border border-neutral-300/40 dark:border-white/10">
          <button
            type="button"
            onClick={() => setTheme('light')}
            title="Light mode"
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            title="Dark mode"
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            title="Follow system"
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              theme === 'system'
                ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
        <div className="bg-white/90 dark:bg-[#0D0D0F]/90 backdrop-blur-md rounded-2xl border border-neutral-300/80 dark:border-white/10 shadow-xl p-6 sm:p-8">
          {authView === 'login' && <LoginPage />}
          {authView === 'signup' && <SignUpPage />}
          {authView === 'forgot-password' && <ForgotPasswordPage />}
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
          <span>WAYPOINT WORKSPACE ENGINE // 2026</span>
          <span>PERSISTENCE: LOCAL STORAGE ACTIVE</span>
        </div>
      </footer>
    </div>
  );
};
