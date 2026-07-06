import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';

/**
 * StatCard — a premium animated stat tile with icon, value, label, and optional trend delta.
 *
 * Props:
 *  - icon: React component (e.g. HiOutlineFire)
 *  - value: string | number  — the main figure to display
 *  - label: string           — short description
 *  - sublabel: string        — secondary context line (optional)
 *  - trend: number           — positive = up, negative = down, undefined = hidden
 *  - color: 'orange' | 'cyan' | 'violet' | 'lime' | 'amber'
 *  - className: string
 */
const colorMap = {
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    value: 'text-orange-400',
    glow: 'group-hover:shadow-[0_0_40px_rgba(234,88,12,0.12)]',
  },
  cyan: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    value: 'text-cyan-400',
    glow: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]',
  },
  violet: {
    icon: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    value: 'text-violet-400',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]',
  },
  lime: {
    icon: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
    value: 'text-lime-400',
    glow: 'group-hover:shadow-[0_0_40px_rgba(132,204,22,0.12)]',
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    value: 'text-amber-400',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]',
  },
};

export default function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  trend,
  color = 'orange',
  className,
  index = 0,
}) {
  const c = colorMap[color] || colorMap.orange;
  const hasTrend = trend !== undefined && trend !== null;
  const trendUp = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className={cn(
        'group glass-card rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden cursor-default',
        'transition-all duration-300',
        c.glow,
        className
      )}
    >
      {/* Subtle hover glow blob */}
      <div className={cn('absolute -top-4 -right-4 h-16 w-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500', c.bg)} />

      <div className="flex items-start justify-between relative z-10">
        {/* Icon badge */}
        <div className={cn('p-2 rounded-xl border', c.bg, c.border)}>
          {Icon && <Icon className={cn('h-4 w-4', c.icon)} />}
        </div>

        {/* Trend indicator */}
        {hasTrend && (
          <div className={cn(
            'flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full',
            trendUp ? 'text-lime-400 bg-lime-500/10' : 'text-rose-400 bg-rose-500/10'
          )}>
            {trendUp
              ? <HiOutlineTrendingUp className="h-3 w-3" />
              : <HiOutlineTrendingDown className="h-3 w-3" />
            }
            <span>{trendUp ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative z-10">
        <p className={cn('text-2xl font-extrabold tracking-tight leading-none', c.value)}>
          {value}
        </p>
        <p className="text-xs font-semibold text-text-primary mt-1">{label}</p>
        {sublabel && (
          <p className="text-[10px] text-text-muted mt-0.5 font-medium">{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}
