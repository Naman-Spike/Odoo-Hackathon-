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
        "rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-2xl shadow-liquid-card transition-all duration-300 text-zinc-900 specular-highlight",
        hoverEffect ? "hover:border-zinc-300 hover:bg-white hover:shadow-liquid hover:-translate-y-0.5" : "",
        className
      )} 
      {...props} 
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex flex-col space-y-1.5 p-6 border-b border-zinc-100", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={classNames("text-base font-bold leading-none tracking-tight text-zinc-900", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
