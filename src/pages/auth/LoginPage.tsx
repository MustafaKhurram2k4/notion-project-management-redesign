import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Compass, ArrowRight, Lock, Mail, CheckCircle2, AlertCircle, Sun, Moon, Laptop, ShieldCheck } from 'lucide-react';
import { Avatar } from '../../components/common/Avatar';

export const LoginPage: React.FC = () => {
  const { login, loginAsUser, setAuthView } = useAuth();
  const { users, theme, setTheme } = useWorkspace();

  const [email, setEmail] = useState('alexandra.vance@waypoint.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setIsLoading(false);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Form Titles */}
      <div className="text-left space-y-1.5">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          Studio Access // Protocol
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
          Sign In to WAYPOINT
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Enter your credentials to access active project initiatives, Gantt roadmaps, and delivery streams.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
            Work Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@waypoint.internal"
              className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Passcode
            </label>
            <button
              type="button"
              onClick={() => setAuthView('forgot-password')}
              className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 underline decoration-neutral-300 dark:decoration-neutral-700 cursor-pointer"
            >
              Forgot code?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.15em] font-bold hover:bg-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </span>
          ) : (
            <>
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Persona Switcher */}
      <div className="pt-4 border-t border-neutral-300/70 dark:border-white/10 text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Instant Demo Logins
          </span>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            1-Click Available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {users.slice(0, 3).map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => loginAsUser(u.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-[#141416] border border-neutral-300/80 dark:border-white/10 hover:border-black dark:hover:border-white transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar user={u} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:underline">
                      {u.name}
                    </p>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 uppercase">
                      {u.department}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                    {u.role}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white shrink-0 pl-2">
                Enter →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Switch to Sign Up */}
      <div className="text-center pt-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Need a workspace profile?{' '}
          <button
            type="button"
            onClick={() => setAuthView('signup')}
            className="font-bold text-neutral-900 dark:text-white underline decoration-neutral-400 dark:decoration-neutral-600 cursor-pointer"
          >
            Create New Account
          </button>
        </p>
      </div>
    </div>
  );
};
