import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] tracking-[0.08em]';

    const sizeStyles = {
      xs: 'text-[10px] px-2.5 py-1 rounded-md gap-1.5 h-7',
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
      md: 'text-xs px-4 py-2 rounded-lg gap-2 h-9',
      lg: 'text-sm px-5 py-2.5 rounded-lg gap-2.5 h-10',
    };

    const variantStyles = {
      primary:
        'bg-neutral-900 hover:bg-black text-white dark:bg-[#E2E2E2] dark:hover:bg-white dark:text-[#0A0A0A] border border-neutral-800 dark:border-white/30 shadow-xs uppercase font-semibold text-[11px] tracking-[0.14em]',
      secondary:
        'bg-white hover:bg-neutral-100/80 text-neutral-900 border border-neutral-300/80 shadow-2xs dark:bg-[#121214] dark:hover:bg-[#1C1C1F] dark:text-[#E2E2E2] dark:border-white/10 text-xs font-medium',
      outline:
        'bg-transparent hover:bg-neutral-900/5 text-neutral-800 border border-neutral-300 dark:border-white/15 dark:text-[#E2E2E2] dark:hover:bg-white/5 text-xs',
      ghost:
        'bg-transparent hover:bg-neutral-200/50 text-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5 border border-transparent text-xs',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-xs dark:bg-rose-700 dark:hover:bg-rose-600 border border-rose-800/30 text-xs',
      subtle:
        'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-[#E2E2E2] border border-transparent text-xs',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span className="truncate whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

