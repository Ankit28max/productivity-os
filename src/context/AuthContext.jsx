import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'productivityos_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('productivityos_token');
      if (token) {
        try {
          const res = await api.get('/auth/user');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
          } else {
            // Clear invalid session
            localStorage.removeItem('productivityos_token');
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setUser(null);
          }
        } catch (err) {
          // Offline fallback
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              setUser(null);
            }
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.token) {
        localStorage.setItem('productivityos_token', res.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.success && res.token) {
        localStorage.setItem('productivityos_token', res.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('productivityos_token');
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
