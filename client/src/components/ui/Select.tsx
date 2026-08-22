import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { classNames } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1.5 font-mono">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={classNames(
              "flex h-11 w-full rounded-xl border bg-white/90 text-zinc-900 px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm backdrop-blur-md appearance-none cursor-pointer",
              error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/50" : "border-zinc-200 hover:border-zinc-300",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-zinc-900 py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
            <span>●</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
