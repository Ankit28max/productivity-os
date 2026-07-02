import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon: Icon,
    type = 'text',
    className,
    containerClassName,
    ...props
  },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-400 transition-colors duration-200">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-xl glass-input px-4 py-3 text-sm text-text-primary',
            'placeholder:text-text-muted',
            'transition-all duration-250',
            'hover:border-white/12',
            'focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20',
            'focus:shadow-[0_0_20px_rgba(6,182,212,0.06)]',
            Icon && 'pl-11',
            error && 'border-danger-500/40 focus:border-danger-500/50 focus:ring-danger-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger-400 mt-0.5 flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-danger-400" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
