"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
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

  // Prevent hydration mismatch by only applying theme after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={cn(
        'topbar-neumorphic-container h-16 flex items-center justify-between px-6',
        // Only apply theme class after client mount to prevent hydration mismatch
        mounted && theme,
        // Adjust positioning based on sidebar state
        !isMobile && (isSidebarOpen ? 'ml-72' : 'ml-20'),
        // Full width on mobile
        isMobile && 'ml-0'
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