import React, { HTMLAttributes, forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] transition-all ${className}`}
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
    className={`text-base sm:text-lg font-bold font-serif text-[var(--text-primary)] tracking-tight ${className}`}
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
    className={`text-xs text-[var(--text-muted)] leading-relaxed ${className}`}
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
    className={`p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] rounded-b-[var(--radius-lg)] flex items-center justify-between text-xs text-[var(--text-secondary)] ${className}`}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
