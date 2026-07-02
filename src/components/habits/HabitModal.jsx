import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EMOJIS = ['🏃', '📚', '🧘', '📝', '💧', '🥗', '☕', '🛌', '🚶', '🍏', '💪', '💻', '🎸'];

const COLORS = [
  { id: 'cyan', label: 'Cyan', bg: 'bg-primary-500' },
  { id: 'lime', label: 'Lime', bg: 'bg-accent-500' },
  { id: 'violet', label: 'Violet', bg: 'bg-secondary-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-warning-500' },
];

export default function HabitModal({ isOpen, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedEmoji = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        icon: EMOJIS[0],
        color: COLORS[0].id,
      });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Habit" size="md">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-1">
        {/* Name */}
        <Input
          label="Habit Name"
          placeholder="e.g. Drink 3L Water, Exercise"
          error={errors.name?.message}
          {...register('name', {
            required: 'Habit name is required',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters',
            },
          })}
        />

        {/* Emoji Icon Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Icon</label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl glass-input">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setValue('icon', emoji)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-primary-500/25 border border-primary-500/40 scale-105'
                    : 'bg-transparent border border-transparent hover:bg-white/[0.04]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Color Highlight</label>
          <div className="flex gap-3">
            {COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setValue('color', color.id)}
                className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                  selectedColor === color.id
                    ? 'border-white/40 scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-150'
                }`}
              >
                <div className={`h-5 w-5 rounded-lg ${color.bg}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.04] mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            Add Habit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
