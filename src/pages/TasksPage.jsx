import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineClipboardList } from 'react-icons/hi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { TASK_STATUS, PRIORITY } from '../utils/constants';

export default function TasksPage() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Derive unique categories from tasks
  const categories = useMemo(() => {
    const cats = tasks.map((task) => task.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [tasks]);

  // Handle Edit/Create Modal
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (selectedTask) {
      updateTask(selectedTask.id, formData);
    } else {
      createTask(formData);
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search Match
        const matchSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

        // Status Match
        const matchStatus = statusFilter === 'all' || task.status === statusFilter;

        // Priority Match
        const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        // Category Match
        const matchCategory = categoryFilter === 'all' || task.category === categoryFilter;

        return matchSearch && matchStatus && matchPriority && matchCategory;
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'dueDateAsc') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'dueDateDesc') {
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sortBy === 'createdAtDesc') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }

        // Priority sorting helper
        const priorityWeight = { [PRIORITY.HIGH]: 3, [PRIORITY.MEDIUM]: 2, [PRIORITY.LOW]: 1 };
        if (sortBy === 'priorityDesc') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'priorityAsc') {
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        }

        return 0;
      });
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter, sortBy]);

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
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Tasks</h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Manage your personal work, set priorities, and track execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Future AI integration button */}
          <Button variant="neon" size="sm" icon={HiOutlineSparkles} className="hidden sm:inline-flex">
            AI Task Planner
          </Button>
          <Button variant="gradient" size="sm" icon={HiOutlinePlus} onClick={handleOpenCreateModal}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm" variant="surface">
        <TaskFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </Card>

      {/* Task List Grid */}
      {isLoading ? (
        <div className="py-8">
          <SkeletonList count={4} />
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <Card variant="default" className="py-12">
          <EmptyState
            icon={HiOutlineClipboardList}
            title={search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' ? "No matching tasks" : "All clean!"}
            description={
              search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                ? "Try adjusting your filters or search query to find what you're looking for."
                : "You don't have any tasks scheduled. Click 'Add Task' to create one."
            }
            action={
              search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setSortBy('dueDateAsc');
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button variant="gradient" icon={HiOutlinePlus} onClick={handleOpenCreateModal}>
                  Create Task
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={deleteTask}
                onToggle={toggleTaskStatus}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create/Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSubmit={handleModalSubmit}
      />
    </motion.div>
  );
}
