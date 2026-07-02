import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20',
  secondary:
    'bg-surface-700 hover:bg-surface-600 text-text-primary border border-border-subtle',
  ghost:
    'bg-transparent hover:bg-surface-800 text-text-secondary hover:text-text-primary',
  danger:
    'bg-danger-600 hover:bg-danger-700 text-white shadow-lg shadow-danger-600/20',
  accent:
    'bg-accent-600 hover:bg-accent-700 text-white shadow-lg shadow-accent-600/20',
  gradient:
    'gradient-primary text-white shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-base',
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
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
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
