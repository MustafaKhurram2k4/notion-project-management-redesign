import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'auto';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'sm',
  variant = 'auto',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeClasses = {
    xs: 'h-0.5',
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  const getAutoColor = (pct: number) => {
    if (pct >= 100) return 'bg-emerald-500 dark:bg-emerald-400';
    if (pct >= 60) return 'bg-neutral-900 dark:bg-white';
    if (pct >= 30) return 'bg-amber-500';
    return 'bg-neutral-400 dark:bg-neutral-500';
  };

  const variantClasses = {
    indigo: 'bg-neutral-900 dark:bg-white',
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-500 dark:bg-rose-400',
    auto: getAutoColor(percentage),
  };

  return (
    <div className={`w-full flex items-center gap-2.5 ${className}`}>
      <div className={`w-full bg-neutral-200/80 dark:bg-white/10 overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} transition-all duration-500 ease-out ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 shrink-0 tabular-nums">
          {percentage}%
        </span>
      )}
    </div>
  );
};

export const ProgressRing: React.FC<{
  value: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'auto';
  showText?: boolean;
  className?: string;
}> = ({
  value,
  size = 36,
  strokeWidth = 2.5,
  variant = 'auto',
  showText = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round(value), 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getAutoColor = (pct: number) => {
    if (pct >= 100) return 'stroke-emerald-500';
    if (pct >= 70) return 'stroke-neutral-900 dark:stroke-white';
    if (pct >= 40) return 'stroke-amber-500';
    return 'stroke-neutral-400';
  };

  const colors = {
    indigo: 'stroke-neutral-900 dark:stroke-white',
    emerald: 'stroke-emerald-500 dark:stroke-emerald-400',
    amber: 'stroke-amber-500 dark:stroke-amber-400',
    rose: 'stroke-rose-500 dark:stroke-rose-400',
    auto: getAutoColor(percentage),
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-neutral-200 dark:stroke-white/10"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${colors[variant]} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="square"
          fill="transparent"
        />
      </svg>
      {showText && (
        <span className="absolute text-[10px] font-mono font-medium text-neutral-800 dark:text-neutral-200 tabular-nums">
          {percentage}%
        </span>
      )}
    </div>
  );
};

