import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineTrash, HiOutlinePencilAlt, HiOutlineTag } from 'react-icons/hi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ConfettiBurst, { useConfetti } from '../animations/ConfettiBurst';
import { PRIORITY_COLORS, TASK_STATUS } from '../../utils/constants';
import { formatRelativeDate } from '../../utils/helpers';

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  const { fire, isActive } = useConfetti();

  const priorityMeta = PRIORITY_COLORS[task.priority] || {
    bg: 'bg-dark-700/50',
    text: 'text-text-secondary',
    border: 'border-border-default',
    dot: 'bg-text-tertiary',
  };

  const handleToggle = () => {
    if (!isCompleted) {
      fire(); // 🎉 confetti on completion
    }
    onToggle(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        className={`group transition-all duration-300 ${
          isCompleted ? 'opacity-65 border-white/[0.03]' : ''
        }`}
        glow={task.priority === 'high' && !isCompleted ? 'cyan' : undefined}
      >
        <div className="flex items-start gap-3">
          {/* Animated Checkbox */}
          <div className="relative">
            <motion.button
              onClick={handleToggle}
              whileTap={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`h-5 w-5 rounded-lg border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-accent-500 border-accent-500 shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                  : 'border-text-muted/40 hover:border-primary-500 hover:shadow-[0_0_8px_rgba(234,88,12,0.15)]'
              }`}
            >
              {isCompleted && (
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="h-3.5 w-3.5 text-dark-950 font-bold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </motion.svg>
              )}
            </motion.button>
            <ConfettiBurst active={isActive} />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold text-text-primary transition-all truncate ${
                isCompleted ? 'text-text-muted line-through font-normal' : ''
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p
                className={`text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed ${
                  isCompleted ? 'text-text-tertiary line-through' : ''
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Tags & Meta row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
              {/* Category */}
              {task.category && (
                <div className="flex items-center gap-1 text-[11px] text-text-muted font-medium bg-white/[0.02] border border-white/[0.03] px-2 py-0.5 rounded-lg">
                  <HiOutlineTag className="h-3 w-3" />
                  {task.category}
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-[11px] text-text-muted font-medium bg-white/[0.02] border border-white/[0.03] px-2 py-0.5 rounded-lg">
                  <HiOutlineCalendar className="h-3 w-3" />
                  {formatRelativeDate(task.dueDate)}
                </div>
              )}

              {/* Priority */}
              <Badge color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'emerald'} size="sm" dot>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Action buttons (Visible on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
              title="Edit Task"
            >
              <HiOutlinePencilAlt className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg hover:bg-danger-500/10 text-text-muted hover:text-danger-400 transition-colors"
              title="Delete Task"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
