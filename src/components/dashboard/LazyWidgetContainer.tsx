import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyWidgetContainerProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string | number;
  rootMargin?: string;
  id?: string;
}

/**
 * LazyWidgetContainer - Mobile Performance & LCP Optimization
 * Defers rendering and DOM creation of below-the-fold widgets until they approach the viewport.
 * Uses IntersectionObserver with a generous rootMargin (250px) for seamless visual loading.
 * Preserves exact minHeight to eliminate Cumulative Layout Shift (CLS).
 */
export const LazyWidgetContainer: React.FC<LazyWidgetContainerProps> = ({
  children,
  fallback,
  minHeight = '180px',
  rootMargin = '250px',
  id
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, render immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  const defaultSkeleton = (
    <div 
      className="glass-card rounded-2xl p-5 border border-emerald-900/30 animate-pulse space-y-3"
      style={{ minHeight }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80" />
          <div className="h-4 w-36 bg-emerald-950/60 rounded-lg" />
        </div>
        <div className="h-4 w-16 bg-emerald-950/40 rounded" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-14 bg-emerald-950/40 rounded-xl" />
        <div className="h-14 bg-emerald-950/30 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef} 
      id={id}
      style={{ minHeight: !isVisible ? minHeight : undefined }}
      className="transition-opacity duration-300"
    >
      {isVisible ? children : (fallback || defaultSkeleton)}
    </div>
  );
};
