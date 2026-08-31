import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, User as UserIcon, Briefcase, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signup, setAuthView } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Initiative Lead');
  const [department, setDepartment] = useState('Product');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    const res = await signup(name, email, role, department, password);
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
          Onboarding // Persona Creation
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
          Create Your Profile
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Join WAYPOINT to collaborate on multi-project milestones, task velocity, and team capacity.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        <div className="space-y-1">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Julian Hayes"
              className="w-full h-9.5 pl-10 pr-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
            />
          </div>
        </div>

        <div className="space-y-1">
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
              placeholder="julian.hayes@waypoint.internal"
              className="w-full h-9.5 pl-10 pr-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Department
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full h-9.5 pl-10 pr-3 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              >
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Role Title
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Product Lead"
                className="w-full h-9.5 pl-10 pr-3 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
            Set Security Passcode
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full h-9.5 pl-10 pr-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300/90 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.15em] font-bold hover:bg-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Creating Profile...</span>
            </span>
          ) : (
            <>
              <span>Initialize Workspace Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="text-center pt-2 border-t border-neutral-300/70 dark:border-white/10">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Already registered on WAYPOINT?{' '}
          <button
            type="button"
            onClick={() => setAuthView('login')}
            className="font-bold text-neutral-900 dark:text-white underline decoration-neutral-400 dark:decoration-neutral-600 cursor-pointer"
          >
            Sign In Instead
          </button>
        </p>
      </div>
    </div>
  );
};
