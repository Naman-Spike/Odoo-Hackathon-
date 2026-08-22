import React from 'react';
import { classNames } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'purple' | 'glass';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', dot = true, className, children, ...props }) => {
  const variants: Record<string, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-zinc-100 text-zinc-900 border-zinc-300',
      dot: 'bg-black'
    },
    warning: {
      bg: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      dot: 'bg-zinc-600'
    },
    danger: {
      bg: 'bg-zinc-100 text-zinc-700 border-zinc-300',
      dot: 'bg-zinc-400'
    },
    info: {
      bg: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      dot: 'bg-zinc-700'
    },
    primary: {
      bg: 'bg-black text-white font-bold border-black shadow-sm',
      dot: 'bg-white'
    },
    purple: {
      bg: 'bg-zinc-100 text-zinc-900 border-zinc-300',
      dot: 'bg-black'
    },
    glass: {
      bg: 'bg-white/80 text-zinc-900 border-zinc-200 backdrop-blur-md shadow-sm',
      dot: 'bg-zinc-700'
    },
    default: {
      bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      dot: 'bg-zinc-400'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <span 
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border backdrop-blur-md transition-colors tracking-tight",
        currentVariant.bg,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={classNames("w-1.5 h-1.5 rounded-full mr-1.5", currentVariant.dot)} />
      )}
      {children}
    </span>
  );
};
