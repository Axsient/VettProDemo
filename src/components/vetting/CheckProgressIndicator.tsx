'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IndividualCheckStatus } from '@/types/vetting';

interface CheckProgressIndicatorProps {
  progress: number; // 0-100
  completedChecks: number;
  totalChecks: number;
  status?: IndividualCheckStatus;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const CheckProgressIndicator: React.FC<CheckProgressIndicatorProps> = ({
  progress,
  completedChecks,
  totalChecks,
  status,
  size = 'medium',
  showText = true,
  className = ''
}) => {
  // Size variants following neumorphic compact spacing
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  // Progress color based on completion percentage
  const getProgressColor = (prog: number) => {
    if (prog >= 100) return 'var(--neumorphic-success)';
    if (prog >= 75) return 'var(--neumorphic-primary)';
    if (prog >= 50) return 'var(--neumorphic-warning)';
    if (prog >= 25) return 'var(--neumorphic-secondary)';
    return 'var(--neumorphic-muted)';
  };

  // Status badge variant
  const getStatusVariant = (status?: IndividualCheckStatus): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'default';
    
    switch (status) {
      case IndividualCheckStatus.COMPLETE_CLEAR:
        return 'default'; // Green
      case IndividualCheckStatus.COMPLETE_ADVERSE:
        return 'destructive'; // Red
      case IndividualCheckStatus.IN_PROGRESS:
        return 'secondary'; // Blue
      case IndividualCheckStatus.ERROR:
        return 'destructive'; // Red
      default:
        return 'outline'; // Neutral
    }
  };

  // Calculate circumference for progress circle
  const radius = size === 'small' ? 18 : size === 'medium' ? 26 : 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Progress Indicator */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Background circle with neumorphic inset effect */}
        <div className={`absolute inset-0 rounded-full ${sizeClasses[size]} 
          bg-gradient-to-br from-[var(--neumorphic-background)] to-[var(--neumorphic-background-secondary)]
          shadow-[inset_2px_2px_4px_var(--neumorphic-shadow-dark),inset_-2px_-2px_4px_var(--neumorphic-shadow-light)]`}>
        </div>

        {/* SVG Progress Circle */}
        <svg 
          className={`${sizeClasses[size]} transform -rotate-90 relative z-10`}
          viewBox={`0 0 ${(radius + 8) * 2} ${(radius + 8) * 2}`}
        >
          {/* Background track */}
          <circle
            cx={radius + 8}
            cy={radius + 8}
            r={radius}
            stroke="var(--neumorphic-border)"
            strokeWidth="2"
            fill="none"
            className="opacity-20"
          />
          {/* Progress track */}
          <circle
            cx={radius + 8}
            cy={radius + 8}
            r={radius}
            stroke={getProgressColor(progress)}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
            style={{
              filter: 'drop-shadow(0 0 2px currentColor)'
            }}
          />
        </svg>

        {/* Center text */}
        <div className={`absolute inset-0 flex items-center justify-center z-20 
          ${textSizeClasses[size]} font-semibold text-[var(--neumorphic-foreground)]`}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Text and Status Information */}
      {showText && (
        <div className="flex flex-col gap-1">
          <div className={`${textSizeClasses[size]} font-medium text-[var(--neumorphic-foreground)]`}>
            {completedChecks}/{totalChecks} Checks Complete
          </div>
          
          {status && (
            <Badge 
              variant={getStatusVariant(status)}
              className="text-xs px-2 py-0.5 w-fit"
            >
              {status}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckProgressIndicator;