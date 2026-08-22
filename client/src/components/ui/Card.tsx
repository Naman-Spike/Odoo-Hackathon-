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
        "bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200",
        hoverEffect ? "hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5" : "",
        className
      )} 
      {...props} 
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex flex-col space-y-1.5 p-6 border-b border-slate-100", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={classNames("text-lg font-bold leading-none tracking-tight text-slate-900", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
