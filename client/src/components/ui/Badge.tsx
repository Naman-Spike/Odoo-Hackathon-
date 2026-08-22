import React from 'react';
import { classNames } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'purple' | 'glass';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', dot = true, className, children, ...props }) => {
  const variants: Record<string, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-white/80 text-zinc-900 border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.03)]',
      dot: 'bg-black'
    },
    warning: {
      bg: 'bg-white/80 text-zinc-800 border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.03)]',
      dot: 'bg-zinc-600'
    },
    danger: {
      bg: 'bg-rose-50/80 text-rose-800 border-rose-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]',
      dot: 'bg-rose-600'
    },
    info: {
      bg: 'bg-white/80 text-zinc-800 border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.03)]',
      dot: 'bg-zinc-700'
    },
    primary: {
      bg: 'bg-black text-white font-bold border-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)]',
      dot: 'bg-white'
    },
    purple: {
      bg: 'bg-white/80 text-zinc-900 border-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.03)]',
      dot: 'bg-black'
    },
    glass: {
      bg: 'bg-white/85 text-zinc-900 border-white/90 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_4px_14px_rgba(0,0,0,0.04)]',
      dot: 'bg-black'
    },
    default: {
      bg: 'bg-white/70 text-zinc-700 border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.02)]',
      dot: 'bg-zinc-400'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <span 
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border backdrop-blur-xl transition-all duration-200 tracking-tight",
        currentVariant.bg,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={classNames("w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0", currentVariant.dot)} />
      )}
      {children}
    </span>
  );
};
