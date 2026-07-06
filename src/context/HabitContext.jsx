import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load habits from database
  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/habits');
      if (res.success && res.habits) {
        setHabits(res.habits);
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits();
    } else {
      setHabits([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchHabits]);

  const createHabit = useCallback(async (habitData) => {
    try {
      const res = await api.post('/habits', habitData);
      if (res.success && res.habit) {
        setHabits((prev) => [res.habit, ...prev]);
        toast.success('Habit created successfully');
        return res.habit;
      }
    } catch (err) {
      toast.error(err.message || 'Error creating habit');
      throw err;
    }
  }, []);

  const deleteHabit = useCallback(async (id) => {
    try {
      const res = await api.delete(`/habits/${id}`);
      if (res.success) {
        setHabits((prev) => prev.filter((h) => h._id !== id && h.id !== id));
        toast.success('Habit deleted successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting habit');
      throw err;
    }
  }, []);

  const toggleHabitCheckIn = useCallback(async (id, dateStr) => {
    try {
      const res = await api.post(`/habits/${id}/toggle`, { date: dateStr });
      if (res.success && res.habit) {
        setHabits((prev) => prev.map((h) => (h._id === id || h.id === id ? res.habit : h)));
        if (dateStr === new Date().toISOString().split('T')[0] && res.habit.history.includes(dateStr)) {
          toast.success(`Check-in recorded for ${res.habit.name}! Keep it up`);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error toggling check-in');
      throw err;
    }
  }, []);

  // Streak calculation helper
  const getStreak = useCallback((habit) => {
    if (!habit || !habit.history) return 0;
    const historySet = new Set(habit.history);
    let streak = 0;
    let checkDate = new Date();
    
    const toYmd = (date) => date.toISOString().split('T')[0];

    let todayStr = toYmd(checkDate);
    if (!historySet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      todayStr = toYmd(checkDate);
      if (!historySet.has(todayStr)) {
        return 0;
      }
    }

    while (historySet.has(toYmd(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  }, []);

  const value = {
    habits,
    isLoading,
    createHabit,
    deleteHabit,
    toggleHabitCheckIn,
    getStreak,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
