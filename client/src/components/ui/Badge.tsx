import React from 'react';
import { classNames } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'purple' | 'glass';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', dot = true, className, children, ...props }) => {
  const variants: Record<string, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-white/10 text-white border-white/20 shadow-specular',
      dot: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
    },
    warning: {
      bg: 'bg-zinc-800/80 text-zinc-200 border-zinc-700/80',
      dot: 'bg-zinc-400'
    },
    danger: {
      bg: 'bg-zinc-900/90 text-zinc-300 border-zinc-700',
      dot: 'bg-zinc-500'
    },
    info: {
      bg: 'bg-white/[0.08] text-zinc-200 border-white/15',
      dot: 'bg-zinc-300'
    },
    primary: {
      bg: 'bg-white text-black font-bold border-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)]',
      dot: 'bg-black'
    },
    purple: {
      bg: 'bg-white/15 text-white border-white/25 shadow-specular',
      dot: 'bg-white'
    },
    glass: {
      bg: 'bg-white/[0.06] text-zinc-200 border-white/15 backdrop-blur-md',
      dot: 'bg-white/80'
    },
    default: {
      bg: 'bg-zinc-900/80 text-zinc-300 border-zinc-800',
      dot: 'bg-zinc-500'
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
