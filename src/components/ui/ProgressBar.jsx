import { cn } from '../../utils/cn';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorMap = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    danger: 'bg-danger-500',
    warning: 'bg-warning-500',
    gradient: 'gradient-primary',
  };

  const sizeMap = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-text-secondary">Progress</span>
          <span className="text-xs font-medium text-text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-700 overflow-hidden',
          sizeMap[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorMap[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
