import React from 'react';
import { classNames } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'purple';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', dot = true, className, children, ...props }) => {
  const variants: Record<string, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/10',
      dot: 'bg-emerald-500'
    },
    warning: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/10',
      dot: 'bg-amber-500'
    },
    danger: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/10',
      dot: 'bg-rose-500'
    },
    info: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200/80 ring-1 ring-sky-500/10',
      dot: 'bg-sky-500'
    },
    primary: {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-1 ring-indigo-500/10',
      dot: 'bg-indigo-500'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200/80 ring-1 ring-purple-500/10',
      dot: 'bg-purple-500'
    },
    default: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200/80 ring-1 ring-slate-500/10',
      dot: 'bg-slate-400'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <span 
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors",
        currentVariant.bg,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={classNames("w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse-subtle", currentVariant.dot)} />
      )}
      {children}
    </span>
  );
};
