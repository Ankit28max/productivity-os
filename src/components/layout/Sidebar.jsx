import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineRefresh,
  HiOutlineFlag,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineX,
} from 'react-icons/hi';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { cn } from '../../utils/cn';
import Avatar from '../ui/Avatar';

const iconMap = {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineRefresh,
  HiOutlineFlag,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineSparkles,
};

const navSections = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'HiOutlineHome' },
      { label: 'Tasks', path: ROUTES.TASKS, icon: 'HiOutlineClipboardList' },
      { label: 'Notes', path: ROUTES.NOTES, icon: 'HiOutlineDocumentText' },
      { label: 'Habits', path: ROUTES.HABITS, icon: 'HiOutlineRefresh' },
      { label: 'Goals', path: ROUTES.GOALS, icon: 'HiOutlineFlag' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Calendar', path: ROUTES.CALENDAR, icon: 'HiOutlineCalendar' },
      { label: 'Pomodoro', path: ROUTES.POMODORO, icon: 'HiOutlineClock' },
      { label: 'Analytics', path: ROUTES.ANALYTICS, icon: 'HiOutlineChartBar' },
      { label: 'AI Assistant', path: ROUTES.AI, icon: 'HiOutlineSparkles' },
    ],
  },
];

export default function Sidebar() {
  const { isOpen, isMobile, isMobileOpen, toggle, closeMobile } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <HiOutlineSparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <AnimatePresence>
            {(isOpen || isMobileOpen) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-base text-text-primary whitespace-nowrap overflow-hidden"
              >
                ProductivityOS
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {isMobile && isMobileOpen && (
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg hover:bg-surface-700 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        )}
        {!isMobile && (
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg hover:bg-surface-700 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <HiOutlineChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <AnimatePresence>
              {(isOpen || isMobileOpen) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => isMobile && closeMobile()}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                        isActive
                          ? 'bg-primary-600/15 text-primary-400'
                          : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-500"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-primary-400' : 'text-text-tertiary group-hover:text-text-secondary'
                        )}
                      />
                      <AnimatePresence>
                        {(isOpen || isMobileOpen) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section - User & Settings */}
      <div className="shrink-0 border-t border-border-default px-3 py-3 space-y-1">
        <NavLink
          to={ROUTES.SETTINGS}
          onClick={() => isMobile && closeMobile()}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            location.pathname === ROUTES.SETTINGS
              ? 'bg-primary-600/15 text-primary-400'
              : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
          )}
        >
          <HiOutlineCog className="h-5 w-5 shrink-0 text-text-tertiary" />
          <AnimatePresence>
            {(isOpen || isMobileOpen) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-danger-600/15 hover:text-danger-400 transition-all duration-200 w-full"
        >
          <HiOutlineLogout className="h-5 w-5 shrink-0 text-text-tertiary" />
          <AnimatePresence>
            {(isOpen || isMobileOpen) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User card */}
        <AnimatePresence>
          {(isOpen || isMobileOpen) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg bg-surface-800 border border-border-default"
            >
              <Avatar name={user?.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-text-tertiary truncate">
                  {user?.email}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          animate={{ width: isOpen ? 280 : 72 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed top-0 left-0 h-screen bg-surface-900 border-r border-border-default z-40 overflow-hidden"
        >
          {sidebarContent}
        </motion.aside>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[280px] bg-surface-900 border-r border-border-default z-50 overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
