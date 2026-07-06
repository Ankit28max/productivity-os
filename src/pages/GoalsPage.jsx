import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineFlag,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { useGoals } from '../context/GoalContext';
import GoalModal from '../components/goals/GoalModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import ProgressBar from '../components/ui/ProgressBar';
import SearchBar from '../components/ui/SearchBar';
import Spinner from '../components/ui/Spinner';
import { formatRelativeDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function GoalsPage() {
  const {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    suggestMilestonesWithAI
  } = useGoals();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [aiGeneratingIds, setAiGeneratingIds] = useState({});

  // Unique categories list
  const categories = useMemo(() => {
    const list = new Set(goals.map((g) => g.category));
    return ['All', ...Array.from(list)];
  }, [goals]);

  // Statistics
  const stats = useMemo(() => {
    if (goals.length === 0) {
      return { total: 0, completed: 0, avgProgress: 0 };
    }

    let totalProgress = 0;
    let completedGoals = 0;

    goals.forEach((g) => {
      if (g.milestones.length === 0) {
        // A goal with no milestones is either 0% or 100% depending on setup. Let's treat as 0% progress unless completed.
        totalProgress += 0;
      } else {
        const completedCount = g.milestones.filter((m) => m.completed).length;
        const progress = Math.round((completedCount / g.milestones.length) * 100);
        totalProgress += progress;
        if (progress === 100) {
          completedGoals += 1;
        }
      }
    });

    return {
      total: goals.length,
      completed: completedGoals,
      avgProgress: Math.round(totalProgress / goals.length)
    };
  }, [goals]);

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch =
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || goal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [goals, searchQuery, selectedCategory]);

  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal, e) => {
    e.stopPropagation();
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data);
    } else {
      addGoal(data);
    }
  };

  const handleTriggerAI = async (goal, e) => {
    e.stopPropagation();
    setAiGeneratingIds((prev) => ({ ...prev, [goal.id]: true }));
    toast.loading('Generating tailored milestones...', { id: `ai-${goal.id}` });

    try {
      const suggestions = await suggestMilestonesWithAI(goal.id, goal.title, goal.description);
      
      // Formulate new milestones
      const currentMilestones = goal.milestones || [];
      const newMilestones = suggestions.map((s, idx) => ({
        id: `milestone-ai-${Date.now()}-${idx}`,
        title: s,
        completed: false
      }));

      // Merge suggested milestones
      updateGoal(goal.id, {
        milestones: [...currentMilestones, ...newMilestones]
      });

      toast.success('Successfully added AI-suggested milestones!', { id: `ai-${goal.id}` });
    } catch (error) {
      toast.error('AI suggestion failed. Please try again.', { id: `ai-${goal.id}` });
    } finally {
      setAiGeneratingIds((prev) => ({ ...prev, [goal.id]: false }));
    }
  };

  const getCategoryColor = (category) => {
    const map = {
      'Career': 'text-primary-400 bg-primary-500/10 border-primary-500/20',
      'Learning': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      'Health & Fitness': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      'Finance': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      'Personal': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    };
    return map[category] || 'text-text-secondary bg-white/5 border-white/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Goals & Milestones</h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Define long-term aspirations, break them down into milestones, and track execution.
          </p>
        </div>
        <Button variant="gradient" size="sm" icon={HiOutlineFlag} onClick={handleOpenCreateModal}>
          New Goal
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-primary-500/20 transition-all duration-300" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-400">{stats.total}</p>
              <p className="text-xs text-text-muted mt-1 font-medium">Total Goals</p>
            </div>
            <HiOutlineFlag className="h-8 w-8 text-primary-500/30" />
          </div>
        </Card>
        <Card className="hover:border-accent-500/20 transition-all duration-300" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-accent-400">{stats.avgProgress}%</p>
              <p className="text-xs text-text-muted mt-1 font-medium">Average Progress</p>
            </div>
            <HiOutlineCheckCircle className="h-8 w-8 text-accent-500/30" />
          </div>
        </Card>
        <Card className="hover:border-emerald-500/20 transition-all duration-300" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
              <p className="text-xs text-text-muted mt-1 font-medium">Completed Goals</p>
            </div>
            <HiOutlineCheckCircle className="h-8 w-8 text-emerald-500/30" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <SearchBar
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto py-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-primary-550 border-primary-500 text-white shadow-lg shadow-primary-500/10'
                  : 'bg-surface-800/40 border-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-surface-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      {/* Goals Display Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredGoals.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal) => {
              const milestones = goal.milestones || [];
              const completedCount = milestones.filter((m) => m.completed).length;
              const progressPercentage =
                milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    variant="default"
                    className="flex flex-col h-full hover:border-white/10 group relative border border-white/[0.04] overflow-hidden"
                  >
                    {/* Header Controls */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${getCategoryColor(
                            goal.category
                          )}`}
                        >
                          {goal.category}
                        </span>
                        <h3 className="text-base font-bold text-text-primary mt-2 group-hover:text-primary-300 transition-colors line-clamp-1">
                          {goal.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleOpenEditModal(goal, e)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-primary-400 hover:bg-surface-700/40 transition-colors"
                          title="Edit Goal"
                        >
                          <HiOutlinePencilAlt className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGoal(goal.id);
                          }}
                          className="p-1.5 rounded-lg text-text-muted hover:text-danger-400 hover:bg-surface-700/40 transition-colors"
                          title="Delete Goal"
                        >
                          <HiOutlineTrash className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-text-secondary leading-relaxed mb-4 flex-grow line-clamp-2">
                      {goal.description || 'No description provided.'}
                    </p>

                    {/* Progress details */}
                    <div className="space-y-2 mb-4 bg-surface-900/30 p-3 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-text-muted">Milestones Completed</span>
                        <span className="text-text-primary">
                          {completedCount}/{milestones.length}
                        </span>
                      </div>
                      <ProgressBar
                        value={progressPercentage}
                        color={progressPercentage === 100 ? 'accent' : 'primary'}
                        size="sm"
                      />
                    </div>

                    {/* Milestones list section */}
                    <div className="space-y-2 border-t border-white/[0.04] pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                          Key Milestones
                        </span>
                        <button
                          onClick={(e) => handleTriggerAI(goal, e)}
                          disabled={aiGeneratingIds[goal.id]}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-primary-400 hover:text-primary-300 disabled:text-text-muted transition-colors cursor-pointer"
                        >
                          {aiGeneratingIds[goal.id] ? (
                            <Spinner size="xs" />
                          ) : (
                            <HiOutlineSparkles className="h-3.5 w-3.5" />
                          )}
                          AI Suggest
                        </button>
                      </div>

                      {milestones.length > 0 ? (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1 pt-1">
                          {milestones.map((milestone) => (
                            <label
                              key={milestone.id}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-surface-800/20 cursor-pointer group/item select-none transition-colors border border-transparent hover:border-white/[0.02]"
                            >
                              <input
                                type="checkbox"
                                checked={milestone.completed}
                                onChange={() => toggleMilestone(goal.id, milestone.id)}
                                className="mt-0.5 rounded border-white/10 text-primary-500 focus:ring-0 cursor-pointer focus:ring-offset-0 bg-surface-900"
                              />
                              <span
                                className={`text-xs transition-colors ${
                                  milestone.completed
                                    ? 'line-through text-text-muted'
                                    : 'text-text-secondary group-hover/item:text-text-primary'
                                }`}
                              >
                                {milestone.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-text-muted italic py-1">
                          No milestones yet. Click AI Suggest or edit the goal to add some.
                        </p>
                      )}
                    </div>

                    {/* Footer Due Date */}
                    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/[0.03] text-[10px] text-text-muted font-semibold">
                      <HiOutlineCalendar className="h-3.5 w-3.5 text-text-muted" />
                      <span>Target: {formatRelativeDate(goal.targetDate)}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="py-12">
          <EmptyState
            icon={HiOutlineFlag}
            title="No goals match filters"
            description="Clear your search search query or create a new goal to get started."
            action={
              <Button icon={HiOutlineFlag} onClick={handleOpenCreateModal}>
                Set New Goal
              </Button>
            }
          />
        </Card>
      )}

      {/* Goal Modal Form */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={editingGoal}
        onSubmit={handleModalSubmit}
      />
    </motion.div>
  );
}
