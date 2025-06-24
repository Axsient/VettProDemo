"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Route mapping for better display names
const routeNames: Record<string, string> = {
  // Main sections
  'dashboard': 'Dashboard',
  'overview': 'Overview',
  'tasks-approvals': 'Tasks & Approvals',
  'ui-elements': 'UI Elements',
  
  // Vetting
  'vetting': 'Vetting',
  'initiate': 'Initiate Vetting',
  'active-cases': 'Active Cases',
  'completed-reports': 'Completed Reports',
  'consent-management': 'Consent Management',
  'scheduled-checks': 'Scheduled Checks',
  
  // Suppliers
  'suppliers': 'Suppliers',
  'all': 'All Suppliers',
  'add': 'Add Supplier',
  'risk-dashboard': 'Risk Dashboard',
  
  // RFP & Invoice
  'rfp-invoice': 'RFP & Invoice',
  'rfp-dashboard': 'RFP Dashboard',
  'manage-rfps': 'Manage RFPs',
  'invoice-analysis': 'Invoice Analysis',
  
  // Reporting
  'reporting': 'Reporting',
  'standard-reports': 'Standard Reports',
  'custom-builder': 'Custom Builder',
  'ai-insights': 'AI Insights',
  'endleleni-financials': 'Endleleni Financials',
  
  // Administration
  'administration': 'Administration',
  'user-management': 'User Management',
  'system-configuration': 'System Configuration',
  'audit-logs': 'Audit Logs',
  'data-management': 'Data Management',
  'platform-health': 'Platform Health',
  
  // Field Operations
  'field-operations': 'Field Operations',
  'map-overview': 'Map Overview',
  'verification-queue': 'Verification Queue',
  'submitted-verifications': 'Submitted Verifications',
  
  // Help
  'help': 'Help',
  'knowledge-base': 'Knowledge Base',
  'contact-support': 'Contact Support',
  'system-documentation': 'System Documentation',
  'release-notes': 'Release Notes',
  
  // Account
  'account': 'Account',
  
  // Individuals
  'individuals': 'Individuals',
  
  // Test
  'test': 'Test',
  'neumorphic': 'Neumorphic Demo'
};

interface BreadcrumbSegment {
  name: string;
  href: string;
  isLast: boolean;
}

const DynamicBreadcrumb: React.FC = () => {
  const pathname = usePathname();

  // Generate breadcrumb segments from the current path
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    // Remove leading slash and split by '/'
    const pathSegments = pathname.slice(1).split('/').filter(Boolean);
    
    // If we're on the homepage, return empty array (no breadcrumb needed)
    if (pathSegments.length === 0) {
      return [];
    }

    const breadcrumbs: BreadcrumbSegment[] = [];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        name: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumb if we're on the homepage
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb variant="neumorphic" className="flex items-center">
      <BreadcrumbList variant="neumorphic">
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink variant="neumorphic" asChild>
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && (
          <BreadcrumbSeparator variant="neumorphic" />
        )}

        {/* Dynamic breadcrumb items */}
        {breadcrumbs.map((breadcrumb) => (
          <React.Fragment key={breadcrumb.href}>
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage variant="neumorphic">
                  {breadcrumb.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink variant="neumorphic" asChild>
                  <Link href={breadcrumb.href}>
                    {breadcrumb.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            
            {!breadcrumb.isLast && (
              <BreadcrumbSeparator variant="neumorphic" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb; 