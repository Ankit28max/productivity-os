import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../../utils/cn';

export default function DashboardLayout() {
  const { isOpen, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      <Navbar />
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-200',
          !isMobile && isOpen ? 'ml-[280px]' : !isMobile ? 'ml-[72px]' : 'ml-0'
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
