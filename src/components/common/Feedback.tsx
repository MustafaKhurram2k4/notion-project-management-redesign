import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useWorkspace, ToastMessage } from '../../context/WorkspaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useWorkspace();

  if (toasts.length === 0) return null;

  const icons: Record<ToastMessage['type'], React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-neutral-400 shrink-0" />,
  };

  const borders: Record<ToastMessage['type'], string> = {
    success: 'border-emerald-300 dark:border-emerald-800/40',
    error: 'border-rose-300 dark:border-rose-800/40',
    warning: 'border-amber-300 dark:border-amber-800/40',
    info: 'border-neutral-300 dark:border-white/10',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#161618] shadow-lg border ${borders[toast.type]} text-neutral-800 dark:text-[#E2E2E2] animate-in slide-in-from-bottom-5 duration-200`}
        >
          <div className="mt-0.5">{icons[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-serif font-bold text-neutral-900 dark:text-neutral-100">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-neutral-300 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02] ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 flex items-center justify-center mb-3.5 border border-neutral-200 dark:border-white/10">
          {icon}
        </div>
      )}
      <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-neutral-100 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4 leading-relaxed font-light">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#141416] rounded-xl shadow-2xl border border-neutral-300 dark:border-white/10 p-6 z-10 animate-in zoom-in-95">
        <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.12em] rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors border border-transparent"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-[0.12em] font-semibold rounded-lg text-white transition-colors ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-neutral-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export const Tabs: React.FC<{
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 border-b border-neutral-200/90 dark:border-white/10 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-neutral-900 text-neutral-900 dark:border-[#E2E2E2] dark:text-[#E2E2E2]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-white/20'
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono font-bold tabular-nums ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

