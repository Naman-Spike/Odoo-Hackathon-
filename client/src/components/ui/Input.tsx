import React, { forwardRef, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { classNames } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            type={type}
            className={classNames(
              "flex h-11 w-full rounded-xl border bg-slate-50/50 hover:bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
              Icon && "pl-10",
              error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30" : "border-slate-200 hover:border-slate-300",
              className
            )}
            ref={ref}
            {...props}
          />
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

Input.displayName = 'Input';
