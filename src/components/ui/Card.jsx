import { cn } from '../../utils/cn';

const variantStyles = {
  default: 'glass-card',
  glass: 'glass',
  surface: 'glass-surface',
  elevated: 'glass-card shadow-xl shadow-black/30',
  gradient: 'gradient-primary border-0 shadow-lg shadow-primary-600/20',
  neon: 'glass-card gradient-glow-border',
};

export default function Card({
  children,
  variant = 'default',
  hover = false,
  glow,
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

  const glowStyles = {
    cyan: 'card-glow-cyan',
    violet: 'card-glow-violet',
    lime: 'card-glow-lime',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-250',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'card-hover cursor-pointer',
        glow && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
