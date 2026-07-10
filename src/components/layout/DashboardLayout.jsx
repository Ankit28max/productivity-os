import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../../utils/cn';

const pageTransition = {
  initial: { opacity: 0, y: 12, scale: 0.998 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

export default function DashboardLayout() {
  const { isOpen, isMobile } = useSidebar();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-950 ambient-bg">
      <Sidebar />
      <Navbar />
      <main
        className={cn(
          'relative z-10 pt-16 min-h-screen transition-all duration-250',
          !isMobile && isOpen ? 'ml-[260px]' : !isMobile ? 'ml-[72px]' : 'ml-0'
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              {...pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
