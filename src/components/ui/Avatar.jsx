import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/helpers';

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  className,
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover ring-2 ring-border-default',
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'gradient-primary text-white ring-2 ring-primary-500/30',
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
