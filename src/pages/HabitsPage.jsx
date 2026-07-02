import { motion } from 'framer-motion';
import { HiOutlineRefresh } from 'react-icons/hi';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function HabitsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Habits</h1>
          <p className="text-sm text-text-secondary mt-0.5">Build consistency with daily habits</p>
        </div>
        <Button icon={HiOutlineRefresh}>New Habit</Button>
      </div>
      <Card>
        <EmptyState
          icon={HiOutlineRefresh}
          title="No habits tracked"
          description="Start tracking your daily habits to build consistency and streaks."
          action={<Button icon={HiOutlineRefresh}>Add Habit</Button>}
        />
      </Card>
    </motion.div>
  );
}
