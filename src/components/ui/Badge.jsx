import { cn } from '../../utils/cn';

const colorMap = {
  blue: 'bg-primary-500/15 text-primary-400 border-primary-500/25',
  purple: 'bg-secondary-500/15 text-secondary-400 border-secondary-500/25',
  emerald: 'bg-accent-500/15 text-accent-400 border-accent-500/25',
  red: 'bg-danger-500/15 text-danger-400 border-danger-500/25',
  amber: 'bg-warning-500/15 text-warning-400 border-warning-500/25',
  gray: 'bg-dark-700/50 text-text-secondary border-border-subtle',
  info: 'bg-info-500/15 text-info-400 border-info-500/25',
};

const sizeMap = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export default function Badge({
  children,
  color = 'blue',
  size = 'md',
  dot = false,
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        colorMap[color],
        sizeMap[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            color === 'blue' && 'bg-primary-400',
            color === 'purple' && 'bg-secondary-400',
            color === 'emerald' && 'bg-accent-400',
            color === 'red' && 'bg-danger-400',
            color === 'amber' && 'bg-warning-400',
            color === 'gray' && 'bg-text-tertiary',
            color === 'info' && 'bg-info-400'
          )}
        />
      )}
      {children}
    </span>
  );
}
