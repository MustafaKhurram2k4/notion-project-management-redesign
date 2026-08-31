import React from 'react';
import { ProjectStatus, TaskPriority, TaskStatus, MilestoneStatus } from '../../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, TASK_STATUS_CONFIG, MILESTONE_STATUS_CONFIG } from '../../utils/formatters';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 font-mono uppercase tracking-[0.15em] rounded-md gap-1.5',
    md: 'text-[10px] px-2.5 py-0.5 font-mono uppercase tracking-[0.15em] rounded-md gap-1.5',
  };

  const variantStyles = {
    neutral: 'bg-neutral-100 text-neutral-800 dark:bg-white/5 dark:text-neutral-300 border border-neutral-300/80 dark:border-white/10',
    default: 'bg-neutral-100 text-neutral-800 dark:bg-white/5 dark:text-neutral-300 border border-neutral-300/80 dark:border-white/10',
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/40',
    warning: 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/40',
    danger: 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-300/60 dark:border-rose-800/40',
    info: 'bg-neutral-900 text-white dark:bg-white dark:text-black border border-neutral-900 dark:border-white',
    purple: 'bg-purple-50 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300 border border-purple-300/60 dark:border-purple-800/40',
  };

  const dotStyles = {
    neutral: 'bg-neutral-400',
    default: 'bg-neutral-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-white dark:bg-black',
    purple: 'bg-purple-500',
  };

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1 h-1 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ProjectStatus; className?: string }> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.planning;
  return (
    <span
      className={`inline-flex items-center text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 rounded-md gap-1.5 border border-black/10 dark:border-white/10 bg-white dark:bg-[#161618] text-neutral-800 dark:text-neutral-200 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority; className?: string }> = ({ priority, className = '' }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span className={`inline-flex items-center text-[9px] px-2 py-0.5 rounded-md font-mono uppercase tracking-[0.12em] border ${config.badgeClass} ${className}`}>
      {config.label}
    </span>
  );
};

export const TaskStatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({ status, className = '' }) => {
  const config = TASK_STATUS_CONFIG[status] || TASK_STATUS_CONFIG.todo;
  return (
    <span className={`inline-flex items-center text-[9px] font-mono uppercase tracking-[0.12em] px-2 py-0.5 rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-100/80 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 ${className}`}>
      {config.label}
    </span>
  );
};

export const MilestoneStatusBadge: React.FC<{ status: MilestoneStatus; className?: string }> = ({ status, className = '' }) => {
  const config = MILESTONE_STATUS_CONFIG[status] || MILESTONE_STATUS_CONFIG.not_started;
  return (
    <span className={`inline-flex items-center text-[9px] font-mono uppercase tracking-[0.12em] px-2 py-0.5 rounded-md ${config.badgeClass} ${className}`}>
      {config.label}
    </span>
  );
};

