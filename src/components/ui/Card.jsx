import { cn } from '../../utils/cn';

const variantStyles = {
  default: 'bg-surface-800 border-border-default',
  glass: 'glass',
  gradient: 'gradient-primary border-0',
  elevated: 'bg-surface-800 border-border-default shadow-lg shadow-black/20',
};

export default function Card({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
  ...props
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
