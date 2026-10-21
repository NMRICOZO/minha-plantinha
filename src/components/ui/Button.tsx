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
    primary: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-[#07130e] shadow-md shadow-emerald-950/60 font-bold border border-emerald-500/40',
    secondary: 'bg-[#0e2219] hover:bg-[#132c21] text-emerald-100 border border-emerald-800/40 shadow-sm',
    outline: 'bg-transparent hover:bg-emerald-950/50 text-emerald-300 border border-emerald-700/60 hover:border-emerald-500',
    ghost: 'bg-transparent hover:bg-emerald-950/40 text-emerald-300/80 hover:text-emerald-100',
    destructive: 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-800/60 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded-[0.625rem] gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 rounded-[0.75rem] gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-[0.875rem] gap-2.5',
    icon: 'w-9 h-9 p-0 rounded-[0.75rem] flex items-center justify-center',
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
