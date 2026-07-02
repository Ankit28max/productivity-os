export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/',
  TASKS: '/tasks',
  NOTES: '/notes',
  HABITS: '/habits',
  GOALS: '/goals',
  CALENDAR: '/calendar',
  POMODORO: '/pomodoro',
  ANALYTICS: '/analytics',
  AI: '/ai',
  SETTINGS: '/settings',
};

export const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const PRIORITY_COLORS = {
  [PRIORITY.HIGH]: {
    bg: 'bg-danger-500/15',
    text: 'text-danger-400',
    border: 'border-danger-500/30',
    dot: 'bg-danger-400',
  },
  [PRIORITY.MEDIUM]: {
    bg: 'bg-warning-500/15',
    text: 'text-warning-400',
    border: 'border-warning-500/30',
    dot: 'bg-warning-400',
  },
  [PRIORITY.LOW]: {
    bg: 'bg-accent-500/15',
    text: 'text-accent-400',
    border: 'border-accent-500/30',
    dot: 'bg-accent-400',
  },
};

export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: {
    bg: 'bg-dark-700/50',
    text: 'text-text-secondary',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    bg: 'bg-primary-500/15',
    text: 'text-primary-400',
  },
  [TASK_STATUS.COMPLETED]: {
    bg: 'bg-accent-500/15',
    text: 'text-accent-400',
  },
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'HiOutlineHome' },
  { label: 'Tasks', path: ROUTES.TASKS, icon: 'HiOutlineClipboardList' },
  { label: 'Notes', path: ROUTES.NOTES, icon: 'HiOutlineDocumentText' },
  { label: 'Habits', path: ROUTES.HABITS, icon: 'HiOutlineRefresh' },
  { label: 'Goals', path: ROUTES.GOALS, icon: 'HiOutlineFlag' },
  { label: 'Calendar', path: ROUTES.CALENDAR, icon: 'HiOutlineCalendar' },
  { label: 'Pomodoro', path: ROUTES.POMODORO, icon: 'HiOutlineClock' },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: 'HiOutlineChartBar' },
  { label: 'AI Assistant', path: ROUTES.AI, icon: 'HiOutlineSparkles' },
];
