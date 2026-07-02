import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineSearch,
} from 'react-icons/hi';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/cn';

const pageTitles = {
  '/': 'Dashboard',
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

export default function Navbar() {
  const { toggle, isMobile, isOpen } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle = pageTitles[location.pathname] || 'ProductivityOS';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-border-default z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-200',
        !isMobile && isOpen ? 'left-[280px]' : !isMobile ? 'left-[72px]' : 'left-0'
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-surface-700 text-text-secondary hover:text-text-primary transition-colors"
          >
            <HiOutlineMenu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-lg hover:bg-surface-700 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <HiOutlineSearch className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-surface-700 text-text-tertiary hover:text-text-primary transition-colors relative">
          <HiOutlineBell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-dark-950" />
        </button>

        {/* User avatar */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded-lg hover:bg-surface-700 transition-colors"
          >
            <Avatar name={user?.name} size="sm" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-800 border border-border-default shadow-xl shadow-black/30 py-1.5 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-border-default">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-tertiary">{user?.email}</p>
              </div>
              <div className="py-1">
                <a href="/settings" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors">
                  Settings
                </a>
                <a href="/settings" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-700 hover:text-text-primary transition-colors">
                  Profile
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute left-0 right-0 top-full bg-surface-900 border-b border-border-default px-4 md:px-6 py-3 animate-slide-up">
          <div className="relative max-w-xl mx-auto">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search tasks, notes, habits..."
              autoFocus
              onBlur={() => setShowSearch(false)}
              className="w-full rounded-lg bg-surface-800 border border-border-default pl-9 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>
        </div>
      )}
    </header>
  );
}
