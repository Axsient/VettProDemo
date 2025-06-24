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

  // Don't render responsive layout until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="flex h-screen">
        <TopMenuBar isSidebarOpen={true} isMobile={false} />
        <CurvedSidebar
          isOpen={true}
          onToggle={handleSidebarToggle}
          navItems={NAVIGATION_ITEMS}
          isMobile={false}
        />
        <div className="flex-1 flex flex-col overflow-auto text-dashboard-foreground px-1 md:px-2 py-1 pt-12 ml-72 main-content-tight">
          <div className="flex-1 mt-2">
            {children}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen">
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
        "flex-1 flex flex-col overflow-auto text-dashboard-foreground",
        // Ultra-minimal horizontal padding, reduced vertical padding
        "px-1 md:px-2 py-1",
        // Dramatically reduced top padding for fixed top menu bar
        "pt-12",
        // Adjust left margin based on sidebar state
        !isMobile && (isSidebarOpen ? "ml-72" : "ml-20"),
        // Apply tight layout classes
        !isMobile && "main-content-tight",
        isMobile && "ml-0 main-content-mobile"
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