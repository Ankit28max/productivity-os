import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineSearch,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBell,
} from 'react-icons/hi';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/cn';


const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/notes': 'Notes',
  '/habits': 'Habits',
  '/goals': 'Goals',
  '/calendar': 'Calendar',
  '/pomodoro': 'Pomodoro',
  '/analytics': 'Analytics',
  '/ai': 'AI Assistant',
  '/settings': 'Settings',
};

const pageDescriptions = {
  '/dashboard': 'Your productivity overview',
  '/tasks': 'Manage your work',
  '/notes': 'Capture ideas',
  '/habits': 'Build consistency',
  '/goals': 'Track progress',
  '/calendar': 'Plan your schedule',
  '/pomodoro': 'Deep focus mode',
  '/analytics': 'Insights & trends',
  '/ai': 'AI companion',
  '/settings': 'Preferences',
};

export default function Navbar() {
  const { toggle, isMobile, isOpen } = useSidebar();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [now, setNow] = useState(new Date());
  const dropdownRef = useRef(null);

  const pageTitle = pageTitles[location.pathname] || 'ProductivityOS';
  const pageDesc = pageDescriptions[location.pathname] || '';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });


  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-250',
        'bg-dark-950/60 backdrop-blur-xl border-b border-border-default',
        !isMobile && isOpen ? 'left-[260px]' : !isMobile ? 'left-[72px]' : 'left-0'
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggle}
            className="p-2 rounded-xl hover:bg-surface-700/30 text-text-secondary hover:text-text-primary transition-colors"
          >
            <HiOutlineMenu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold text-text-primary leading-tight">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-text-muted leading-tight">{pageDesc}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Live date/time */}
        <div className="hidden md:flex flex-col items-end mr-1">
          <span className="text-[11px] font-bold text-text-primary tabular-nums">{timeStr}</span>
          <span className="text-[9px] text-text-muted font-medium">{dateStr}</span>
        </div>

        <div className="w-px h-5 bg-border-default mx-1 hidden md:block" />

        {/* Search */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-xl hover:bg-surface-700/30 text-text-muted hover:text-text-primary transition-colors border border-transparent hover:border-border-default"
          title="Search (⌘K)"
        >
          <HiOutlineSearch className="h-[16px] w-[16px]" />
          <span className="hidden md:flex items-center gap-1 text-[10px] font-mono text-text-muted/60">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-700/50 border border-border-default text-[9px]">⌘K</kbd>
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-surface-700/30 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <HiOutlineSun className="h-[18px] w-[18px]" />
          ) : (
            <HiOutlineMoon className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border-default mx-1" />

        {/* User */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded-xl hover:bg-surface-700/30 transition-colors"
          >
            <Avatar name={user?.name} size="sm" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-card py-1.5 animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-border-default">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-[11px] text-text-muted">{user?.email}</p>
              </div>
              <div className="py-1">
                <a href="/settings" className="block px-4 py-2.5 text-[13px] text-text-secondary hover:bg-surface-700/30 hover:text-text-primary transition-colors">
                  Settings
                </a>
                <a href="/settings" className="block px-4 py-2.5 text-[13px] text-text-secondary hover:bg-surface-700/30 hover:text-text-primary transition-colors">
                  Profile
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute left-0 right-0 top-full glass border-b border-border-default px-4 md:px-6 py-3 animate-slide-up">
          <div className="relative max-w-xl mx-auto">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search tasks, notes, habits..."
              autoFocus
              onBlur={() => setShowSearch(false)}
              className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20"
            />
          </div>
        </div>
      )}
    </header>
  );
}
