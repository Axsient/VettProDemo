"use client";

import React, { useState, useEffect } from 'react';
import CurvedSidebar from '@/components/sidebar/CurvedSidebar';
import TopMenuBar from '@/components/layout/TopMenuBar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/lib/constants/design';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Remove preload class to enable transitions after hydration
    document.documentElement.classList.remove('preload');
    
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
      
      if (isMobileScreen) {
        // On mobile, sidebar should be closed by default
        setIsSidebarOpen(false);
      } else {
        // On desktop, sidebar should be open by default
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="flex h-screen overflow-hidden">
      <TopMenuBar isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
      <CurvedSidebar
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
        navItems={NAVIGATION_ITEMS}
        isMobile={isMobile}
      />
      {isMobile && isSidebarOpen && (
        <div className="mobile-overlay" onClick={handleSidebarToggle} />
      )}
      <div className={cn(
        "flex-1 flex flex-col overflow-auto text-dashboard-foreground main-content-area",
        // Ultra-minimal horizontal padding, reduced vertical padding
        "px-1 md:px-2 py-1",
        // Default responsive margin (matches TopMenuBar logic)
        "ml-0 md:ml-72",
        // Apply conditional positioning only for non-mobile (matches TopMenuBar)
        !isMobile && !isSidebarOpen && "md:ml-20",
        // Apply tight layout classes
        !isMobile && "main-content-tight",
        isMobile && "main-content-mobile",
        // Add smooth transition after mount
        mounted && "transition-[margin-left] duration-300 ease-in-out"
      )}>
        <div className="flex justify-between md:justify-start items-center w-full mb-2">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={handleSidebarToggle} className="glow-subtle-blue text-dashboard-foreground">
              <Menu />
            </Button>
          )}
        </div>
        <div className="flex-1 mt-2">
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout; 