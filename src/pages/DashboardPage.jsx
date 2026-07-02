import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
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

const habits = [
  { name: 'Morning Exercise', streak: 12, completed: true, icon: '🏃' },
  { name: 'Read 30 mins', streak: 8, completed: false, icon: '📚' },
  { name: 'Meditate', streak: 21, completed: true, icon: '🧘' },
  { name: 'Journal', streak: 5, completed: false, icon: '📝' },
];

const recentActivity = [
  { action: 'Completed task', detail: 'Design system components', time: '2m ago', icon: HiOutlineCheckCircle, color: 'text-accent-400' },
  { action: 'Focus session', detail: '25 min Pomodoro', time: '15m ago', icon: HiOutlineClock, color: 'text-primary-400' },
  { action: 'New note', detail: 'Meeting notes – Q3 Planning', time: '1h ago', icon: HiOutlineClipboardList, color: 'text-secondary-400' },
  { action: 'Habit done', detail: 'Morning Exercise', time: '3h ago', icon: HiOutlineFire, color: 'text-warning-400' },
];

const priorityMap = {
  high: { color: 'red', label: 'High' },
  medium: { color: 'amber', label: 'Medium' },
  low: { color: 'emerald', label: 'Low' },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
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

  // Dynamic calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completedCount = completedTasks.length;
  const productivityScore = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasksList = tasks
    .filter((t) => t.dueDate === todayStr)
    .slice(0, 4);

  const stats = [
    {
      label: 'Tasks Done',
      value: String(completedCount),
      change: `of ${totalTasks}`,
      positive: true,
      icon: HiOutlineClipboardList,
      color: 'text-primary-400',
      glowColor: 'rgba(6, 182, 212, 0.12)',
      borderGlow: 'hover:border-primary-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.06)]',
    },
    {
      label: 'Active Streak',
      value: '12 days',
      change: '+3',
      positive: true,
      icon: HiOutlineFire,
      color: 'text-warning-400',
      glowColor: 'rgba(251, 191, 36, 0.12)',
      borderGlow: 'hover:border-warning-500/20 hover:shadow-[0_0_30px_rgba(251,191,36,0.06)]',
    },
    {
      label: 'Focus Hours',
      value: '18.5h',
      change: '+2.5h',
      positive: true,
      icon: HiOutlineClock,
      color: 'text-accent-400',
      glowColor: 'rgba(163, 230, 53, 0.12)',
      borderGlow: 'hover:border-accent-500/20 hover:shadow-[0_0_30px_rgba(163,230,53,0.06)]',
    },
    {
      label: 'Productivity',
      value: `${productivityScore}%`,
      change: '+5%',
      positive: true,
      icon: HiOutlineTrendingUp,
      color: 'text-secondary-400',
      glowColor: 'rgba(192, 132, 252, 0.12)',
      borderGlow: 'hover:border-secondary-500/20 hover:shadow-[0_0_30px_rgba(192,132,252,0.06)]',
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1400px]"
    >
      {/* Welcome Card */}
      <motion.div variants={fadeUp}>
        <Card variant="neon" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)' }}
          />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-text-muted uppercase tracking-widest">{getGreeting()}</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Welcome back, <span className="gradient-text">{user?.name}</span> ✨
            </h2>
            <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
              You have <span className="text-primary-400 font-semibold">{todayTasksList.filter(t => t.status !== 'completed').length} pending tasks</span> for today and a
              <span className="text-warning-400 font-semibold"> 12-day streak</span> going.
              Keep crushing it!
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`transition-all duration-300 ${stat.borderGlow}`} hover>
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: stat.glowColor }}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-400">
                <HiOutlineTrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary tracking-tight">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1 font-medium">{stat.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>
                  <HiOutlineCalendar className="h-4 w-4 text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Tasks</h3>
              </div>
              <Link to="/tasks" className="text-[11px] text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors tracking-wide uppercase">
                View All <HiOutlineArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {todayTasksList.length === 0 ? (
                <p className="text-xs text-text-muted py-4 text-center">No tasks scheduled for today.</p>
              ) : (
                todayTasksList.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3.5 rounded-xl glass-input hover:bg-white/[0.04] transition-all duration-200 group cursor-pointer"
                  >
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ring-2 ${
                      task.status === 'completed' ? 'bg-accent-400 ring-accent-400/30' :
                      task.status === 'in_progress' ? 'bg-primary-400 ring-primary-400/30' : 'bg-text-muted ring-text-muted/30'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-text-muted">{task.dueDate}</p>
                    </div>
                    <Badge color={priorityMap[task.priority]?.color || 'gray'} size="sm">
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Habits */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(251, 191, 36, 0.12)' }}>
                  <HiOutlineFire className="h-4 w-4 text-warning-400" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">Habits</h3>
              </div>
              <Link to="/habits" className="text-[11px] text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors tracking-wide uppercase">
                View All <HiOutlineArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {habits.map((habit) => (
                <div key={habit.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <span className="text-lg">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{habit.name}</p>
                    <p className="text-[11px] text-text-muted">{habit.streak} day streak 🔥</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    habit.completed
                      ? 'bg-accent-500 border-accent-500 shadow-[0_0_10px_rgba(163,230,53,0.2)]'
                      : 'border-text-muted/40 hover:border-text-secondary'
                  }`}>
                    {habit.completed && (
                      <svg className="h-3 w-3 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tasks Chart */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>
                <HiOutlineChartBar className="h-4 w-4 text-primary-400" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Weekly Tasks</h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskChartData} barGap={4}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#5a5a7a', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a5a7a', fontSize: 11 }} width={30} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="total" fill="rgba(255,255,255,0.04)" radius={[6, 6, 6, 6]} name="Total" />
                  <Bar dataKey="completed" fill="#06b6d4" radius={[6, 6, 6, 6]} name="Done" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Focus Hours */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(163, 230, 53, 0.12)' }}>
                <HiOutlineClock className="h-4 w-4 text-accent-400" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Focus Hours</h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={focusData}>
                  <defs>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#5a5a7a', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a5a7a', fontSize: 11 }} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="hours" stroke="#a3e635" fill="url(#focusGrad)" strokeWidth={2.5} name="Hours" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Score */}
        <motion.div variants={fadeUp}>
          <Card className="flex flex-col items-center py-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(192, 132, 252, 0.12)' }}>
                <HiOutlineLightningBolt className="h-4 w-4 text-secondary-400" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Score</h3>
            </div>
            <div className="relative mb-4">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${productivityScore * 2.64} ${100 * 2.64}`}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.4))' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold gradient-text">{productivityScore}%</span>
              </div>
            </div>
            <p className="text-[11px] text-text-muted font-medium">+5% from last week</p>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(192, 132, 252, 0.12)' }}>
                <HiOutlineLightningBolt className="h-4 w-4 text-secondary-400" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
            </div>
            <div className="space-y-1">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="p-1.5 rounded-lg" style={{
                    background: activity.color === 'text-accent-400' ? 'rgba(163,230,53,0.1)' :
                      activity.color === 'text-primary-400' ? 'rgba(6,182,212,0.1)' :
                      activity.color === 'text-secondary-400' ? 'rgba(192,132,252,0.1)' : 'rgba(251,191,36,0.1)'
                  }}>
                    <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{activity.action}</p>
                    <p className="text-[11px] text-text-muted">{activity.detail}</p>
                  </div>
                  <span className="text-[11px] text-text-muted whitespace-nowrap font-medium">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
