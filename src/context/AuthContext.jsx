import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
  id: 'user_001',
  name: 'Ankit',
  email: 'ankit@productivityos.dev',
  avatar: null,
  createdAt: new Date().toISOString(),
};

const AUTH_STORAGE_KEY = 'productivityos_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!email || !password) {
      setIsLoading(false);
      throw new Error('Email and password are required');
    }

    const emailPrefix = email.split('@')[0];
    const parsedName = emailPrefix
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const userData = { 
      ...MOCK_USER, 
      name: parsedName, 
      email 
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
    return userData;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      setIsLoading(false);
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

    const userData = { ...MOCK_USER, name, email };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
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
