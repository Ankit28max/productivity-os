import { motion } from 'framer-motion';
import { HiOutlineCalendar } from 'react-icons/hi';
import Card from '../components/ui/Card';

export default function CalendarPage() {
  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Calendar</h1>
          <p className="text-sm text-text-secondary mt-0.5">Plan your schedule and deadlines</p>
        </div>
      </div>
      <Card>
        <div className="flex items-center justify-center gap-2 mb-6">
          <HiOutlineCalendar className="h-5 w-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-text-primary">{monthName}</h2>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
              {day}
            </div>
          ))}
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const isToday = day === today.getDate();
            return (
              <button
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                  isToday
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
