import type { NavigationItem } from '@/types';

// Design constants for VETTPRO dashboard
// Based on Consilio-style_dashboard.png and Recehtok-style_dashboard.png

export const COLORS = {
  // Dark theme colors from Recehtok-style
  dark: {
    background: '#1A1D2B',
    sidebar: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
  },
  
  // Light theme colors
  light: {
    background: '#FFFFFF',
    sidebar: '#F8FAFC',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
  },
  
  // Accent colors for glow effects (Recehtok-style)
  accent: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    pink: '#EC4899',
  }
};

export const CURVED_SIDEBAR = {
  // SVG path for the curved shape from Consilio-style
  curvePath: 'M 0 0 L 240 0 Q 280 50 240 100 L 240 100vh L 0 100vh Z',
  curvePathForSVG: 'M1,0 H0.85 L1,0.2 V0.8 L0.85,1 H0 Z',
  width: 280,
  collapsedWidth: 80,
};

export const EFFECTS = {
  glassmorphism: {
    opacity: 0.1,
    blur: 12,
    borderOpacity: 0.2,
  },
  
  glow: {
    low: { blur: 2, spread: 1 },
    medium: { blur: 4, spread: 2 },
    high: { blur: 8, spread: 4 },
  }
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: '1', title: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard', type: 'link' },
  {
    id: '2',
    title: 'Vetting Center',
    icon: 'ShieldCheck',
    type: 'collapsible',
    children: [
      { id: '2.1', title: 'New Vetting Request', icon: 'PlusCircle', href: '/vetting/new', type: 'link' },
      { id: '2.2', title: 'Active Requests', icon: 'Loader', href: '/vetting/active', type: 'link' },
      { id: '2.3', title: 'Completed Vettings', icon: 'CheckCircle', href: '/vetting/completed', type: 'link' },
    ],
  },
  {
    id: '3',
    title: 'Suppliers',
    icon: 'Building2',
    type: 'collapsible',
    children: [
      { id: '3.1', title: 'Supplier List', icon: 'List', href: '/suppliers', type: 'link' },
      { id: '3.2', title: 'Add New Supplier', icon: 'PlusCircle', href: '/suppliers/add', type: 'link' },
    ],
  },
    {
    id: '4',
    title: 'Individuals',
    icon: 'Users',
    type: 'collapsible',
    children: [
      { id: '4.1', title: 'Individual List', icon: 'List', href: '/individuals', type: 'link' },
      { id: '4.2', title: 'Add New Individual', icon: 'PlusCircle', href: '/individuals/add', type: 'link' },
    ],
  },
  {
    id: '5',
    title: 'Reporting & Insights',
    icon: 'TrendingUp',
    type: 'collapsible',
    children: [
      { id: '5.1', title: 'Standard Reports', icon: 'FileText', href: '/reporting', type: 'link' },
      { id: '5.2', title: 'Generate Custom Report', icon: 'FilePlus', href: '/reporting/custom', type: 'link' },
      { id: '5.3', title: 'Risk Analytics Dashboard', icon: 'ShieldAlert', href: '/reporting/analytics', type: 'link' },
    ],
  },
  {
    id: '6',
    title: 'Field Operations',
    icon: 'Compass',
    type: 'collapsible',
    children: [
      { id: '6.1', title: 'Verification Dashboard', icon: 'Map', href: '/field-operations', type: 'link' },
      { id: '6.2', title: 'Assign New Verification Task', icon: 'ClipboardPlus', href: '/field-operations/assign', type: 'link' },
    ],
  },
  { type: 'separator', id: 'separator-1' },
  {
    id: '7',
    title: 'Administration',
    icon: 'Settings',
    type: 'collapsible',
    children: [
      { id: '7.1', title: 'User & Access Management', icon: 'Users', href: '/admin/users', type: 'link' },
      { id: '7.2', title: 'Vetting Configuration', icon: 'FileCog', href: '/admin/vetting-config', type: 'link' },
      { id: '7.3', title: 'System & Company Configuration', icon: 'Building', href: '/admin/system-config', type: 'link' },
      { id: '7.4', title: 'Billing & Subscription', icon: 'CreditCard', href: '/admin/billing', type: 'link' },
    ],
  },
  {
    id: '8',
    title: 'My Account',
    icon: 'User',
    type: 'collapsible',
    children: [
      { id: '8.1', title: 'Profile Settings', icon: 'Cog', href: '/account/profile', type: 'link' },
      { id: '8.2', title: 'Security', icon: 'Lock', href: '/account/security', type: 'link' },
      { id: '8.3', title: 'Notification Preferences', icon: 'Bell', href: '/account/notifications', type: 'link' },
    ],
  },
  {
    id: '9',
    title: 'Help Center',
    icon: 'HelpCircle',
    type: 'collapsible',
    children: [
      { id: '9.1', title: 'Knowledge Base & FAQs', icon: 'BookOpen', href: '/help/kb', type: 'link' },
      { id: '9.2', title: 'Contact Support', icon: 'Mail', href: '/help/support', type: 'link' },
    ],
  },
  { type: 'separator', id: 'separator-2' },
  {
    id: '10',
    title: 'Testing',
    icon: 'Beaker',
    type: 'collapsible',
    children: [
      { id: '10.1', title: 'Neumorphic UI', icon: 'Box', href: '/test/neumorphic', type: 'link' },
    ]
  },
]; 