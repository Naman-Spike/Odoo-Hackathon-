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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] disabled:active:scale-100 cursor-pointer';
  
  const variants = {
    // Stark black primary button on light glass
    primary: 'bg-black text-white hover:bg-zinc-800 shadow-[0_4px_14px_rgba(0,0,0,0.18)] focus:ring-black border border-black',
    // Gradient dark pill
    gradient: 'bg-gradient-to-b from-zinc-900 to-black text-white hover:from-black hover:to-zinc-900 shadow-md focus:ring-black border border-black',
    // White Liquid Glass Translucent
    glass: 'bg-white/80 hover:bg-white text-zinc-900 border border-zinc-200/80 backdrop-blur-xl shadow-sm hover:shadow-md focus:ring-zinc-400',
    // Secondary light
    secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 hover:text-black border border-zinc-200 focus:ring-zinc-400',
    // Minimalist monochrome states
    success: 'bg-black text-white hover:bg-zinc-800 border border-black shadow-sm focus:ring-black',
    danger: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300 focus:ring-zinc-400',
    ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-black focus:ring-zinc-300',
    outline: 'border border-zinc-300 bg-white/70 hover:bg-white text-zinc-900 shadow-sm backdrop-blur-md focus:ring-zinc-400'
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
