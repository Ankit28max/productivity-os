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
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
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

const todayTasks = [
  { id: 1, title: 'Review project proposal', priority: 'high', status: 'in_progress', time: '9:00 AM' },
  { id: 2, title: 'Update design system docs', priority: 'medium', status: 'pending', time: '11:00 AM' },
  { id: 3, title: 'Team standup meeting', priority: 'high', status: 'completed', time: '2:00 PM' },
  { id: 4, title: 'Code review: Auth module', priority: 'medium', status: 'pending', time: '4:00 PM' },
];

const habits = [
  { name: 'Morning Exercise', streak: 12, completed: true, icon: '🏃' },
  { name: 'Read 30 mins', streak: 8, completed: false, icon: '📚' },
  { name: 'Meditate', streak: 21, completed: true, icon: '🧘' },
  { name: 'Journal', streak: 5, completed: false, icon: '📝' },
];

const recentActivity = [
  { action: 'Completed task', detail: 'Design system components', time: '2 min ago', icon: HiOutlineCheckCircle, color: 'text-accent-400' },
  { action: 'Started focus session', detail: '25 min Pomodoro', time: '15 min ago', icon: HiOutlineClock, color: 'text-primary-400' },
  { action: 'Added note', detail: 'Meeting notes - Q3 Planning', time: '1 hour ago', icon: HiOutlineClipboardList, color: 'text-secondary-400' },
  { action: 'Habit checked', detail: 'Morning Exercise', time: '3 hours ago', icon: HiOutlineFire, color: 'text-warning-400' },
];

const priorityMap = {
  high: { color: 'red', label: 'High' },
  medium: { color: 'amber', label: 'Medium' },
  low: { color: 'emerald', label: 'Low' },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-800 border border-border-default rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Tasks Completed',
      value: '24',
      change: '+12%',
      positive: true,
      icon: HiOutlineClipboardList,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
    },
    {
      label: 'Active Streak',
      value: '12 days',
      change: '+3',
      positive: true,
      icon: HiOutlineFire,
      color: 'text-warning-400',
      bg: 'bg-warning-500/10',
    },
    {
      label: 'Focus Hours',
      value: '18.5h',
      change: '+2.5h',
      positive: true,
      icon: HiOutlineClock,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
    },
    {
      label: 'Productivity',
      value: '87%',
      change: '+5%',
      positive: true,
      icon: HiOutlineChartBar,
      color: 'text-secondary-400',
      bg: 'bg-secondary-500/10',
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Card */}
      <motion.div variants={fadeUp}>
        <Card variant="glass" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative">
            <p className="text-sm text-text-secondary mb-1">{getGreeting()}</p>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Welcome back, <span className="gradient-text">{user?.name}</span> 👋
            </h2>
            <p className="text-sm text-text-secondary max-w-lg">
              You have <span className="text-primary-400 font-medium">4 tasks</span> for today and a <span className="text-accent-400 font-medium">12-day streak</span> going. Keep up the great work!
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <Badge color={stat.positive ? 'emerald' : 'red'} size="sm">
                {stat.change}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiOutlineCalendar className="h-5 w-5 text-primary-400" />
                <h3 className="text-base font-semibold text-text-primary">Today&apos;s Tasks</h3>
              </div>
              <Link to="/tasks" className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                View All <HiOutlineArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-900/50 hover:bg-surface-700/50 transition-colors group"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${
                    task.status === 'completed' ? 'bg-accent-400' :
                    task.status === 'in_progress' ? 'bg-primary-400' : 'bg-dark-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      task.status === 'completed' ? 'text-text-tertiary line-through' : 'text-text-primary'
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-text-muted">{task.time}</p>
                  </div>
                  <Badge color={priorityMap[task.priority].color} size="sm">
                    {priorityMap[task.priority].label}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Habits */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiOutlineFire className="h-5 w-5 text-warning-400" />
                <h3 className="text-base font-semibold text-text-primary">Habits</h3>
              </div>
              <Link to="/habits" className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                View All <HiOutlineArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-900/50 transition-colors">
                  <span className="text-lg">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{habit.name}</p>
                    <p className="text-xs text-text-muted">{habit.streak} day streak</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    habit.completed
                      ? 'bg-accent-500 border-accent-500'
                      : 'border-dark-600'
                  }`}>
                    {habit.completed && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tasks Chart */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineChartBar className="h-5 w-5 text-primary-400" />
              <h3 className="text-base font-semibold text-text-primary">Weekly Task Completion</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskChartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="total" fill="#1e293b" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Focus Hours Chart */}
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineClock className="h-5 w-5 text-accent-400" />
              <h3 className="text-base font-semibold text-text-primary">Focus Hours</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={focusData}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="hours" stroke="#10b981" fill="url(#focusGradient)" strokeWidth={2} name="Hours" />
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
          <Card className="text-center">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <HiOutlineLightningBolt className="h-5 w-5 text-warning-400" />
              <h3 className="text-base font-semibold text-text-primary">Productivity Score</h3>
            </div>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#scoreGradient)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${87 * 2.64} ${100 * 2.64}`}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-2xl font-bold text-text-primary">87%</span>
            </div>
            <p className="text-xs text-text-secondary">+5% from last week</p>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineLightningBolt className="h-5 w-5 text-secondary-400" />
              <h3 className="text-base font-semibold text-text-primary">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <div className="mt-0.5">
                    <activity.icon className={`h-4.5 w-4.5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{activity.action}</p>
                    <p className="text-xs text-text-muted">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
