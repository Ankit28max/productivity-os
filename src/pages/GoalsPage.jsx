import { motion } from 'framer-motion';
import { HiOutlineFlag } from 'react-icons/hi';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function GoalsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Goals</h1>
          <p className="text-sm text-text-secondary mt-0.5">Set and track your long-term goals</p>
        </div>
        <Button icon={HiOutlineFlag}>New Goal</Button>
      </div>
      <Card>
        <EmptyState
          icon={HiOutlineFlag}
          title="No goals set"
          description="Define your goals and milestones to stay on track."
          action={<Button icon={HiOutlineFlag}>Set Goal</Button>}
        />
      </Card>
    </motion.div>
  );
}
