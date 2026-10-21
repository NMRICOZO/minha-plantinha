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
        <label htmlFor={inputId} className="block text-xs font-semibold text-emerald-200">
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`w-full bg-[#07130e] text-white text-xs sm:text-sm rounded-[0.75rem] px-3.5 py-2.5 border transition-all placeholder:text-emerald-700/50 focus:outline-none disabled:opacity-50 ${
          error
            ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/40'
            : 'border-emerald-800/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-rose-300 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-emerald-400/70">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
