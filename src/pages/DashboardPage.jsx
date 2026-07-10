import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
  HiOutlineSparkles,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineChip,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import { useGoals } from '../context/GoalContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/helpers';
import StepsWidget from '../components/dashboard/StepsWidget';
import { useSteps } from '../context/StepContext';
import ProductivityAIModal from '../components/dashboard/ProductivityAIModal';


const taskChartData = [
  { day: 'Mon', completed: 5, total: 7 },
  { day: 'Tue', completed: 8, total: 10 },
  { day: 'Wed', completed: 3, total: 6 },
  { day: 'Thu', completed: 7, total: 8 },
  { day: 'Fri', completed: 6, total: 9 },
  { day: 'Sat', completed: 4, total: 5 },
  { day: 'Sun', completed: 9, total: 10 },
];

const focusData = [
  { day: 'Mon', hours: 3.5 },
  { day: 'Tue', hours: 5.2 },
  { day: 'Wed', hours: 2.8 },
  { day: 'Thu', hours: 4.5 },
  { day: 'Fri', hours: 6.1 },
  { day: 'Sat', hours: 3.2 },
  { day: 'Sun', hours: 4.8 },
];

const recentActivity = [
  { action: 'TASK', detail: 'Completed "Design system components"', time: '2m ago', color: 'text-lime-400' },
  { action: 'FOCUS', detail: '25 min Pomodoro session ended', time: '15m ago', color: 'text-cyan-400' },
  { action: 'NOTE', detail: 'Created "Meeting notes – Q3 Planning"', time: '1h ago', color: 'text-violet-400' },
  { action: 'HABIT', detail: 'Morning Exercise check-in recorded', time: '3h ago', color: 'text-amber-400' },
  { action: 'GOAL', detail: 'Milestone "Build API layer" marked done', time: '5h ago', color: 'text-orange-400' },
];

const quickLinks = [
  { label: 'Tasks', to: '/tasks', icon: HiOutlineClipboardList, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Habits', to: '/habits', icon: HiOutlineFire, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Goals', to: '/goals', icon: HiOutlineTrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { label: 'Notes', to: '/notes', icon: HiOutlineBookOpen, color: 'text-lime-400', bg: 'bg-lime-500/10' },
  { label: 'Focus', to: '/pomodoro', icon: HiOutlineClock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'AI Coach', to: '/ai', icon: HiOutlineSparkles, color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const priorityMap = {
  high: { color: 'red', label: 'High' },
  medium: { color: 'amber', label: 'Medium' },
  low: { color: 'emerald', label: 'Low' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3.5 py-2.5 border border-border-default">
      <p className="text-[11px] text-text-muted mb-1.5 font-bold uppercase tracking-wider">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-[10px] font-mono text-text-muted tabular-nums">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { habits, getStreak, toggleHabitCheckIn } = useHabits();
  const { goals } = useGoals();
  const { getTodayLog } = useSteps();

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completedCount = completedTasks.length;
  const productivityScore = totalTasks > 0 ? Math.round((completedCount / totalTasks) ? (completedCount / totalTasks) * 100 : 0) : 0;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => getStreak(h))) : 0;
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.milestones && !g.milestones.every(m => m.completed)).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasksList = tasks.filter((t) => t.dueDate === todayStr).slice(0, 4);
  const pendingTodayCount = todayTasksList.filter(t => t.status !== 'completed').length;

  const todayLog = getTodayLog();

  // Aggregate user logs for the Gemini AI executive coach
  const telemetryStats = {
    tasksCompleted: completedCount,
    tasksTotal: totalTasks,
    habitsCompleted: habits.filter((h) => h.history?.includes(todayStr)).length,
    stepsLogged: todayLog.count,
    stepsTarget: todayLog.target || 10000,
    waterLogged: todayLog.water || 0,
    waterTarget: todayLog.waterTarget || 2000,
    sleepLogged: todayLog.sleep || 0,
    sleepTarget: todayLog.sleepTarget || 8,
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* ── Welcome Banner ── */}
      <Card variant="neon" className="relative overflow-hidden p-6">
        {/* Animated gradient mesh blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.3), transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-[80px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{getGreeting()}</span>
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              <span className="flex items-center gap-1 text-[10px] font-bold text-lime-400 tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span className="h-1 w-1 rounded-full bg-border-default" />
              <LiveClock />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || 'Commander'}</span> ✨
            </h2>
            <p className="text-xs text-text-secondary max-w-xl mt-1.5 leading-relaxed">
              You have{' '}
              <span className="text-orange-400 font-bold">{pendingTodayCount} pending task{pendingTodayCount !== 1 ? 's' : ''}</span> for today.
              {bestStreak > 0 && <> Your active streak is <span className="text-amber-400 font-bold">{bestStreak} days 🔥</span>.</>}
              {' '}Keep building momentum!
            </p>

            {/* Quick nav pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-border-default hover:border-orange-500/30 ${link.bg} ${link.color} transition-all duration-200 hover:scale-105 cursor-pointer`}>
                    <link.icon className="h-3 w-3" />
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <Link to="/tasks">
              <Button size="xs" variant="outline">Add Task</Button>
            </Link>
            <Link to="/ai">
              <Button size="xs" variant="gradient" icon={HiOutlineLightningBolt}>AI Coach</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* ── 4 Stat Cards Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineCheckCircle}
          value={completedCount}
          label="Tasks Completed"
          sublabel={`${totalTasks} total tasks`}
          trend={4}
          color="lime"
          index={0}
        />
        <StatCard
          icon={HiOutlineFire}
          value={`${bestStreak}d`}
          label="Best Streak"
          sublabel="consecutive days"
          trend={bestStreak > 7 ? 12 : 0}
          color="amber"
          index={1}
        />
        <StatCard
          icon={HiOutlineChartBar}
          value={`${productivityScore}%`}
          label="Completion Rate"
          sublabel="tasks done / total"
          trend={productivityScore > 50 ? 8 : -3}
          color="orange"
          index={2}
        />
        <StatCard
          icon={HiOutlineChip}
          value={`${activeGoals}`}
          label="Active Goals"
          sublabel={`${totalGoals} goals total`}
          color="violet"
          index={3}
        />
      </div>

      {/* ── Main 3-column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Radar + Habits */}
        <div className="lg:col-span-4 space-y-6">

          {/* Productivity Radar */}
          <Card className="flex flex-col items-center justify-center p-6 border border-white/[0.04] bg-surface-900/30 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 60%, rgba(168,85,247,0.07) 0%, transparent 65%)' }} />

            <div className="flex items-center gap-2.5 mb-5 select-none z-10">
              <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <HiOutlineLightningBolt className="h-4 w-4 text-violet-400" />
              </div>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Productivity Radar</h3>
            </div>

            <div className="relative mb-5 z-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-orange-500/8 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                {/* Track rings */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                {/* Progress arc */}
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#radarGrad)" strokeWidth="6.5"
                  strokeLinecap="round"
                  strokeDasharray={`${productivityScore * 2.64} ${100 * 2.64}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-text-primary">{productivityScore}%</span>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5">Score</span>
              </div>
            </div>

            <div className="text-center z-10 w-full space-y-2">
              <p className="text-[11px] font-bold text-text-secondary">
                {completedCount} of {totalTasks} Tasks Completed
              </p>
              <div className="w-full bg-surface-800/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${productivityScore}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-lime-400 font-bold uppercase tracking-wider">
                <HiOutlineTrendingUp className="h-3 w-3" />
                <span>+4% vs last week</span>
              </div>
              <Button
                size="xs"
                variant="gradient"
                icon={HiOutlineSparkles}
                onClick={() => setIsAIModalOpen(true)}
                className="mt-3.5 w-full text-[10px] py-2 cursor-pointer font-bold"
              >
                AI Performance Audit
              </Button>
            </div>
          </Card>

          {/* Habits Checklist */}
          <Card className="p-5 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <HiOutlineFire className="h-4 w-4 text-amber-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Today's Habits</h3>
              </div>
              <Link to="/habits" className="text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider transition-colors">
                All →
              </Link>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
              {habits.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <HiOutlineFire className="h-8 w-8 text-text-muted mx-auto opacity-40" />
                  <p className="text-[11px] text-text-muted italic">No habits tracked yet.</p>
                  <Link to="/habits">
                    <Button size="xs" variant="outline" className="mt-1">Add your first habit</Button>
                  </Link>
                </div>
              ) : (
                habits.slice(0, 5).map((habit) => {
                  const isCompleted = habit.history?.includes(todayStr);
                  const streak = getStreak(habit);
                  return (
                    <div key={habit._id || habit.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-900/20 border border-white/[0.02] hover:bg-surface-800/30 transition-all group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base select-none">{habit.icon || '🌱'}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-primary truncate">{habit.name}</p>
                          <p className="text-[9px] text-text-muted mt-0.5 font-bold uppercase tracking-wider">
                            {streak > 0 ? `${streak}d streak 🔥` : 'Start today!'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleHabitCheckIn(habit._id || habit.id, todayStr)}
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-lime-500 border-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.3)]'
                            : 'border-text-muted/30 hover:border-orange-400/60 bg-surface-950/20'
                        }`}
                      >
                        {isCompleted && (
                          <svg className="h-3 w-3 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Center Column: Charts + Activity Feed */}
        <div className="lg:col-span-5 space-y-6">

          {/* Charts */}
          <Card className="p-5 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <HiOutlineChartBar className="h-4 w-4 text-orange-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Activity Telemetry</h3>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-bold text-text-muted uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-orange-500/40" />Total</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-orange-500" />Done</span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2 pl-1">Tasks — This Week</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskChartData} barGap={3} barCategoryGap="35%">
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={22} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                      <Bar dataKey="total" fill="rgba(255,255,255,0.04)" radius={[3, 3, 0, 0]} name="Total" />
                      <Bar dataKey="completed" fill="#ea580c" radius={[3, 3, 0, 0]} name="Done" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border-t border-white/[0.04] pt-4">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2 pl-1">Focus Hours — Daily Target: 4h</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={focusData}>
                      <defs>
                        <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={22} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={4} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="hours" stroke="#f59e0b" fill="url(#focusGrad)" strokeWidth={2} name="Focus hrs"
                        dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* Terminal Activity Feed */}
          <Card className="p-5 border border-white/[0.04] bg-surface-900/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-lime-500/10 border border-lime-500/20">
                  <HiOutlineLightningBolt className="h-4 w-4 text-lime-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Console Feed</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[9px] font-mono text-lime-400 font-bold uppercase">Live</span>
              </div>
            </div>

            {/* Terminal header bar */}
            <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-white/[0.04]">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-lime-500/70" />
              <span className="ml-2 text-[9px] font-mono text-text-muted">productivityos — activity.log</span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] leading-normal">
              {recentActivity.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-800/20 transition-colors group"
                >
                  <span className="text-text-muted/40 select-none shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-orange-400 select-none shrink-0">$</span>
                  <div className="flex-1 min-w-0 flex items-start gap-2 flex-wrap">
                    <span className={`font-extrabold shrink-0 ${activity.color}`}>[{activity.action}]</span>
                    <span className="text-text-secondary">{activity.detail}</span>
                  </div>
                  <span className="text-text-muted/50 whitespace-nowrap shrink-0">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Agenda + Wellness Telemetry */}
        <div className="lg:col-span-3 space-y-5">
          {/* Steps / Wellness Widget */}
          <StepsWidget />

          {/* Today's Agenda */}
          <Card className="p-5 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <HiOutlineCalendar className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Today</h3>
              </div>
              <Link to="/tasks" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors">
                Full →
              </Link>
            </div>

            <div className="space-y-2">
              {todayTasksList.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <HiOutlineCalendar className="h-8 w-8 text-text-muted mx-auto opacity-30" />
                  <p className="text-[11px] text-text-muted italic">No tasks for today.</p>
                  <Link to="/tasks">
                    <Button size="xs" variant="outline" className="mt-1">Schedule a task</Button>
                  </Link>
                </div>
              ) : (
                todayTasksList.map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-900/40 border border-white/[0.02] hover:bg-surface-800/30 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ring-2 ${
                        task.status === 'completed' ? 'bg-lime-400 ring-lime-400/20' :
                        task.status === 'in_progress' ? 'bg-orange-400 ring-orange-400/20' : 'bg-text-muted/40 ring-text-muted/10'
                      }`} />
                      <p className={`text-xs font-bold leading-tight flex-1 ${
                        task.status === 'completed' ? 'text-text-muted line-through font-normal' : 'text-text-primary'
                      }`}>
                        {task.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{task.category}</span>
                      <Badge color={priorityMap[task.priority]?.color || 'gray'} size="xs">
                        {task.priority?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>

      <ProductivityAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        stats={telemetryStats}
      />
    </motion.div>
  );
}
