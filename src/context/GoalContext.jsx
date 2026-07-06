import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const GoalContext = createContext(null);

const STORAGE_KEY = 'productivityos_goals';

const DEFAULT_GOALS = [];

export function GoalProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch (err) {
        setGoals(DEFAULT_GOALS);
      }
    } else {
      setGoals(DEFAULT_GOALS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GOALS));
    }
    setIsLoading(false);
  }, []);

  // Save to local storage
  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
  };

  const addGoal = useCallback((goalData) => {
    const newGoal = {
      id: `goal-${generateId()}`,
      title: goalData.title,
      description: goalData.description || '',
      category: goalData.category || 'General',
      targetDate: goalData.targetDate || new Date().toISOString().split('T')[0],
      milestones: goalData.milestones ? goalData.milestones.map(m => ({
        id: `milestone-${generateId()}-${Math.random().toString(36).slice(2, 5)}`,
        title: m.title,
        completed: m.completed || false
      })) : [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newGoal, ...goals];
    saveGoals(updated);
    toast.success('Goal set successfully!');
    return newGoal;
  }, [goals]);

  const updateGoal = useCallback((id, updates) => {
    const updated = goals.map((goal) => {
      if (goal.id === id) {
        return { ...goal, ...updates };
      }
      return goal;
    });
    saveGoals(updated);
    toast.success('Goal updated successfully');
  }, [goals]);

  const deleteGoal = useCallback((id) => {
    const updated = goals.filter((goal) => goal.id !== id);
    saveGoals(updated);
    toast.success('Goal deleted');
  }, [goals]);

  const toggleMilestone = useCallback((goalId, milestoneId) => {
    const updated = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((m) => {
          if (m.id === milestoneId) {
            const nextCompleted = !m.completed;
            if (nextCompleted) {
              toast.success(`Milestone completed: "${m.title}"`);
            }
            return { ...m, completed: nextCompleted };
          }
          return m;
        });

        // Check if all milestones are newly completed
        const wasAllCompleted = goal.milestones.every(m => m.completed);
        const isAllCompletedNow = updatedMilestones.every(m => m.completed);
        if (!wasAllCompleted && isAllCompletedNow) {
          toast.success(`Congratulations! You completed the goal: "${goal.title}" 🎉`, {
            duration: 5000,
            icon: '🏆',
          });
        }

        return { ...goal, milestones: updatedMilestones };
      }
      return goal;
    });
    saveGoals(updated);
  }, [goals]);

  const suggestMilestonesWithAI = useCallback(async (goalId, goalTitle, goalDescription) => {
    // Return placeholder milestone recommendations after a delay.
    // If Gemini key is loaded, we can fetch real milestones in Phase 6.
    // For now, let's generate contextual items based on keywords.
    return new Promise((resolve) => {
      setTimeout(() => {
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
        } else if (titleLower.includes('fitness') || titleLower.includes('run') || titleLower.includes('health') || titleLower.includes('gym')) {
          suggestions = [
            'Establish baseline fitness metrics & meal structure',
            'Log workout routines 3-4 times a week',
            'Increase intensity metrics by 10% weekly',
            'Consistently record sleep & hydration logs'
          ];
        } else if (titleLower.includes('code') || titleLower.includes('build') || titleLower.includes('app') || titleLower.includes('project')) {
          suggestions = [
            'Wireframe the visual UI flow and architecture layout',
            'Implement base context state and core functional modules',
            'Add robust validation and handle complex border case errors',
            'Deploy code to staging and verify build checks'
          ];
        } else if (titleLower.includes('money') || titleLower.includes('finance') || titleLower.includes('save') || titleLower.includes('invest')) {
          suggestions = [
            'Track all expenditures for a full week',
            'Define explicit monthly savings allocation budgets',
            'Set up automated monthly transfers to savings account',
            'Perform quarterly net worth and investment strategy review'
          ];
        }

        resolve(suggestions);
      }, 1000);
    });
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
