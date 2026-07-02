import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

export default function AIPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">AI Assistant</h1>
        <p className="text-sm text-text-secondary mt-0.5">Your AI-powered productivity companion</p>
      </div>
      <Card>
        <EmptyState
          icon={HiOutlineSparkles}
          title="AI Assistant coming soon"
          description="Get AI-powered daily plans, task breakdowns, note summaries, and productivity insights — all powered by Gemini."
        />
      </Card>
    </motion.div>
  );
}
