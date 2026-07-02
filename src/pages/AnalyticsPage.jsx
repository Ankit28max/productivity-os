import { motion } from 'framer-motion';
import { HiOutlineChartBar } from 'react-icons/hi';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-0.5">Track your productivity insights</p>
      </div>
      <Card>
        <EmptyState
          icon={HiOutlineChartBar}
          title="Analytics coming soon"
          description="Start completing tasks and tracking habits to see your productivity analytics here."
        />
      </Card>
    </motion.div>
  );
}
