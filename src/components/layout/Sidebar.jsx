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
import Logo from '../ui/Logo';

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
      <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <Logo size="sm" showText={false} />
          <AnimatePresence>
            {(isOpen || isMobileOpen) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="font-bold text-[15px] text-text-primary whitespace-nowrap tracking-tight">
                  Productivity<span className="text-orange-500">OS</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isMobile && isMobileOpen && (
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        )}
        {!isMobile && (
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <HiOutlineChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-250',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <AnimatePresence>
              {(isOpen || isMobileOpen) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted"
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
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative',
                        isActive
                          ? 'bg-orange-500/10 text-orange-400 shadow-[inset_0_0_20px_rgba(234,88,12,0.05)]'
                          : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                          style={{
                            background: 'linear-gradient(180deg, #fb923c, #ea580c)',
                            boxShadow: '0 0 12px rgba(234, 88, 12, 0.7)',
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                          isActive ? 'text-orange-400' : 'text-text-muted group-hover:text-text-secondary'
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

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-white/[0.04] px-3 py-3 space-y-0.5">
        <NavLink
          to={ROUTES.SETTINGS}
          onClick={() => isMobile && closeMobile()}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
            location.pathname === ROUTES.SETTINGS
              ? 'bg-orange-500/10 text-orange-400'
              : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
          )}
        >
          <HiOutlineCog className="h-[18px] w-[18px] shrink-0 text-text-muted" />
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary hover:bg-red-500/8 hover:text-red-400 transition-all duration-200 w-full"
        >
          <HiOutlineLogout className="h-[18px] w-[18px] shrink-0 text-text-muted" />
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

        {/* Enhanced User card with XP bar */}
        <AnimatePresence>
          {(isOpen || isMobileOpen) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 px-3 py-3 rounded-xl glass-input space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <Avatar name={user?.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-bold text-text-primary truncate">{user?.name}</p>
                    <span className="text-[9px] font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-full leading-none">Lv.7</span>
                  </div>
                  <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                </div>
              </div>
              {/* XP Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">XP Progress</span>
                  <span className="text-[9px] font-bold text-orange-400">2,340 / 3,000</span>
                </div>
                <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: '78%',
                      background: 'linear-gradient(90deg, #f97316, #ea580c)',
                      boxShadow: '0 0 8px rgba(234,88,12,0.4)',
                    }}
                  />
                </div>
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
          animate={{ width: isOpen ? 260 : 72 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed top-0 left-0 h-screen glass-surface border-r border-white/[0.04] z-40 overflow-hidden"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[260px] glass-surface border-r border-white/[0.04] z-50 overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
