import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import {
  Settings,
  Moon,
  Sun,
  Laptop,
  RotateCcw,
  Download,
  Shield,
  Bell,
  Check,
  Compass,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    currentUser,
    users,
    setCurrentUserId,
    projects,
    tasks,
    resetToDemoData,
    setIsProfileEditOpen,
    showToast,
  } = useWorkspace();

  const { logout } = useAuth();
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSlack, setNotificationsSlack] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: currentUser,
      projects,
      tasks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waypoint-workspace-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Export completed', 'Workspace data saved to your downloads.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all projects, tasks, and data back to the clean demo dataset?')) {
      resetToDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      showToast('info', 'Workspace reset', 'Loaded initial project and task dataset.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            System Configuration
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Workspace Settings
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-light">
          Configure personal preferences, active persona, visual theme, and data persistence.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-[#141416] rounded-xl border border-neutral-300/80 dark:border-white/10 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar user={currentUser} size="lg" showStatus />
            <div>
              <h4 className="text-base font-serif font-bold text-neutral-900 dark:text-neutral-100">
                {currentUser.name}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10">
                  {currentUser.role}
                </span>
                <span className="text-[11px] text-neutral-400 font-light">· {currentUser.department}</span>
                <span className="text-[11px] font-mono text-neutral-400">({currentUser.assignedHours}/{currentUser.capacityHours}h capacity)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              onClick={() => setIsProfileEditOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
              onClick={logout}
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Persona Switcher Chips */}
        <div className="border-t border-neutral-200 dark:border-white/10 pt-4">
          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-2">
            Switch Persona Context
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {users.map(u => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setCurrentUserId(u.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white shadow-xs'
                      : 'bg-neutral-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-white/20'
                  }`}
                >
                  <Avatar user={u} size="xs" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate leading-tight">{u.name}</p>
                    <p className={`text-[9px] font-mono uppercase truncate ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                      {u.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Appearance */}
      <div className="bg-white dark:bg-[#141416] rounded-xl border border-neutral-300/80 dark:border-white/10 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-serif font-bold text-neutral-900 dark:text-neutral-100">
            Interface Theme & Appearance
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
            Switch between Light, Dark, or automatic OS System Match. Persisted to local state.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Dark Mode</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">System Match</span>
          </button>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white dark:bg-[#141416] rounded-xl border border-neutral-300/80 dark:border-white/10 p-6 space-y-4">
        <h3 className="text-sm font-serif font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-neutral-500" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 cursor-pointer">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Deadline & Dependency Blocker Alerts
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] font-light">
                Receive notifications when assigned tasks are approaching deadlines or blocked by upstream deliverables.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEmail}
              onChange={e => setNotificationsEmail(e.target.checked)}
              className="w-4 h-4 accent-neutral-900 dark:accent-white rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 cursor-pointer">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Milestone Progress & Delivery Gates
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] font-light">
                Receive digests and toast notifications when project milestones reach 100% completion.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsSlack}
              onChange={e => setNotificationsSlack(e.target.checked)}
              className="w-4 h-4 accent-neutral-900 dark:accent-white rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Data Management & Demo Dataset */}
      <div className="bg-white dark:bg-[#141416] rounded-xl border border-neutral-300/80 dark:border-white/10 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-serif font-bold text-neutral-900 dark:text-neutral-100">
            Data Persistence & Backup
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
            Export full workspace records as formatted JSON or reset the database back to clean demo data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportData}
          >
            Export JSON Backup
          </Button>

          <Button
            size="sm"
            variant="danger"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleReset}
          >
            Reset to Demo Dataset
          </Button>
        </div>

        {resetSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Workspace successfully restored to clean initial demo state.</span>
          </div>
        )}
      </div>
    </div>
  );
};
