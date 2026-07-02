import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PRIORITY, TASK_STATUS } from '../../utils/constants';

export default function TaskModal({ isOpen, onClose, task, onSubmit }) {
  const isEditMode = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when task or modal status changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          priority: task.priority || PRIORITY.MEDIUM,
          status: task.status || TASK_STATUS.PENDING,
          dueDate: task.dueDate || new Date().toISOString().split('T')[0],
          category: task.category || 'Work',
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: PRIORITY.MEDIUM,
          status: TASK_STATUS.PENDING,
          dueDate: new Date().toISOString().split('T')[0],
          category: 'Work',
        });
      }
    }
  }, [isOpen, task, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-1">
        {/* Title */}
        <Input
          label="Title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          {...register('title', {
            required: 'Task title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
          })}
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Description</label>
          <textarea
            rows={3}
            placeholder="Add some details or notes..."
            className="w-full rounded-xl glass-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-250 hover:border-white/12 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 resize-none"
            {...register('description')}
          />
        </div>

        {/* Priority & Status Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Priority</label>
            <select
              className="rounded-xl glass-input px-3.5 py-3 text-sm text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40"
              {...register('priority')}
            >
              <option value={PRIORITY.HIGH}>High</option>
              <option value={PRIORITY.MEDIUM}>Medium</option>
              <option value={PRIORITY.LOW}>Low</option>
            </select>
          </div>

          {/* Status (Only show when editing) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Status</label>
            <select
              disabled={!isEditMode}
              className="rounded-xl glass-input px-3.5 py-3 text-sm text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
              {...register('status')}
            >
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>

        {/* Category & Due Date Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <Input
            label="Category"
            placeholder="e.g. Work, Study, Health"
            error={errors.category?.message}
            {...register('category', {
              required: 'Category is required',
            })}
          />

          {/* Due Date */}
          <Input
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate', {
              required: 'Due date is required',
            })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.04] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
