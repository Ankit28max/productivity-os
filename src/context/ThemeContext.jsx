import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'productivityos_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Default to dark mode if not specified
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  // Apply theme class to document element whenever it changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
