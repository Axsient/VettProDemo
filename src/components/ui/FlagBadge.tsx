import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShieldAlert, BadgeCheck, Info } from 'lucide-react';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

interface FlagBadgeProps {
  severity: Severity;
  children: React.ReactNode;
  className?: string;
}

const severityConfig = {
  Critical: {
    icon: ShieldAlert,
    color: 'var(--neumorphic-severity-critical)',
    bgOpacity: 'bg-opacity-15',
  },
  High: {
    icon: AlertTriangle,
    color: 'var(--neumorphic-severity-high)',
    bgOpacity: 'bg-opacity-15',
  },
  Medium: {
    icon: Info,
    color: 'var(--neumorphic-severity-medium)',
    bgOpacity: 'bg-opacity-15',
  },
  Low: {
    icon: BadgeCheck,
    color: 'var(--neumorphic-severity-low)',
    bgOpacity: 'bg-opacity-15',
  },
};

const FlagBadge: React.FC<FlagBadgeProps> = ({ severity, children, className }) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium',
        'border',
        config.bgOpacity,
        className
      )}
      style={{
        color: config.color,
        borderColor: config.color,
        backgroundColor: `${config.color}1a`, // Add alpha for 10% opacity
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
};

export default FlagBadge; 