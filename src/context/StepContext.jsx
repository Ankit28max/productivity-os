import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const StepContext = createContext(null);

export function StepProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/steps');
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Error fetching step logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    } else {
      setLogs([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchLogs]);

  const logSteps = useCallback(async (count, target = 10000) => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const res = await api.post('/steps', {
        date: todayStr,
        count,
        target,
      });

      if (res.success && res.log) {
        setLogs((prev) => {
          // If today's log already exists in state, replace it. Otherwise, prepend it.
          const index = prev.findIndex((l) => l.date === todayStr);
          if (index > -1) {
            const updated = [...prev];
            updated[index] = res.log;
            return updated;
          }
          return [res.log, ...prev];
        });
        toast.success(`Steps logged: ${count.toLocaleString()}! 🚶`);
        return res.log;
      }
    } catch (err) {
      toast.error(err.message || 'Error saving steps');
      throw err;
    }
  }, []);

  // Helper selectors
  const getTodayLog = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return logs.find((l) => l.date === todayStr) || { count: 0, target: 10000 };
  }, [logs]);

  // Derived wellness stats
  const getWellnessMetrics = useCallback((count) => {
    const kcal = Math.round(count * 0.04); // ~0.04 kcal per step
    const distance = parseFloat((count * 0.00075).toFixed(2)); // ~0.75m per step, in km
    const time = Math.round(count * 0.008); // ~0.8 minutes per 100 steps
    return { kcal, distance, time };
  }, []);

  const value = {
    logs,
    isLoading,
    logSteps,
    getTodayLog,
    getWellnessMetrics,
    fetchLogs,
  };

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
}

export function useSteps() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useSteps must be used within a StepProvider');
  }
  return context;
}
