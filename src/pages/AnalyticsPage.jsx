import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineFlag
} from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import { useGoals } from '../context/GoalContext';
import Card from '../components/ui/Card';

// Seeded mock data for focus session history
const focusSessionData = [
  { day: 'Mon', hours: 2.5, sessions: 6 },
  { day: 'Tue', hours: 3.5, sessions: 8 },
  { day: 'Wed', hours: 1.5, sessions: 3 },
  { day: 'Thu', hours: 4.5, sessions: 10 },
  { day: 'Fri', hours: 5.0, sessions: 12 },
  { day: 'Sat', hours: 3.0, sessions: 7 },
  { day: 'Sun', hours: 4.0, sessions: 9 },
];

const COLORS = {
  high: '#f43f5e', // red
  medium: '#f59e0b', // amber
  low: '#84cc16', // lime
  primary: '#06b6d4', // cyan
  accent: '#a855f7', // violet
  gray: '#64748b' // slate
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-2xl px-4 py-3 border border-white/10 shadow-xl bg-surface-900/90 backdrop-blur-md">
      <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-text-secondary font-medium">{entry.name}:</span>
          <span className="text-xs font-bold text-text-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { goals } = useGoals();

  // 1. Task Metrics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority Distribution
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => {
      if (priorities[t.priority] !== undefined) {
        priorities[t.priority]++;
      }
    });

    const pieData = [
      { name: 'High Priority', value: priorities.high, color: COLORS.high },
      { name: 'Medium Priority', value: priorities.medium, color: COLORS.medium },
      { name: 'Low Priority', value: priorities.low, color: COLORS.low }
    ].filter(d => d.value > 0);

    return { total, completed, rate, pieData };
  }, [tasks]);

  // 2. Habit Consistency Metrics
  const habitStats = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return { avgRate: 0, barData: [] };

    let totalCheckInRate = 0;
    const barData = habits.map((h) => {
      // Calculate last 7 days checkin percentage
      const checkInCount = h.history.length;
      // Seed a calculated rate of logs compared to total tracked days (e.g. 30 days window)
      // If history is empty, show 0. Otherwise calculate rate.
      const rate = Math.min(Math.round((checkInCount / 15) * 100), 100); // 15 checkins = 100% target
      totalCheckInRate += rate;

      return {
        name: h.name,
        emoji: h.icon || '🌱',
        'Consistency %': rate
      };
    });

    return {
      avgRate: Math.round(totalCheckInRate / totalHabits),
      barData
    };
  }, [habits]);

  // 3. Goal Milestones Completion
  const goalStats = useMemo(() => {
    const totalGoals = goals.length;
    if (totalGoals === 0) return { totalMilestones: 0, completedMilestones: 0, rate: 0, barData: [] };

    let totalMilestones = 0;
    let completedMilestones = 0;

    const barData = goals.map((g) => {
      const ms = g.milestones || [];
      const done = ms.filter(m => m.completed).length;
      totalMilestones += ms.length;
      completedMilestones += done;

      const pct = ms.length > 0 ? Math.round((done / ms.length) * 100) : 0;
      return {
        name: g.title.substring(0, 15) + (g.title.length > 15 ? '...' : ''),
        'Progress %': pct
      };
    });

    const rate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return { totalMilestones, completedMilestones, rate, barData };
  }, [goals]);

  // Focus Hour Metric sums
  const totalFocusHours = useMemo(() => {
    return focusSessionData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Productivity Analytics</h1>
        <p className="text-xs text-text-muted mt-0.5 font-medium">
          Deeper insights and visuals regarding tasks, habits, deep work sessions, and long-term milestones.
        </p>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card hover className="p-4 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400">
            <HiOutlineCheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{taskStats.rate}%</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
              Task Success Rate
            </p>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card hover className="p-4 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-warning-500/10 border border-warning-500/20 text-warning-400">
            <HiOutlineFire className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{habitStats.avgRate}%</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
              Habit Consistency
            </p>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card hover className="p-4 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
            <HiOutlineClock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{totalFocusHours} hrs</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
              Focus Duration
            </p>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card hover className="p-4 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <HiOutlineFlag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{goalStats.rate}%</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
              Goal Progress
            </p>
          </div>
        </Card>
      </div>

      {/* Grid: Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deep Work Trend (Area Chart) */}
        <Card className="lg:col-span-8 p-5 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Deep Work sessions</h2>
              <p className="text-[11px] text-text-muted mt-0.5">Hours logged using Pomodoro timer over the week</p>
            </div>
            <HiOutlineClock className="h-5 w-5 text-primary-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusSessionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Focus Hours"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFocus)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Spread (Pie Chart) */}
        <Card className="lg:col-span-4 p-5 border border-white/[0.04] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">Task Priority</h2>
            <p className="text-[11px] text-text-muted">Proportion of tasks sorted by priority levels</p>
          </div>
          
          <div className="h-52 w-full my-4 flex items-center justify-center">
            {taskStats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {taskStats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-text-muted italic select-none">No active tasks created yet</div>
            )}
          </div>

          <div className="flex justify-around items-center border-t border-white/[0.04] pt-4 mt-2">
            <div className="text-center">
              <span className="inline-block h-2 w-2 rounded-full bg-danger-500 mr-1.5" />
              <span className="text-[10px] text-text-secondary font-semibold">High</span>
            </div>
            <div className="text-center">
              <span className="inline-block h-2 w-2 rounded-full bg-warning-500 mr-1.5" />
              <span className="text-[10px] text-text-secondary font-semibold">Medium</span>
            </div>
            <div className="text-center">
              <span className="inline-block h-2 w-2 rounded-full bg-lime-500 mr-1.5" />
              <span className="text-[10px] text-text-secondary font-semibold">Low</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid: Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Consistency Detail (Bar Chart) */}
        <Card className="p-5 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Habit Consistency</h2>
              <p className="text-[11px] text-text-muted mt-0.5">Execution logs rate per habit</p>
            </div>
            <HiOutlineFire className="h-5 w-5 text-warning-400" />
          </div>
          <div className="h-64 w-full">
            {habitStats.barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitStats.barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Consistency %" fill={COLORS.accent} radius={[8, 8, 0, 0]}>
                    {habitStats.barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.accent} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-text-muted italic select-none">
                No habits established yet
              </div>
            )}
          </div>
        </Card>

        {/* Goals Progress Comparison (Bar Chart) */}
        <Card className="p-5 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Goal Execution</h2>
              <p className="text-[11px] text-text-muted mt-0.5">Progress based on completed milestones</p>
            </div>
            <HiOutlineFlag className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="h-64 w-full">
            {goalStats.barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalStats.barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Progress %" fill={COLORS.primary} radius={[8, 8, 0, 0]}>
                    {goalStats.barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-text-muted italic select-none">
                No active goals created yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
