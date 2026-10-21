import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'botanical' | 'amber' | 'cyan' | 'rose' | 'neutral' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'botanical',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors';

  const variants = {
    botanical: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50',
    amber: 'bg-amber-950/70 text-amber-300 border border-amber-700/50',
    cyan: 'bg-cyan-950/70 text-cyan-300 border border-cyan-700/50',
    rose: 'bg-rose-950/70 text-rose-300 border border-rose-700/50',
    neutral: 'bg-black/50 text-emerald-200/80 border border-white/10',
    outline: 'bg-transparent text-emerald-300 border border-emerald-600/50',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
