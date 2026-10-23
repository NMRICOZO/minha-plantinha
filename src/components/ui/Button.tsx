import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] border border-[var(--border-strong)] shadow-sm font-bold',
    secondary: 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm font-medium',
    outline: 'bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] font-medium',
    ghost: 'bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium',
    destructive: 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-800/60 shadow-sm font-semibold',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 rounded-[var(--radius-md)] gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-[var(--radius-lg)] gap-2.5',
    icon: 'w-9 h-9 p-0 rounded-[var(--radius-md)] flex items-center justify-center',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
