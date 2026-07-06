import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const GoalContext = createContext(null);

const STORAGE_KEY = 'productivityos_goals';

const DEFAULT_GOALS = [
  {
    id: 'g-1',
    title: 'Launch ProductivityOS Portfolio',
    description: 'Complete and deploy ProductivityOS to showcase design systems, React, and Gemini AI integration.',
    category: 'Career',
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    milestones: [
      { id: 'm-1-1', title: 'Complete visual redesign and dashboard cards', completed: true },
      { id: 'm-1-2', title: 'Build interactive Calendar & Recharts Analytics page', completed: true },
      { id: 'm-1-3', title: 'Integrate live Gemini API chat features', completed: false },
      { id: 'm-1-4', title: 'Scaffold Node.js backend schemas & setup README documentation', completed: false }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g-2',
    title: 'Run a 10K Marathon',
    description: 'Train consistently to build stamina and run a full 10k marathon under 55 minutes.',
    category: 'Health & Fitness',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days from now
    milestones: [
      { id: 'm-2-1', title: 'Run 3km without walking or stopping', completed: true },
      { id: 'm-2-2', title: 'Complete a 5km run in under 26 minutes', completed: false },
      { id: 'm-2-3', title: 'Complete an 8km run at training pace', completed: false },
      { id: 'm-2-4', title: 'Full 10k run on race day', completed: false }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g-3',
    title: 'Learn advanced Next.js features',
    description: 'Master Server Actions, Parallel Routes, and React Server Components (RSC) architecture.',
    category: 'Learning',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
    milestones: [
      { id: 'm-3-1', title: 'Read React Server Component architecture spec', completed: true },
      { id: 'm-3-2', title: 'Build a full-stack App Router mock project', completed: false },
      { id: 'm-3-3', title: 'Deploy dynamic edge functions with serverless database logs', completed: false }
    ],
    createdAt: new Date().toISOString(),
  }
];

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
