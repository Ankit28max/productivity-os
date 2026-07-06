import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { suggestMilestones } from '../services/ai.service';
import { useAuth } from './AuthContext';

const GoalContext = createContext(null);

export function GoalProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load goals from database
  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/goals');
      if (res.success && res.goals) {
        setGoals(res.goals);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    } else {
      setGoals([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchGoals]);

  const addGoal = useCallback(async (goalData) => {
    try {
      const res = await api.post('/goals', goalData);
      if (res.success && res.goal) {
        setGoals((prev) => [res.goal, ...prev]);
        toast.success('Goal created successfully');
        return res.goal;
      }
    } catch (err) {
      toast.error(err.message || 'Error creating goal');
      throw err;
    }
  }, []);

  const updateGoal = useCallback(async (id, updates) => {
    try {
      const res = await api.put(`/goals/${id}`, updates);
      if (res.success && res.goal) {
        setGoals((prev) => prev.map((g) => (g._id === id || g.id === id ? res.goal : g)));
        toast.success('Goal updated successfully');
        return res.goal;
      }
    } catch (err) {
      toast.error(err.message || 'Error updating goal');
      throw err;
    }
  }, []);

  const deleteGoal = useCallback(async (id) => {
    try {
      const res = await api.delete(`/goals/${id}`);
      if (res.success) {
        setGoals((prev) => prev.filter((g) => g._id !== id && g.id !== id));
        toast.success('Goal deleted');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting goal');
      throw err;
    }
  }, []);

  const toggleMilestone = useCallback(async (goalId, milestoneId) => {
    try {
      const res = await api.post(`/goals/${goalId}/milestone/${milestoneId}/toggle`);
      if (res.success && res.goal) {
        setGoals((prev) => prev.map((g) => (g._id === goalId || g.id === goalId ? res.goal : g)));
        
        const updatedGoal = res.goal;
        const milestone = updatedGoal.milestones.find((m) => m._id === milestoneId || m.id === milestoneId);
        if (milestone && milestone.completed) {
          toast.success(`Milestone completed: "${milestone.title}"`);
        }

        const isAllCompletedNow = updatedGoal.milestones.every(m => m.completed);
        if (isAllCompletedNow) {
          toast.success(`Congratulations! You completed the goal: "${updatedGoal.title}" 🎉`, {
            duration: 5000,
            icon: '🏆',
          });
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error toggling milestone');
      throw err;
    }
  }, []);

  const suggestMilestonesWithAI = useCallback(async (goalId, goalTitle, goalDescription) => {
    toast.loading('AI is analyzing your goal and building milestones...', { id: 'ai-milestone' });
    try {
      const suggestions = await suggestMilestones(goalTitle, goalDescription);
      toast.success('AI Milestone Suggestions Generated!', { id: 'ai-milestone' });
      return suggestions;
    } catch (error) {
      toast.error('Failed to generate AI Suggestions', { id: 'ai-milestone' });
      // Offline fallback
      const titleLower = goalTitle.toLowerCase();
      let suggestions = [
        'Deconstruct goals into actionable tasks',
        'Create a 30-day consistent plan',
        'Review progress weekly and adjust metrics'
      ];
      if (titleLower.includes('learn') || titleLower.includes('read') || titleLower.includes('study')) {
        suggestions = [
          'Gather key learning resources & documentation',
          'Spend 30 minutes daily practicing basic components',
          'Build a complete real-world project to solidify learnings',
          'Refactor code and write explanatory notes'
        ];
      }
      return suggestions;
    }
  }, []);

  const value = {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    suggestMilestonesWithAI
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}
