import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineCheckCircle } from 'react-icons/hi';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

export default function HabitCard({ habit, onToggle, onDelete, streak }) {
  // Generate last 7 days (ending today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  // Color mapping matching the design system
  const colorMap = {
    cyan: { text: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20', fill: '#06b6d4', glow: 'cyan' },
    lime: { text: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20', fill: '#84cc16', glow: 'lime' },
    violet: { text: 'text-secondary-400', bg: 'bg-secondary-500/10', border: 'border-secondary-500/20', fill: '#a855f7', glow: 'violet' },
    amber: { text: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/20', fill: '#f59e0b', glow: 'amber' },
  };

  const activeColor = colorMap[habit.color] || colorMap.cyan;

  // Compute completion rate over the last 30 days
  const completionRate = (() => {
    if (habit.history.length === 0) return 0;
    // Count days in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    const historyIn30Days = habit.history.filter((dateStr) => {
      return new Date(dateStr).getTime() >= thirtyDaysAgo;
    });
    return Math.round((historyIn30Days.length / 30) * 100);
  })();

  const getDayLetter = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'narrow' });
  };

  const toYmd = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group transition-all duration-300 relative ${activeColor.border}`}
        glow={activeColor.glow}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3">
            {/* Emoji Container */}
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${activeColor.bg}`}>
              {habit.icon}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary-400 transition-colors truncate">
                {habit.name}
              </h4>
              <p className="text-[10px] text-text-muted mt-0.5 font-medium">
                🔥 {streak} Day Streak
              </p>
            </div>
          </div>

          <button
            onClick={() => onDelete(habit.id)}
            className="p-1.5 rounded-lg hover:bg-danger-500/10 text-text-muted hover:text-danger-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Delete Habit"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>

        {/* Weekly check-in grid */}
        <div className="mt-5 space-y-2">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider pl-0.5">
            Weekly Check-In
          </span>
          <div className="grid grid-cols-7 gap-1">
            {last7Days.map((date) => {
              const dateStr = toYmd(date);
              const isChecked = habit.history.includes(dateStr);
              const isToday = dateStr === toYmd(new Date());

              return (
                <div key={dateStr} className="flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-semibold ${isToday ? 'text-primary-400' : 'text-text-tertiary'}`}>
                    {getDayLetter(date)}
                  </span>
                  <button
                    onClick={() => onToggle(habit.id, dateStr)}
                    className={`h-7 w-7 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                      isChecked
                        ? `${habit.color === 'lime' ? 'bg-accent-500 border-accent-500 shadow-[0_0_8px_rgba(163,230,53,0.3)]' : habit.color === 'violet' ? 'bg-secondary-500 border-secondary-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : habit.color === 'amber' ? 'bg-warning-500 border-warning-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'bg-primary-500 border-primary-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]'} text-dark-950`
                        : isToday
                        ? 'border-primary-500/30 hover:border-primary-400 bg-white/[0.01]'
                        : 'border-white/[0.04] hover:border-white/10 bg-transparent'
                    }`}
                  >
                    {isChecked ? (
                      <HiOutlineCheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 30-day Progress Rate */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-text-muted font-bold uppercase tracking-wider pl-0.5">
              30D Completion Rate
            </span>
            <span className={`font-semibold ${activeColor.text}`}>
              {completionRate}%
            </span>
          </div>
          <ProgressBar
            value={completionRate}
            color={habit.color === 'lime' ? 'accent' : habit.color === 'violet' ? 'secondary' : habit.color === 'amber' ? 'warning' : 'primary'}
            size="sm"
          />
        </div>
      </Card>
    </motion.div>
  );
}
