import React, { HTMLAttributes, forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`glass-card rounded-[1.25rem] border border-white/8 text-[#eef4f0] shadow-xl ${className}`}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`p-5 pb-3 flex flex-col space-y-1.5 ${className}`}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({
  className = '',
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={`text-base sm:text-lg font-bold font-serif text-white tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({
  className = '',
  ...props
}, ref) => (
  <p
    ref={ref}
    className={`text-xs text-[#9cb8a5] leading-relaxed ${className}`}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className = '',
  ...props
}, ref) => (
  <div ref={ref} className={`p-5 pt-0 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`p-4 bg-[#07130e]/80 border-t border-emerald-950/60 rounded-b-[1.25rem] flex items-center justify-between text-xs ${className}`}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
