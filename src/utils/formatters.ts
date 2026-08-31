import { ProjectStatus, TaskPriority, TaskStatus, MilestoneStatus } from '../types';

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isOverdue(dueDateString?: string): boolean {
  if (!dueDateString) return false;
  try {
    const due = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  } catch {
    return false;
  }
}

export function isDueToday(dueDateString?: string): boolean {
  if (!dueDateString) return false;
  try {
    const due = new Date(dueDateString);
    const today = new Date();
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  } catch {
    return false;
  }
}

export function getDaysRemaining(dueDateString?: string): number | null {
  if (!dueDateString) return null;
  try {
    const due = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; bgLight: string; textLight: string; bgDark: string; textDark: string; dot: string }
> = {
  planning: {
    label: 'Planning',
    bgLight: 'bg-slate-100',
    textLight: 'text-slate-700',
    bgDark: 'dark:bg-slate-800/60',
    textDark: 'dark:text-slate-300',
    dot: 'bg-slate-500',
  },
  on_track: {
    label: 'On Track',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    textLight: 'text-emerald-700',
    bgDark: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
    textDark: 'dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  at_risk: {
    label: 'At Risk',
    bgLight: 'bg-amber-50 text-amber-800 border-amber-200/60',
    textLight: 'text-amber-800',
    bgDark: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
    textDark: 'dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  on_hold: {
    label: 'On Hold',
    bgLight: 'bg-slate-100 text-slate-700 border-slate-200',
    textLight: 'text-slate-700',
    bgDark: 'dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
    textDark: 'dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  completed: {
    label: 'Completed',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200/60',
    textLight: 'text-blue-700',
    bgDark: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40',
    textDark: 'dark:text-blue-300',
    dot: 'bg-blue-500',
  },
};

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; columnTitle: string; color: string }
> = {
  backlog: { label: 'Backlog', columnTitle: 'BACKLOG', color: 'slate' },
  todo: { label: 'To Do', columnTitle: 'TO DO', color: 'indigo' },
  in_progress: { label: 'In Progress', columnTitle: 'IN PROGRESS', color: 'amber' },
  in_review: { label: 'In Review', columnTitle: 'IN REVIEW', color: 'purple' },
  done: { label: 'Done', columnTitle: 'DONE', color: 'emerald' },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; badgeClass: string; iconColor: string }
> = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    iconColor: 'text-slate-400',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30',
    iconColor: 'text-blue-500',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
    iconColor: 'text-amber-500',
  },
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 font-semibold',
    iconColor: 'text-rose-500',
  },
};

export const MILESTONE_STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; badgeClass: string }
> = {
  not_started: {
    label: 'Not Started',
    badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/50',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50',
  },
  blocked: {
    label: 'Blocked',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/50',
  },
};
