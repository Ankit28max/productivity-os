import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TASK_STATUS, PRIORITY } from '../utils/constants';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const STORAGE_KEY = 'productivityos_tasks';

const DEFAULT_TASKS = [
  {
    id: 't-1',
    title: 'Review project proposal',
    description: 'Go through the Q3 planning document and leave comments on requirements.',
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.IN_PROGRESS,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Work',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Update design system docs',
    description: 'Document the new Nebula glassmorphism theme components and color guidelines.',
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.PENDING,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Design',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Team standup meeting',
    description: 'Weekly sync with design and development teams.',
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.COMPLETED,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Work',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Code review: Auth module',
    description: 'Review the backend integration pull request for token refresh logic.',
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.PENDING,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    category: 'Development',
    createdAt: new Date().toISOString(),
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial tasks
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (err) {
        setTasks(DEFAULT_TASKS);
      }
    } else {
      setTasks(DEFAULT_TASKS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
    }
    setIsLoading(false);
  }, []);

  // Save tasks helper
  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const createTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${generateId()}`,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || PRIORITY.MEDIUM,
      status: taskData.status || TASK_STATUS.PENDING,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      category: taskData.category || 'General',
      createdAt: new Date().toISOString(),
    };

    saveTasks([newTask, ...tasks]);
    toast.success('Task created successfully');
    return newTask;
  }, [tasks]);

  const updateTask = useCallback((id, updates) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const merged = { ...task, ...updates };
        if (updates.status === TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.COMPLETED) {
          toast.success('Task completed! Keep it up');
        }
        return merged;
      }
      return task;
    });
    saveTasks(updatedTasks);
  }, [tasks]);

  const deleteTask = useCallback((id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
    toast.success('Task deleted successfully');
  }, [tasks]);

  const toggleTaskStatus = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus =
      task.status === TASK_STATUS.COMPLETED
        ? TASK_STATUS.PENDING
        : TASK_STATUS.COMPLETED;

    updateTask(id, { status: newStatus });
  }, [tasks, updateTask]);

  const value = {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
