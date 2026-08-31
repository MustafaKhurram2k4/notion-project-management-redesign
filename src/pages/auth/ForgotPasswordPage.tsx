import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, setAuthView } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await forgotPassword(email);
    setIsLoading(false);
    if (res.success) {
      setSuccessMessage(res.message);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Back button */}
      <div className="text-left">
        <button
          type="button"
          onClick={() => setAuthView('login')}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>

      {/* Header Titles */}
      <div className="text-left space-y-1.5">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          Security // Access Recovery
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
          Reset Passcode
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Enter your registered work email address and we'll dispatch an instant reset token to your inbox.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200 text-left space-y-1">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <p className="font-semibold">Reset Instructions Dispatched</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      {!successMessage ? (
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.15em] font-bold hover:bg-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Dispatching Reset Link...</span>
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAuthView('login')}
          className="w-full h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.15em] font-bold hover:bg-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <span>Return to Sign In</span>
        </button>
      )}
    </div>
  );
};
