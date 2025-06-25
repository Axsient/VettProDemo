"use client";

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

// Base Tabs Root component
interface NeumorphicTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const NeumorphicTabsRoot = React.forwardRef<
  React.ElementRef<typeof Tabs.Root>,
  NeumorphicTabsProps
>(({ children, className, ...props }, ref) => (
  <Tabs.Root
    ref={ref}
    className={cn("neumorphic-tabs-root w-full", className)}
    {...props}
  >
    {children}
  </Tabs.Root>
));
NeumorphicTabsRoot.displayName = "NeumorphicTabs";

// Tabs List component (container for triggers)
interface NeumorphicTabsListProps {
  children: React.ReactNode;
  className?: string;
}

const NeumorphicTabsList = React.forwardRef<
  React.ElementRef<typeof Tabs.List>,
  NeumorphicTabsListProps
>(({ children, className, ...props }, ref) => (
  <Tabs.List
    ref={ref}
    className={cn(
      "neumorphic-tabs-list",
      "flex items-center justify-start gap-1",
      "p-1 mb-4",
      "bg-[var(--neumorphic-card)]",
      "border-b border-[var(--neumorphic-border)] border-opacity-20",
      "rounded-t-[var(--neumorphic-radius-lg)]",
      "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]",
      className
    )}
    {...props}
  >
    {children}
  </Tabs.List>
));
NeumorphicTabsList.displayName = "NeumorphicTabsList";

// Tabs Trigger component (individual tab buttons)
interface NeumorphicTabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

const NeumorphicTabsTrigger = React.forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  NeumorphicTabsTriggerProps
>(({ children, className, ...props }, ref) => (
  <Tabs.Trigger
    ref={ref}
    className={cn(
      "neumorphic-tabs-trigger",
      "relative px-4 py-2 text-sm font-medium",
      "rounded-[var(--neumorphic-radius-md)]",
      "transition-all duration-200 ease-out",
      "outline-none focus-visible:outline-none",
      
      // Inactive state (flat appearance)
      "text-[var(--neumorphic-text-secondary)]",
      "hover:text-[var(--neumorphic-text-primary)]",
      "hover:bg-[var(--neumorphic-button)] hover:bg-opacity-30",
      
      // Focus state
      "focus-visible:ring-2 focus-visible:ring-[var(--neumorphic-border)] focus-visible:ring-opacity-50",
      
      // Active state (elevated appearance)
      "data-[state=active]:text-[var(--neumorphic-text-primary)]",
      "data-[state=active]:bg-[var(--neumorphic-button)]",
      "data-[state=active]:shadow-[var(--neumorphic-shadow-convex)]",
      "data-[state=active]:border-b-2 data-[state=active]:border-[var(--neumorphic-border)]",
      "data-[state=active]:translate-y-[-1px]", // Slight lift effect
      
      // Disabled state
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-[var(--neumorphic-text-secondary)]",
      
      className
    )}
    {...props}
  >
    {children}
  </Tabs.Trigger>
));
NeumorphicTabsTrigger.displayName = "NeumorphicTabsTrigger";

// Tabs Content component
interface NeumorphicTabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const NeumorphicTabsContent = React.forwardRef<
  React.ElementRef<typeof Tabs.Content>,
  NeumorphicTabsContentProps
>(({ children, className, ...props }, ref) => (
  <Tabs.Content
    ref={ref}
    className={cn(
      "neumorphic-tabs-content",
      "outline-none focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-[var(--neumorphic-border)] focus-visible:ring-opacity-50",
      "rounded-b-[var(--neumorphic-radius-lg)]",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1",
      className
    )}
    {...props}
  >
    {children}
  </Tabs.Content>
));
NeumorphicTabsContent.displayName = "NeumorphicTabsContent";

// Compound component export
const NeumorphicTabs = Object.assign(NeumorphicTabsRoot, {
  List: NeumorphicTabsList,
  Trigger: NeumorphicTabsTrigger,
  Content: NeumorphicTabsContent,
});

export { NeumorphicTabs, NeumorphicTabsList, NeumorphicTabsTrigger, NeumorphicTabsContent };
export default NeumorphicTabs; 