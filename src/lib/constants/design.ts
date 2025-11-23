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
  {
    id: '1',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    type: 'collapsible',
    children: [
      { id: '1.1', title: 'Overview', icon: 'PieChart', href: '/dashboard/overview', type: 'link' },
      { id: '1.2', title: 'Executive Dashboard', icon: 'Crown', href: '/executive-dashboard', type: 'link' },
      { id: '1.3', title: 'Operations Dashboard', icon: 'Command', href: '/dashboard/operations', type: 'link' },
      { id: '1.4', title: 'My Tasks & Approvals', icon: 'CheckSquare', href: '/dashboard/tasks-approvals', type: 'link' },
      { id: '1.5', title: 'UI Elements', icon: 'Palette', href: '/dashboard/ui-elements', type: 'link' },
    ],
  },
  {
    id: '2',
    title: 'Vetting Operations',
    icon: 'ShieldCheck',
    type: 'collapsible',
    children: [
      { id: '2.1', title: 'Initiate New Vetting', icon: 'PlusCircle', href: '/vetting/initiate', type: 'link' },
      { id: '2.2', title: 'Active Vetting Cases', icon: 'Activity', href: '/vetting/active-cases', type: 'link' },
      { id: '2.3', title: 'Consent Management', icon: 'FileSignature', href: '/vetting/consent-management', type: 'link' },
      { id: '2.4', title: 'Completed Vetting Reports', icon: 'FileCheck', href: '/vetting/completed-reports', type: 'link' },
      { id: '2.5', title: 'Scheduled & Recurring Checks', icon: 'Calendar', href: '/vetting/scheduled-checks', type: 'link' },
    ],
  },
  {
    id: '3',
    title: 'Supplier Management',
    icon: 'Building2',
    type: 'collapsible',
    children: [
      { id: '3.1', title: 'All Suppliers', icon: 'Building', href: '/suppliers/all-suppliers', type: 'link' },
      { id: '3.2', title: 'Add New Supplier', icon: 'PlusCircle', href: '/suppliers/add-new-supplier', type: 'link' },
      { id: '3.3', title: 'Supplier Risk Dashboard', icon: 'ShieldAlert', href: '/suppliers/supplier-risk-dashboard', type: 'link' },
    ],
  },
  {
    id: '4',
    title: 'RFP & Invoice Management',
    icon: 'FileText',
    type: 'collapsible',
    children: [
      { id: '4.1', title: 'RFP Dashboard', icon: 'BarChart3', href: '/rfp-invoice/rfp-dashboard', type: 'link' },
      { id: '4.2', title: 'Manage RFPs', icon: 'FolderOpen', href: '/rfp-invoice/manage-rfps', type: 'link' },
      { id: '4.3', title: 'Invoice DNA', icon: 'AlertTriangle', href: '/rfp-invoice/invoice-analysis', type: 'link' },
    ],
  },
  {
    id: '5',
    title: 'Field Operations',
    icon: 'MapPin',
    type: 'collapsible',
    children: [
      { id: '5.1', title: 'Dashboard', icon: 'LayoutDashboard', href: '/field-operations/dashboard', type: 'link' },
      { id: '5.2', title: 'Community Canvassing', icon: 'Users', href: '/field-operations/community-canvassing', type: 'link' },
      { id: '5.3', title: 'Business Location Verification', icon: 'MapPin', href: '/field-operations/business-location-verification', type: 'link' },
      { id: '5.4', title: 'Field Agent Management', icon: 'UserCheck', href: '/field-operations/agent-management', type: 'link' },
      { id: '5.5', title: 'Geofence Management', icon: 'MapPinned', href: '/field-operations/geofence-management', type: 'link' },
    ],
  },
  {
    id: '6',
    title: 'Reporting & Analytics',
    icon: 'TrendingUp',
    type: 'collapsible',
    children: [
      { id: '6.1', title: 'Standard Reports', icon: 'FileText', href: '/reporting/standard-reports', type: 'link' },
      { id: '6.2', title: 'Custom Report Builder', icon: 'FilePlus', href: '/reporting/custom-builder', type: 'link' },
      { id: '6.3', title: 'AI Insights Dashboard (LLM Driven)', icon: 'Brain', href: '/reporting/ai-insights', type: 'link' },
      { id: '6.4', title: 'Endleleni Financials (Verification Costs)', icon: 'DollarSign', href: '/reporting/endleleni-financials', type: 'link' },
    ],
  },
  {
    id: '7',
    title: 'Administration',
    icon: 'Settings',
    type: 'collapsible',
    children: [
      { id: '7.1', title: 'User Management', icon: 'Users', href: '/administration/user-management', type: 'link' },
      { id: '7.2', title: 'System Configuration', icon: 'Cog', href: '/administration/system-configuration', type: 'link' },
      { id: '7.3', title: 'Audit Logs', icon: 'FileSearch', href: '/administration/audit-logs', type: 'link' },
      { id: '7.4', title: 'Platform Health & Monitoring', icon: 'Activity', href: '/administration/platform-health', type: 'link' },
      { id: '7.5', title: 'Data Management', icon: 'Database', href: '/administration/data-management', type: 'link' },
    ],
  },
  {
    id: '8',
    title: 'Vetting Operations Command Center (v2)',
    icon: 'Command',
    type: 'collapsible',
    children: [
      { id: '8.1', title: 'Smart Vetting Canvas (Initiate)', icon: 'Sparkles', href: '/vetting-v2/smart-canvas', type: 'link' },
      { id: '8.2', title: 'Live Mission Board (Active Cases)', icon: 'MonitorSpeaker', href: '/vetting-v2/live-mission-board', type: 'link' },
      { id: '8.3', title: 'Consent Communications Hub', icon: 'MessageSquareHeart', href: '/vetting-v2/consent-hub', type: 'link' },
      { id: '8.4', title: 'Intelligence Library (Reports)', icon: 'Library', href: '/vetting-v2/intelligence-library', type: 'link' },
    ],
  },
  {
    id: '9',
    title: 'Help & Support',
    icon: 'HelpCircle',
    type: 'collapsible',
    children: [
      { id: '9.1', title: 'Knowledge Base / FAQs', icon: 'BookOpen', href: '/help/knowledge-base', type: 'link' },
      { id: '9.2', title: 'System Documentation', icon: 'Book', href: '/help/system-documentation', type: 'link' },
      { id: '9.3', title: 'Contact Support', icon: 'Mail', href: '/help/contact-support', type: 'link' },
      { id: '9.4', title: 'Release Notes', icon: 'GitBranch', href: '/help/release-notes', type: 'link' },
    ],
  },
]; 
