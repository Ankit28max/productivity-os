import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineArrowRight,
  HiOutlineTrendingUp,
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
} from 'recharts';
import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/helpers';

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
  { action: 'Completed task', detail: 'Design system components', time: '2m ago', icon: HiOutlineCheckCircle, color: 'text-accent-400' },
  { action: 'Focus session', detail: '25 min Pomodoro', time: '15m ago', icon: HiOutlineClock, color: 'text-primary-400' },
  { action: 'New note', detail: 'Meeting notes – Q3 Planning', time: '1h ago', icon: HiOutlineClipboardList, color: 'text-secondary-400' },
  { action: 'Habit done', detail: 'Morning Exercise', time: '3h ago', icon: HiOutlineFire, color: 'text-warning-400' },
];

function HiOutlineCheckCircle(props) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const priorityMap = {
  high: { color: 'red', label: 'High' },
  medium: { color: 'amber', label: 'Medium' },
  low: { color: 'emerald', label: 'Low' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3.5 py-2.5">
      <p className="text-[11px] text-text-muted mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { habits, getStreak, toggleHabitCheckIn } = useHabits();

  // Dynamic calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completedCount = completedTasks.length;
  const productivityScore = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => getStreak(h))) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasksList = tasks
    .filter((t) => t.dueDate === todayStr)
    .slice(0, 4);

  const pendingTodayCount = todayTasksList.filter(t => t.status !== 'completed').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* Dynamic Console Banner */}
      <Card variant="neon" className="relative overflow-hidden p-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)' }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{getGreeting()}</span>
              <span className="h-1 w-1 rounded-full bg-primary-400" />
              <span className="text-[10px] font-bold text-primary-400 tracking-wider">SYSTEM ONLINE</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome to the cockpit, <span className="gradient-text">{user?.name}</span> ✨
            </h2>
            <p className="text-xs text-text-secondary max-w-xl mt-1 leading-relaxed">
              You have <span className="text-primary-300 font-bold">{pendingTodayCount} pending tasks</span> for today. 
              Your active streak is <span className="text-warning-400 font-bold">{bestStreak} days</span>. Keep building momentum!
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link to="/tasks">
              <Button size="xs" variant="outline">Tasks</Button>
            </Link>
            <Link to="/ai">
              <Button size="xs" variant="gradient" icon={HiOutlineLightningBolt}>AI Coach</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Main Asymmetrical Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Telemetry Column (Circular Radar + Habits List) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Concentric Telemetry Radar Block */}
          <Card className="flex flex-col items-center justify-center p-6 border border-white/[0.04] bg-surface-900/30 flex-1 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20 blur-[50px] bg-radial-gradient" 
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 60%)' }}
            />
            <div className="flex items-center gap-2.5 mb-5 select-none z-10">
              <div className="p-1.5 rounded-lg bg-secondary-500/10 border border-secondary-500/20">
                <HiOutlineLightningBolt className="h-4 w-4 text-secondary-400" />
              </div>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Productivity Radar</h3>
            </div>

            <div className="relative mb-6 z-10 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-primary-500/10 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
              
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                {/* Background loop */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5.5" />
                {/* Foreground speedometer ring */}
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#radarScoreGrad)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${productivityScore * 2.64} ${100 * 2.64}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="radarScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-text-primary">{productivityScore}%</span>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-1">Score</span>
              </div>
            </div>
            
            <div className="text-center z-10 select-none">
              <p className="text-[11px] font-bold text-text-secondary">
                {completedCount} of {totalTasks} Tasks Logged
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[9px] text-accent-400 font-bold uppercase tracking-wider">
                <HiOutlineTrendingUp className="h-3 w-3" />
                <span>+4% week-on-week increase</span>
              </div>
            </div>
          </Card>

          {/* Quick Habits Check List */}
          <Card className="p-5 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-warning-500/10 border border-warning-500/20">
                  <HiOutlineFire className="h-4 w-4 text-warning-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Habits Checklist</h3>
              </div>
              <Link to="/habits" className="text-[10px] text-primary-400 hover:text-primary-300 font-bold uppercase tracking-wider">
                Manage
              </Link>
            </div>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {habits.length === 0 ? (
                <p className="text-[11px] text-text-muted py-4 text-center italic select-none">No habits tracked yet.</p>
              ) : (
                habits.slice(0, 3).map((habit) => {
                  const isCompleted = habit.history.includes(todayStr);
                  const streak = getStreak(habit);

                  return (
                    <div key={habit.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-900/20 border border-white/[0.02] hover:bg-surface-800/20 transition-all">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base select-none">{habit.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-primary truncate">{habit.name}</p>
                          <p className="text-[9px] text-text-muted mt-0.5 font-bold uppercase tracking-wider">{streak} day streak 🔥</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleHabitCheckIn(habit.id, todayStr)}
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-accent-500 border-accent-500 shadow-[0_0_10px_rgba(132,204,22,0.25)]'
                            : 'border-text-muted/40 hover:border-text-secondary bg-surface-950/20'
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

        {/* Center Grid Column (Telemetry Graphs & Activity terminal logs) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Charts container */}
          <Card className="p-5 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <HiOutlineChartBar className="h-4 w-4 text-primary-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Activity Telemetry</h3>
              </div>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">weekly logs</span>
            </div>

            <div className="space-y-6">
              {/* Tasks Bar Chart */}
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 pl-1">Tasks Completed</p>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskChartData} barGap={4}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={25} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                      <Bar dataKey="total" fill="rgba(255,255,255,0.03)" radius={[4, 4, 4, 4]} name="Total" />
                      <Bar dataKey="completed" fill="#06b6d4" radius={[4, 4, 4, 4]} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Focus Area Chart */}
              <div className="border-t border-white/[0.04] pt-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 pl-1">Focus Session Hours</p>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={focusData}>
                      <defs>
                        <linearGradient id="dashFocusGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a3e635" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={25} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="hours" stroke="#a3e635" fill="url(#dashFocusGrad)" strokeWidth={2} name="Focus Hours" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* Terminal Style Activity Logs */}
          <Card className="p-5 border border-white/[0.04] bg-surface-900/35">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-secondary-500/10 border border-secondary-500/20">
                  <HiOutlineLightningBolt className="h-4 w-4 text-secondary-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Console Activity logs</h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="System Connected" />
            </div>

            <div className="space-y-1.5 font-mono text-[10px] text-text-secondary leading-normal">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-950/20 border border-white/[0.01]">
                  <span className="text-primary-400 select-none">&gt;</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-text-primary">{activity.action}: </span>
                    <span>{activity.detail}</span>
                  </div>
                  <span className="text-text-muted whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Agenda Grid Column (Today's Pending Tasks + Performance Metrics) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Today's Agenda Checklist */}
          <Card className="p-5 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <HiOutlineCalendar className="h-4 w-4 text-primary-400" />
                </div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Today&apos;s Agenda</h3>
              </div>
              <Link to="/tasks" className="text-[10px] text-primary-400 hover:text-primary-300 font-bold uppercase tracking-wider">
                Full List
              </Link>
            </div>

            <div className="space-y-2">
              {todayTasksList.length === 0 ? (
                <p className="text-[11px] text-text-muted py-6 text-center italic select-none">No tasks scheduled for today.</p>
              ) : (
                todayTasksList.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-2 p-3 rounded-xl bg-surface-900/40 border border-white/[0.02] hover:bg-surface-800/35 transition-all group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ring-2 ${
                        task.status === 'completed' ? 'bg-accent-400 ring-accent-400/20' :
                        task.status === 'in_progress' ? 'bg-primary-400 ring-primary-400/20' : 'bg-text-muted ring-text-muted/20'
                      }`} />
                      <p className={`text-xs font-bold leading-normal truncate ${
                        task.status === 'completed' ? 'text-text-muted line-through font-normal' : 'text-text-primary'
                      }`}>
                        {task.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-1 border-t border-white/[0.02] pt-2">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{task.category}</span>
                      <Badge color={priorityMap[task.priority]?.color || 'gray'} size="xs">
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Stats Telemetry Panels */}
          <div className="space-y-4">
            {/* Streak card */}
            <Card hover className="p-4 border border-white/[0.04] bg-surface-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-warning-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold text-warning-400">{bestStreak} Days</p>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-1">Best Active Streak</p>
                </div>
                <div className="p-2.5 rounded-xl bg-warning-500/10 border border-warning-500/20 text-warning-400">
                  <HiOutlineFire className="h-5 w-5" />
                </div>
              </div>
            </Card>

            {/* Deep work logs */}
            <Card hover className="p-4 border border-white/[0.04] bg-surface-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold text-accent-400">18.5 hrs</p>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-1">Focus Duration</p>
                </div>
                <div className="p-2.5 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
                  <HiOutlineClock className="h-5 w-5" />
                </div>
              </div>
            </Card>

            {/* Overall Complete logs */}
            <Card hover className="p-4 border border-white/[0.04] bg-surface-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold text-primary-400">{completedCount}</p>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-1">Total Tasks Completed</p>
                </div>
                <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400">
                  <HiOutlineClipboardList className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
