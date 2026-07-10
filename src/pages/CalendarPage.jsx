import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineClock
} from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import { useGoals } from '../context/GoalContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import TaskModal from '../components/tasks/TaskModal';
import { formatDate } from '../utils/helpers';
import { PRIORITY } from '../utils/constants';

export default function CalendarPage() {
  const { tasks, createTask, toggleTaskStatus } = useTasks();
  const { goals } = useGoals();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(today.toISOString().split('T')[0]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper arrays
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Build grid items (blanks + days)
  const calendarDays = useMemo(() => {
    const blanks = Array.from({ length: firstDayIndex }, (_, i) => ({ type: 'blank', key: `blank-${i}` }));
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      return {
        type: 'day',
        dayNum,
        dateStr,
        key: `day-${dateStr}`,
      };
    });
    return [...blanks, ...days];
  }, [year, month, firstDayIndex, daysInMonth]);

  // Map dates to tasks/goals
  const dayData = useMemo(() => {
    const dataMap = {};

    tasks.forEach((task) => {
      if (task.dueDate) {
        if (!dataMap[task.dueDate]) {
          dataMap[task.dueDate] = { tasks: [], goals: [] };
        }
        dataMap[task.dueDate].tasks.push(task);
      }
    });

    goals.forEach((goal) => {
      if (goal.targetDate) {
        if (!dataMap[goal.targetDate]) {
          dataMap[goal.targetDate] = { tasks: [], goals: [] };
        }
        dataMap[goal.targetDate].goals.push(goal);
      }
    });

    return dataMap;
  }, [tasks, goals]);

  // Selected Day Items
  const selectedDayItems = useMemo(() => {
    return dayData[selectedDateStr] || { tasks: [], goals: [] };
  }, [dayData, selectedDateStr]);

  const handleCreateTaskSubmit = (data) => {
    createTask({
      ...data,
      dueDate: selectedDateStr,
    });
  };

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
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Calendar Planner</h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Schedule deadlines, inspect milestones, and align your goals visually.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <div className="flex items-center rounded-xl bg-surface-800/40 p-1 border border-white/[0.04]">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700/50 transition-colors"
            >
              <HiOutlineChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-700/50 transition-colors"
            >
              <HiOutlineChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Split Calendar & Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar View Card */}
        <Card className="lg:col-span-8 p-5 border border-white/[0.04]">
          {/* Month Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <HiOutlineCalendar className="h-5 w-5 text-primary-400" />
            <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">{monthName}</h2>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 border-b border-white/[0.04] pb-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-[11px] font-bold text-text-muted uppercase tracking-wider py-1 select-none">
                {day}
              </div>
            ))}
          </div>

          {/* Monthly grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {calendarDays.map((day, index) => {
              if (day.type === 'blank') {
                return <div key={day.key} className="aspect-square bg-transparent rounded-xl" />;
              }

              const { dayNum, dateStr } = day;
              const hasData = dayData[dateStr];
              const dayTasks = hasData?.tasks || [];
              const dayGoals = hasData?.goals || [];
              
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === today.toISOString().split('T')[0];

              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`aspect-square flex flex-col items-center justify-between p-1.5 rounded-2xl relative transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-500/20 border border-primary-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : isToday
                      ? 'bg-surface-800/80 border border-accent-500/40 text-text-primary'
                      : 'bg-surface-900/35 border border-white/[0.02] hover:bg-surface-800 hover:border-white/10'
                  }`}
                >
                  {/* Day Number */}
                  <span
                    className={`text-xs font-bold ${
                      isToday && !isSelected
                        ? 'text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full'
                        : isSelected
                        ? 'text-primary-350'
                        : 'text-text-secondary'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Micro Indicators */}
                  <div className="flex gap-1 items-center justify-center w-full min-h-[8px]">
                    {dayTasks.length > 0 && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full shadow-sm animate-pulse ${
                          dayTasks.every((t) => t.status === 'completed')
                            ? 'bg-emerald-400 shadow-emerald-400/55'
                            : 'bg-primary-400 shadow-primary-400/55'
                        }`}
                        title={`${dayTasks.length} Tasks`}
                      />
                    )}
                    {dayGoals.length > 0 && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/55"
                        title={`${dayGoals.length} Goals`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Agenda Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 border border-white/[0.04] bg-surface-900/40">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3.5 mb-4">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Selected Day</p>
                <p className="text-sm font-bold text-text-primary mt-0.5">
                  {formatDate(selectedDateStr, { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <Button
                variant="outline"
                size="xs"
                icon={HiOutlinePlus}
                onClick={() => setIsTaskModalOpen(true)}
              >
                Add Task
              </Button>
            </div>

            {/* Agenda list */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {/* Due Tasks Section */}
              <div>
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 select-none">
                  Tasks Due ({selectedDayItems.tasks.length})
                </h3>
                {selectedDayItems.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayItems.tasks.map((task) => (
                      <div
                        key={task._id || task.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/30 border border-white/[0.02] group"
                      >
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => toggleTaskStatus(task._id || task.id)}
                          className="rounded border-white/10 text-primary-500 focus:ring-0 cursor-pointer focus:ring-offset-0 bg-surface-900"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold truncate transition-colors ${
                              task.status === 'completed'
                                ? 'line-through text-text-muted'
                                : 'text-text-primary'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] font-semibold text-text-muted">
                              {task.category}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-white/10" />
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider ${
                                task.priority === PRIORITY.HIGH
                                  ? 'text-danger-400'
                                  : task.priority === PRIORITY.MEDIUM
                                  ? 'text-warning-400'
                                  : 'text-accent-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic py-1 pl-1 select-none">No tasks due today.</p>
                )}
              </div>

              {/* Goal Targets Section */}
              <div className="pt-2 border-t border-white/[0.04]">
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 select-none">
                  Goal Targets ({selectedDayItems.goals.length})
                </h3>
                {selectedDayItems.goals.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayItems.goals.map((goal) => {
                      const completedM = goal.milestones.filter(m => m.completed).length;
                      const totalM = goal.milestones.length;

                      return (
                        <div
                          key={goal._id || goal.id}
                          className="p-3 rounded-xl bg-surface-800/30 border border-white/[0.02]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-text-primary truncate">{goal.title}</p>
                            <span className="text-[9px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/15">
                              {goal.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-secondary mt-1 line-clamp-1">
                            {goal.description || 'No description.'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-[9px] font-semibold text-text-muted">
                            <HiOutlineClock className="h-3 w-3" />
                            <span>
                              {completedM}/{totalM} Milestones Done
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic py-1 pl-1 select-none">No goal target dates today.</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Task Modal for Scheduling */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={{ dueDate: selectedDateStr, title: '' }}
        onSubmit={handleCreateTaskSubmit}
      />
    </motion.div>
  );
}
