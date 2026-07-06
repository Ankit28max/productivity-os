import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load tasks from backend database
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/tasks');
      if (res.success && res.tasks) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchTasks]);

  const createTask = useCallback(async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      if (res.success && res.task) {
        setTasks((prev) => [res.task, ...prev]);
        toast.success('Task created successfully');
        return res.task;
      }
    } catch (err) {
      toast.error(err.message || 'Error creating task');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      if (res.success && res.task) {
        setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? res.task : t)));
        return res.task;
      }
    } catch (err) {
      toast.error(err.message || 'Error updating task');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id));
        toast.success('Task deleted successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting task');
      throw err;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id) => {
    const task = tasks.find((t) => t._id === id || t.id === id);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await updateTask(id, { status: newStatus });
      if (updated && newStatus === 'completed') {
        toast.success('Task completed! Keep it up');
      }
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
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
