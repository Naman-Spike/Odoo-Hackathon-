import React from 'react';
import { classNames } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => (
    <div 
      ref={ref} 
      className={classNames(
        "rounded-3xl border border-white/90 bg-gradient-to-br from-white/90 via-white/80 to-white/65 backdrop-blur-2xl shadow-[0_16px_36px_-8px_rgba(0,0,0,0.04),inset_0_1.5px_1.5px_0_rgba(255,255,255,1),inset_0_-1px_1px_0_rgba(0,0,0,0.02)] transition-all duration-300 text-zinc-900 specular-highlight glass-sheen",
        hoverEffect ? "hover:border-white hover:bg-white/95 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),inset_0_1.5px_1.5px_0_rgba(255,255,255,1)] hover:-translate-y-1" : "",
        className
      )} 
      {...props} 
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex flex-col space-y-1.5 p-6 border-b border-zinc-100/80 bg-white/30 backdrop-blur-md rounded-t-3xl", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={classNames("text-base font-bold leading-none tracking-tight text-zinc-900 font-sans", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
