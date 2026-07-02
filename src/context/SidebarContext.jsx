import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setIsMobileOpen(false);
      } else {
        setIsOpen(true);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [isMobile]);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const value = {
    isOpen,
    isMobile,
    isMobileOpen,
    toggle,
    closeMobile,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export default SidebarContext;
