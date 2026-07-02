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
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-lg bg-surface-800 border border-border-default px-3.5 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-muted',
            'transition-all duration-200',
            'hover:border-border-subtle',
            'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30',
            Icon && 'pl-10',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger-400 mt-0.5">{error}</p>
      )}
    </div>
  );
});

export default Input;
