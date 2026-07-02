import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineFire } from 'react-icons/hi';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';

// List of unlockable achievements / badges
const BADGES = [
  { id: 'b-starter', name: 'Starter Habit', desc: 'Check in your first habit', icon: '🌱', req: (count) => count > 0 },
  { id: 'b-consistent', name: 'Consistent Daily', desc: 'Achieve a 3-day streak', icon: '⚡', req: (streak) => streak >= 3 },
  { id: 'b-warrior', name: 'Week Warrior', desc: 'Achieve a 7-day streak', icon: '🏆', req: (streak) => streak >= 7 },
  { id: 'b-guru', name: 'Habit Guru', desc: 'Track 3 or more active habits', icon: '🧠', req: (_, count) => count >= 3 },
];

export default function HabitsPage() {
  const { habits, isLoading, createHabit, deleteHabit, toggleHabitCheckIn, getStreak } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive streaks and stats
  const habitsWithStreaks = useMemo(() => {
    return habits.map((h) => ({
      ...h,
      streak: getStreak(h),
    }));
  }, [habits, getStreak]);

  const bestStreak = useMemo(() => {
    if (habitsWithStreaks.length === 0) return 0;
    return Math.max(...habitsWithStreaks.map((h) => h.streak));
  }, [habitsWithStreaks]);

  const averageCompletion = useMemo(() => {
    if (habits.length === 0) return 0;
    const rates = habits.map((habit) => {
      if (habit.history.length === 0) return 0;
      const thirtyDaysAgo = Date.now() - 30 * 86400000;
      const recent = habit.history.filter((dateStr) => new Date(dateStr).getTime() >= thirtyDaysAgo);
      return (recent.length / 30) * 100;
    });
    const sum = rates.reduce((a, b) => a + b, 0);
    return Math.round(sum / habits.length);
  }, [habits]);

  // Evaluate unlocked badges
  const unlockedBadges = useMemo(() => {
    const totalCount = habits.length;
    return BADGES.filter((badge) => {
      if (badge.id === 'b-starter') return badge.req(totalCount);
      if (badge.id === 'b-consistent' || badge.id === 'b-warrior') return badge.req(bestStreak);
      if (badge.id === 'b-guru') return badge.req(null, totalCount);
      return false;
    });
  }, [habits, bestStreak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Habit Tracker</h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Build consistency, record daily check-ins, and earn milestones.
          </p>
        </div>
        <Button variant="gradient" size="sm" icon={HiOutlinePlus} onClick={() => setIsModalOpen(true)}>
          New Habit
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-primary-500/20 transition-all duration-300" hover>
          <p className="text-2xl font-bold text-primary-400">{habits.length}</p>
          <p className="text-xs text-text-muted mt-1 font-medium">Active Habits</p>
        </Card>
        <Card className="hover:border-warning-500/20 transition-all duration-300" hover>
          <p className="text-2xl font-bold text-warning-400">{bestStreak} Days</p>
          <p className="text-xs text-text-muted mt-1 font-medium">Best Active Streak</p>
        </Card>
        <Card className="hover:border-accent-500/20 transition-all duration-300" hover>
          <p className="text-2xl font-bold text-accent-400">{averageCompletion}%</p>
          <p className="text-xs text-text-muted mt-1 font-medium">Avg Completion Rate</p>
        </Card>
      </div>

      {/* Main Grid: Habits and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habits Cards Column */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1.5">
            Your Habits
          </h3>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : habitsWithStreaks.length === 0 ? (
            <Card variant="default" className="py-12">
              <EmptyState
                icon={HiOutlineFire}
                title="No habits tracked yet"
                description="Habits are actions done daily. Set simple goals like drinking water, reading, or exercise to build streaks."
                action={
                  <Button variant="gradient" icon={HiOutlinePlus} onClick={() => setIsModalOpen(true)}>
                    Create Habit
                  </Button>
                }
              />
            </Card>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {habitsWithStreaks.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    streak={habit.streak}
                    onToggle={toggleHabitCheckIn}
                    onDelete={deleteHabit}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Milestones / Badges Sidebar Column */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1.5">
            Milestones & Achievements
          </h3>

          <Card variant="surface" className="space-y-4">
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-2xl opacity-40">🔒</span>
                <p className="text-xs text-text-muted mt-2">
                  Complete check-ins and streaks to unlock productivity achievements.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-lg shrink-0">
                      {badge.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-text-primary">{badge.name}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">{badge.desc}</p>
                    </div>
                    <span className="text-[10px] text-accent-400 font-semibold uppercase tracking-wider ml-auto bg-accent-500/10 px-2 py-0.5 rounded-lg border border-accent-500/15">
                      Unlocked
                    </span>
                  </div>
                ))}

                {/* Show locked badges details too */}
                {BADGES.filter((b) => !unlockedBadges.includes(b)).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-transparent border border-white/[0.02] opacity-40 grayscale"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg shrink-0">
                      {badge.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-text-secondary">{badge.name}</h4>
                      <p className="text-[10px] text-text-tertiary mt-0.5">{badge.desc}</p>
                    </div>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider ml-auto">
                      Locked
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createHabit}
      />
    </motion.div>
  );
}
