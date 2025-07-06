"use client";

// CurvedSidebar component with Neumorphic Inverse Theme System
// Sidebar shows opposite theme to main app (light app = dark sidebar, dark app = light sidebar)
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CurvedSidebarProps, NavigationItem, IconName } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useInverseTheme } from '@/lib/hooks/useInverseTheme';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem: React.FC<{
  item: NavigationItem;
  isOpen: boolean;
  isMobile: boolean;
  openSubMenuId: string | null;
  onToggleSubMenu: (itemId: string) => void;
}> = ({ item, isOpen, isMobile, openSubMenuId, onToggleSubMenu }) => {
  const pathname = usePathname();
  const isSubMenuOpen = openSubMenuId === item.id;

  if (item.type === 'separator') {
    return <hr className="my-2 border-white/10" />;
  }

  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href || (hasChildren && item.children?.some(child => child.href === pathname));

  const handleToggleSubMenu = () => {
    onToggleSubMenu(item.id);
  };

  if (hasChildren) {
    return (
      <>
        <motion.button
          onClick={handleToggleSubMenu}
          aria-expanded={isSubMenuOpen}
          className={cn(
            'neumorphic-nav-item flex items-center w-full gap-3 px-3 py-2 mb-2',
            isActive && 'active',
            !isOpen && !isMobile ? 'justify-center' : 'justify-between'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className={cn('flex items-center gap-3', !isOpen && !isMobile && 'justify-center')}>
            <Icon name={item.icon as IconName} className="h-5 w-5 flex-shrink-0 neumorphic-text" />
            <span className={cn('text-sm font-medium transition-all duration-300 neumorphic-text', isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden')}>
              {item.title}
            </span>
          </div>
          {isOpen && (
            <motion.div
              animate={{ rotate: isSubMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 flex-shrink-0 neumorphic-text" />
            </motion.div>
          )}
        </motion.button>
        <AnimatePresence>
          {isSubMenuOpen && isOpen && (
            <motion.ul 
              className="pl-8 pt-1 space-y-2 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                opacity: { duration: 0.2 }
              }}
            >
              {item.children?.map((child, index) => (
                <motion.li 
                  key={child.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                >
                  <motion.div
                    whileHover={{ x: 4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={child.href || '#'}
                      aria-current={pathname === child.href ? 'page' : undefined}
                      className={cn(
                        'neumorphic-nav-item flex items-center gap-3 px-3 py-2 text-sm',
                        pathname === child.href && 'active'
                      )}
                    >
                      <Icon name={child.icon as IconName} className="h-4 w-4 neumorphic-text" />
                      <span className="neumorphic-text">{child.title}</span>
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={item.href || '#'}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'neumorphic-nav-item flex items-center gap-3 px-3 py-2 mb-2',
          isActive && 'active',
          !isOpen && !isMobile && 'justify-center'
        )}
      >
        <Icon name={item.icon as IconName} className="h-5 w-5 flex-shrink-0 neumorphic-text" />
        <span className={cn('text-sm font-medium transition-all duration-300 neumorphic-text', isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden')}>
          {item.title}
        </span>
      </Link>
    </motion.div>
  );
};

const CurvedSidebar: React.FC<CurvedSidebarProps> = ({
  isOpen,
  onToggle,
  navItems,
  isMobile,
}) => {
  const inverseTheme = useInverseTheme();
  const { theme } = useTheme();
  const [sidebarThemeMode, setSidebarThemeMode] = React.useState<'inverse' | 'match'>('inverse');
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);

  const handleToggleSubMenu = (itemId: string) => {
    setOpenSubMenuId(prevId => prevId === itemId ? null : itemId);
  };

  // Listen for sidebar theme mode changes
  React.useEffect(() => {
    const handleModeChange = () => {
      const mode = document.documentElement.getAttribute('data-sidebar-theme-mode') as 'inverse' | 'match' || 'inverse';
      setSidebarThemeMode(mode);
    };

    // Set initial mode
    handleModeChange();

    // Listen for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-sidebar-theme-mode') {
          handleModeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-sidebar-theme-mode']
    });

    return () => observer.disconnect();
  }, []);

  // Determine which theme to use
  const sidebarTheme = sidebarThemeMode === 'inverse' ? inverseTheme : theme;

  return (
    <>
      <aside
        className={cn(
          'sidebar-neumorphic-container transition-all duration-300 ease-in-out flex flex-col',
          // Apply selected theme (inverse or matching)
          sidebarTheme,
          // Desktop behavior
          !isMobile && (isOpen ? 'w-72' : 'w-20'),
          // Mobile behavior - always w-72 but use transform to hide/show
          isMobile && 'w-72',
          // Mobile specific classes for proper hide/show behavior
          isMobile && isOpen && 'mobile-sidebar-open',
          isMobile && !isOpen && 'mobile-sidebar-hidden'
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <div className={cn('neumorphic-header flex items-center mb-8 p-3', isOpen ? 'justify-between' : 'justify-center')}>
            {isOpen && (
              <div className="flex items-center gap-1 transition-all duration-300">
                <Image 
                  src="/vettpro-logo.svg" 
                  alt="VettPro Logo" 
                  width={60} 
                  height={60}
                  className="flex-shrink-0"
                />
                <h1 className="text-2xl font-bold neumorphic-text">
                  VettPro
                </h1>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggle} 
              className="neumorphic-toggle flex-shrink-0"
            >
              <ChevronLeft className={cn('transition-transform duration-300 w-4 h-4', !isMobile && !isOpen && 'rotate-180')} />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent" role="navigation" aria-label="Main Navigation">
            <ul className="space-y-2 pr-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <NavItem 
                    item={item} 
                    isOpen={isOpen} 
                    isMobile={isMobile ?? false}
                    openSubMenuId={openSubMenuId}
                    onToggleSubMenu={handleToggleSubMenu}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default CurvedSidebar; 