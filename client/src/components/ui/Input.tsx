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
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            type={type}
            className={classNames(
              "flex h-11 w-full rounded-xl border bg-black/40 text-white placeholder:text-zinc-600 px-3.5 py-2 text-xs focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-inner backdrop-blur-md",
              Icon && "pl-10",
              error ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-950/20" : "border-white/10 hover:border-white/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-rose-400 flex items-center gap-1">
            <span>●</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
