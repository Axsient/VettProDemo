"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { FullScreenToggle } from '@/components/ui/FullScreenToggle';
import SidebarThemeToggle from '@/components/ui/SidebarThemeToggle';
import DynamicBreadcrumb from '@/components/layout/DynamicBreadcrumb';

interface TopMenuBarProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ isSidebarOpen, isMobile }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={cn(
        'topbar-neumorphic-container h-16 flex items-center justify-between px-6',
        // Apply theme class for proper neumorphic styling
        mounted && theme === 'light' ? 'light' : 'dark',
        // Use responsive classes to prevent hydration issues
        'ml-0 md:ml-72',
        // Apply conditional positioning only for non-mobile (will be handled by CSS after mount)
        !isMobile && !isSidebarOpen && 'md:ml-20'
      )}
    >
      {/* Left side - Breadcrumb */}
      <div className="flex items-center flex-1 min-w-0">
        <DynamicBreadcrumb />
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <SidebarThemeToggle />
        <ThemeSwitcher />
        <FullScreenToggle />
      </div>
    </div>
  );
};

export default TopMenuBar; 