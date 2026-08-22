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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] disabled:active:scale-100 cursor-pointer select-none';
  
  const variants = {
    // High-gloss pitch black primary button with top specular inner highlight
    primary: 'bg-black text-white hover:bg-zinc-900 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(0,0,0,0.22)] focus:ring-black border border-black',
    // Gradient dark glass pill
    gradient: 'bg-gradient-to-b from-zinc-800 to-black text-white hover:from-black hover:to-zinc-900 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_8px_20px_-4px_rgba(0,0,0,0.25)] focus:ring-black border border-black',
    // Translucent Liquid Glass
    glass: 'bg-white/70 hover:bg-white/90 text-zinc-900 border border-white/90 backdrop-blur-2xl shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,1),0_8px_24px_-6px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,1),0_12px_28px_-6px_rgba(0,0,0,0.1)] focus:ring-zinc-400',
    // Secondary light glass
    secondary: 'bg-zinc-100/80 text-zinc-800 hover:bg-zinc-200 hover:text-black border border-zinc-200 backdrop-blur-md shadow-sm focus:ring-zinc-400',
    // Success monochrome glass
    success: 'bg-black text-white hover:bg-zinc-800 border border-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_18px_-4px_rgba(0,0,0,0.2)] focus:ring-black',
    // Danger subtle glass
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 shadow-sm focus:ring-rose-300',
    ghost: 'text-zinc-600 hover:bg-white/60 hover:text-black hover:backdrop-blur-md focus:ring-zinc-300',
    outline: 'border border-zinc-200/90 bg-white/75 hover:bg-white text-zinc-900 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9),0_4px_16px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xl focus:ring-zinc-400'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
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
