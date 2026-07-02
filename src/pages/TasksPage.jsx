import { motion } from 'framer-motion';
import { HiOutlineClipboardList } from 'react-icons/hi';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function TasksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Tasks</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage and organize your tasks</p>
        </div>
        <Button icon={HiOutlineClipboardList}>Add Task</Button>
      </div>
      <Card>
        <EmptyState
          icon={HiOutlineClipboardList}
          title="No tasks yet"
          description="Create your first task to get started with organizing your work."
          action={<Button icon={HiOutlineClipboardList}>Create Task</Button>}
        />
      </Card>
    </motion.div>
  );
}
