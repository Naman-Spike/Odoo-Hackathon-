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
          <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1.5 font-mono">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            type={type}
            className={classNames(
              "flex h-11 w-full rounded-xl border bg-white/90 text-zinc-900 placeholder:text-zinc-400 px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm backdrop-blur-md",
              Icon && "pl-10",
              error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/50" : "border-zinc-200 hover:border-zinc-300",
              className
            )}
            ref={ref}
            {...props}
          />
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

Input.displayName = 'Input';
