import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showShortcut?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, size = 'md', placeholder = 'Search...', showShortcut = false, className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 text-xs pl-8 pr-7',
      md: 'h-9 text-xs pl-9 pr-8',
      lg: 'h-10 text-sm pl-11 pr-10',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5 left-2.5',
      md: 'w-3.5 h-3.5 left-3',
      lg: 'w-4 h-4 left-3.5',
    };

    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <Search className={`absolute text-neutral-400 dark:text-neutral-500 pointer-events-none ${iconSizes[size]}`} />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-neutral-900 dark:text-[#E2E2E2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/40 focus:border-black dark:focus:border-white/40 transition-all font-sans ${sizeClasses[size]}`}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-0.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {showShortcut && !value && (
          <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-white/5 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 rounded">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-neutral-400 dark:text-neutral-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-9 rounded-lg bg-white dark:bg-[#121214] border text-xs text-neutral-900 dark:text-[#E2E2E2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/40 transition-all ${
              leftIcon ? 'pl-9 pr-3' : 'px-3'
            } ${
              error
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-neutral-300/80 dark:border-white/10 focus:border-black dark:focus:border-white/40'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full h-9 px-3 rounded-lg bg-white dark:bg-[#121214] border text-xs text-neutral-900 dark:text-[#E2E2E2] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/40 transition-all ${
            error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-neutral-300/80 dark:border-white/10 focus:border-black dark:focus:border-white/40'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const checkId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2.5 select-none">
        <input
          id={checkId}
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-0 dark:bg-neutral-900 cursor-pointer ${className}`}
          {...props}
        />
        {(label || description) && (
          <div className="text-left">
            {label && (
              <label htmlFor={checkId} className="text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer">
                {label}
              </label>
            )}
            {description && <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
