"use client";

import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

const SidebarThemeToggle: React.FC = () => {
  const [sidebarThemeMode, setSidebarThemeMode] = useState<'inverse' | 'match'>('inverse');
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sidebar-theme-mode');
    if (saved === 'match' || saved === 'inverse') {
      setSidebarThemeMode(saved);
    }
  }, []);

  // Apply the theme mode to document
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-sidebar-theme-mode', sidebarThemeMode);
    localStorage.setItem('sidebar-theme-mode', sidebarThemeMode);
  }, [sidebarThemeMode, mounted]);

  const toggleSidebarTheme = () => {
    setSidebarThemeMode(prev => prev === 'inverse' ? 'match' : 'inverse');
  };

  return (
    <button
      onClick={toggleSidebarTheme}
      className="neumorphic-topbar-button group relative"
      title={`Sidebar theme: ${sidebarThemeMode === 'inverse' ? 'Inverse' : 'Matching'} (click to toggle)`}
      aria-label={`Toggle sidebar theme mode. Currently: ${sidebarThemeMode}`}
    >
      <Layers 
        className="w-5 h-5 md:w-6 md:h-6 transition-all duration-200 group-hover:scale-110" 
      />
      
      {/* Small indicator showing current mode */}
      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-current">
        <div 
          className={`w-full h-full rounded-full transition-colors duration-200 ${
            sidebarThemeMode === 'inverse' 
              ? 'bg-purple-400' 
              : 'bg-green-400'
          }`}
        />
      </div>
    </button>
  );
};

export default SidebarThemeToggle; 