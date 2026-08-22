import React, { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { classNames } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-950 active:scale-[0.98] disabled:active:scale-100 cursor-pointer';
  
  const variants = {
    // Pure stark white button on dark glass
    primary: 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] focus:ring-white border border-white',
    // Liquid glass gradient
    gradient: 'bg-gradient-to-b from-white/95 to-zinc-200 text-black hover:from-white hover:to-zinc-300 shadow-[0_4px_20px_-2px_rgba(255,255,255,0.35)] focus:ring-white border border-white',
    // Liquid Glass Translucent
    glass: 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 backdrop-blur-xl shadow-specular hover:shadow-glow-white focus:ring-white/50',
    // Dark secondary
    secondary: 'bg-white/[0.08] text-zinc-200 hover:bg-white/[0.14] hover:text-white border border-white/10 focus:ring-zinc-400',
    // Minimalist monochrome states
    success: 'bg-white text-black hover:bg-zinc-200 border border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] focus:ring-white',
    danger: 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-700 focus:ring-zinc-500',
    ghost: 'text-zinc-400 hover:bg-white/[0.06] hover:text-white focus:ring-white/20',
    outline: 'border border-white/20 bg-black/40 hover:bg-white/[0.08] text-white shadow-sm backdrop-blur-md focus:ring-white/40'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) ? 'opacity-40 cursor-not-allowed shadow-none' : '',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
      {children}
    </button>
  );
};
