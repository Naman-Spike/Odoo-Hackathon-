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
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={classNames(
              "flex h-11 w-full rounded-xl border bg-slate-50/50 hover:bg-white px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm appearance-none cursor-pointer",
              error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30" : "border-slate-200 hover:border-slate-300",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-rose-500 flex items-center gap-1">
            <span>●</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
