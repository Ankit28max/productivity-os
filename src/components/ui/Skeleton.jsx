import { cn } from '../../utils/cn';

export default function Skeleton({
  width,
  height,
  rounded = 'md',
  className,
}) {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-surface-700',
        roundedMap[rounded],
        className
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border-default bg-surface-800 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded="full" />
        <div className="space-y-2 flex-1">
          <Skeleton height={14} className="w-1/3" rounded="md" />
          <Skeleton height={10} className="w-1/2" rounded="md" />
        </div>
      </div>
      <Skeleton height={12} className="w-full" rounded="md" />
      <Skeleton height={12} className="w-4/5" rounded="md" />
      <Skeleton height={12} className="w-3/5" rounded="md" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg bg-surface-800 p-3"
        >
          <Skeleton width={32} height={32} rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton height={12} className="w-2/3" rounded="md" />
            <Skeleton height={10} className="w-1/2" rounded="md" />
          </div>
        </div>
      ))}
    </div>
  );
}
