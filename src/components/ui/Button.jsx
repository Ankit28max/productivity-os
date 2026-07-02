import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-primary-600/90 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35',
  secondary:
    'glass-input hover:bg-surface-700/60 text-text-primary hover:border-white/12',
  ghost:
    'bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary',
  danger:
    'bg-danger-600/90 hover:bg-danger-500 text-white shadow-lg shadow-danger-600/25',
  accent:
    'bg-accent-600/90 hover:bg-accent-500 text-dark-950 font-semibold shadow-lg shadow-accent-600/25',
  gradient:
    'gradient-primary text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-500/50 hover:brightness-110',
  neon:
    'bg-transparent border border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:border-primary-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1.5',
  sm: 'px-3.5 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
  xl: 'px-6 py-3.5 text-base gap-2.5',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-250 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !isLoading && <IconRight className="h-4 w-4 shrink-0" />}
    </button>
  );
});

export default Button;
