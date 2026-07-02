import { HiOutlineSearch } from 'react-icons/hi';
import { cn } from '../../utils/cn';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}) {
  return (
    <div className={cn('relative', className)}>
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg bg-surface-800 border border-border-default pl-9 pr-3.5 py-2 text-sm text-text-primary',
          'placeholder:text-text-muted',
          'transition-all duration-200',
          'hover:border-border-subtle',
          'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
        )}
      />
    </div>
  );
}
