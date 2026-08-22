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
        "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-liquid-card transition-all duration-300 text-zinc-100 specular-highlight",
        hoverEffect ? "hover:border-white/20 hover:bg-white/[0.055] hover:shadow-liquid-glow hover:-translate-y-0.5" : "",
        className
      )} 
      {...props} 
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex flex-col space-y-1.5 p-6 border-b border-white/[0.07]", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={classNames("text-base font-bold leading-none tracking-tight text-white", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
