import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'botanical' | 'amber' | 'cyan' | 'rose' | 'neutral' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'primary',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors';

  const variants = {
    primary: 'bg-[var(--accent-primary)]/20 text-[var(--accent-hover)] border border-[var(--border-strong)]',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
    alert: 'bg-[var(--color-alert)]/20 text-amber-300 border border-[var(--color-alert)]/50',
    botanical: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50',
    amber: 'bg-amber-950/70 text-amber-300 border border-amber-700/50',
    cyan: 'bg-cyan-950/70 text-cyan-300 border border-cyan-700/50',
    rose: 'bg-rose-950/70 text-rose-300 border border-rose-700/50',
    neutral: 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]',
    outline: 'bg-transparent text-[var(--text-secondary)] border border-[var(--border-strong)]',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
