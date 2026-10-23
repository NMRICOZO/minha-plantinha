import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  helperText,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-secondary)]">
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`w-full bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs sm:text-sm rounded-[var(--radius-md)] px-3.5 py-2.5 border transition-all placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-50 ${
          error
            ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/40'
            : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/30'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-rose-300 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[var(--text-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
