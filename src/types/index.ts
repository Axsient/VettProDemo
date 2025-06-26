import { icons } from 'lucide-react';

// Core dashboard types for VETTPRO application
// Based on Consilio-style curved sidebar and Recehtok-style glow effects

export type IconName = keyof typeof icons;

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export interface CurvedSidebarProps extends SidebarProps {
  backgroundEffect?: 'glassmorphism' | 'solid';
  navItems: NavigationItem[];
  isMobile?: boolean;
}

export type NavigationItem = 
  | {
      id: string;
      title: string;
      icon: string;
      href: string;
      children?: never;
      type?: 'link';
    }
  | {
      id: string;
      title: string;
      icon: string;
      href?: string;
      children: NavigationItem[];
      type?: 'collapsible';
    }
  | {
      id?: string;
      type: 'separator';
      title?: never;
      icon?: never;
      href?: never;
      children?: never;
    };

export interface GlowEffectProps {
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  blur?: number;
  enabled?: boolean;
}

export interface GlassmorphismProps {
  opacity?: number;
  blur?: number;
  borderOpacity?: number;
  className?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    background: string; // Deep dark like #1A1D2B for Recehtok-style
    sidebar: string;
    accent: {
      blue: string;
      purple: string;
    };
  };
  effects: {
    glassmorphism: GlassmorphismProps;
    glow: GlowEffectProps;
  };
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  theme?: ThemeConfig;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  glowIntensity?: number; // For Recehtok-style glowing charts
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glassmorphic';
  glowEffect?: boolean;
}

export * from './supplier'; 