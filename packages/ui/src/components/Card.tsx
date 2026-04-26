import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive';
}

export function Card({ children, variant = 'default', className = '', ...props }: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[var(--lt-surface-radius)] shadow-sm',
    glass: 'glass-panel',
    interactive: 'glass-card cursor-pointer'
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold text-[var(--lt-text-primary)] ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
