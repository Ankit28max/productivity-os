import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSparkles } from 'react-icons/hi';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function GoalModal({ isOpen, onClose, goal, onSubmit }) {
  const isEditMode = !!goal;
  const [milestonesList, setMilestonesList] = useState([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when goal changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (goal) {
        reset({
          title: goal.title,
          description: goal.description || '',
          category: goal.category || 'General',
          targetDate: goal.targetDate || new Date().toISOString().split('T')[0],
        });
        setMilestonesList(goal.milestones || []);
      } else {
        reset({
          title: '',
          description: '',
          category: 'General',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
        });
        setMilestonesList([]);
      }
    }
  }, [isOpen, goal, reset]);

  const onAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestonesList([
      ...milestonesList,
      { id: `temp-${Date.now()}-${Math.random()}`, title: newMilestoneText.trim(), completed: false }
    ]);
    setNewMilestoneText('');
  };

  const onRemoveMilestone = (id) => {
    setMilestonesList(milestonesList.filter((m) => m.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddMilestone();
    }
  };

  const onFormSubmit = (data) => {
    // Pass everything back to page
    onSubmit({
      ...data,
      milestones: milestonesList.map(m => ({ title: m.title, completed: m.completed }))
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Goal' : 'Create New Goal'}
      size="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-1">
        {/* Title */}
        <Input
          label="Goal Title"
          placeholder="What is your main objective?"
          error={errors.title?.message}
          {...register('title', {
            required: 'Goal title is required',
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
            rows={2}
            placeholder="What does success look like?"
            className="w-full rounded-xl glass-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-250 hover:border-white/12 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 resize-none"
            {...register('description')}
          />
        </div>

        {/* Category & Target Date Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Category</label>
            <select
              className="rounded-xl glass-input px-3.5 py-3 text-sm text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40"
              {...register('category')}
            >
              <option value="General">General</option>
              <option value="Career">Career</option>
              <option value="Learning">Learning</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Finance">Finance</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <Input
            label="Target Date"
            type="date"
            error={errors.targetDate?.message}
            {...register('targetDate', {
              required: 'Target date is required',
            })}
          />
        </div>

        {/* Milestones Checklist Builder */}
        <div className="border-t border-white/[0.04] pt-4 mt-2">
          <label className="text-sm font-medium text-text-secondary block mb-2">
            Milestones (Sub-tasks)
          </label>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Complete basic tutorial"
              value={newMilestoneText}
              onChange={(e) => setNewMilestoneText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 rounded-xl glass-input px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-250 hover:border-white/12 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddMilestone}
              className="px-3"
            >
              <HiOutlinePlus className="h-5 w-5" />
            </Button>
          </div>

          {/* List of current milestones in modal */}
          {milestonesList.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {milestonesList.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-800/40 border border-white/[0.03] group"
                >
                  <span className="text-xs text-text-primary pl-1 truncate max-w-[85%]">
                    {m.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveMilestone(m.id)}
                    className="text-text-muted hover:text-danger-400 p-1 transition-colors"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted italic py-1 pl-1">
              No milestones added yet. Add a few above to track your progress percentage.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.04] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            {isEditMode ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
