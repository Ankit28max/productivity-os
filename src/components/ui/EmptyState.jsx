import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-surface-800 border border-border-default p-4">
          <Icon className="h-8 w-8 text-text-tertiary" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
