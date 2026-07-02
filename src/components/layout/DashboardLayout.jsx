import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../../utils/cn';

export default function DashboardLayout() {
  const { isOpen, isMobile } = useSidebar();

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
          <Outlet />
        </div>
      </main>
    </div>
  );
}
