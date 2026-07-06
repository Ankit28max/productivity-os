import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const HabitContext = createContext(null);

const STORAGE_KEY = 'productivityos_habits';

const DEFAULT_HABITS = [];

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch (err) {
        setHabits(DEFAULT_HABITS);
      }
    } else {
      setHabits(DEFAULT_HABITS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HABITS));
    }
    setIsLoading(false);
  }, []);

  const saveHabits = (newHabits) => {
    setHabits(newHabits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
  };

  const createHabit = useCallback((habitData) => {
    const newHabit = {
      id: `habit-${generateId()}`,
      name: habitData.name,
      icon: habitData.icon || '🎯',
      color: habitData.color || 'cyan',
      createdAt: new Date().toISOString(),
      history: [],
    };
    saveHabits([...habits, newHabit]);
    toast.success('Habit created successfully');
    return newHabit;
  }, [habits]);

  const deleteHabit = useCallback((id) => {
    const updatedHabits = habits.filter((h) => h.id !== id);
    saveHabits(updatedHabits);
    toast.success('Habit deleted');
  }, [habits]);

  const toggleHabitCheckIn = useCallback((id, dateStr) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const hasCheckedIn = habit.history.includes(dateStr);
        let newHistory;
        if (hasCheckedIn) {
          newHistory = habit.history.filter((d) => d !== dateStr);
        } else {
          newHistory = [...habit.history, dateStr];
          // Simple encouragement toast if checking in today
          if (dateStr === new Date().toISOString().split('T')[0]) {
            toast.success(`Check-in recorded for ${habit.name}! Keep it up`);
          }
        }
        return {
          ...habit,
          history: newHistory,
        };
      }
      return habit;
    });
    saveHabits(updatedHabits);
  }, [habits]);

  // Streak calculation helper (computes current consecutive streak backwards from today)
  const getStreak = useCallback((habit) => {
    const historySet = new Set(habit.history);
    let streak = 0;
    let checkDate = new Date();
    
    // Format helper to ignore local timezone issues when going backwards
    const toYmd = (date) => date.toISOString().split('T')[0];

    // If not checked in today, check if checked in yesterday. If not yesterday, streak is 0.
    let todayStr = toYmd(checkDate);
    if (!historySet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      todayStr = toYmd(checkDate);
      if (!historySet.has(todayStr)) {
        return 0;
      }
    }

    // Go backwards day by day to count the streak
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
