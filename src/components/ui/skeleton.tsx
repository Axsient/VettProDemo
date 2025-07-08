'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { shimmerVariants, pulseVariants } from '@/lib/animation-utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'none';
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'shimmer',
  children,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded h-4';
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-[var(--neumorphic-radius-md)]';
      case 'rectangular':
      default:
        return 'rounded-[var(--neumorphic-radius-sm)]';
    }
  };

  const getAnimationProps = () => {
    switch (animation) {
      case 'pulse':
        return {
          variants: pulseVariants,
          initial: 'pulse',
          animate: 'pulse',
        };
      case 'shimmer':
        return {
          style: {
            background: 'linear-gradient(90deg, var(--neumorphic-text-secondary) 25%, var(--neumorphic-card) 50%, var(--neumorphic-text-secondary) 75%)',
            backgroundSize: '200% 100%',
          },
          variants: shimmerVariants,
          initial: 'shimmer',
          animate: 'shimmer',
        };
      case 'none':
      default:
        return {};
    }
  };

  const style: React.CSSProperties = {
    width,
    height,
    ...((animation === 'shimmer' && getAnimationProps().style) || {}),
  };

  return (
    <motion.div
      className={`
        bg-[var(--neumorphic-text-secondary)] bg-opacity-20
        ${getVariantClasses()}
        ${className}
      `}
      style={style}
      {...getAnimationProps()}
    >
      {children}
    </motion.div>
  );
};

// Specialized skeleton components for dashboard elements

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] ${className}`}>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton height={120} />
      <div className="space-y-2">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  </div>
);

export const MapSkeleton: React.FC<{ className?: string; height?: string }> = ({ 
  className = '', 
  height = '500px' 
}) => (
  <div 
    className={`relative rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] overflow-hidden ${className}`}
    style={{ height }}
  >
    <Skeleton className="absolute inset-0" animation="shimmer" />
    
    {/* Map markers simulation */}
    <motion.div
      className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.div
      className="absolute top-1/2 right-1/3 w-3 h-3 bg-orange-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />
    <motion.div
      className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-green-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
    />
    
    {/* Legend skeleton */}
    <div className="absolute bottom-4 left-4 p-3 bg-[var(--neumorphic-card)] rounded-[var(--neumorphic-radius-md)] shadow-[var(--neumorphic-shadow-convex)]">
      <Skeleton variant="text" width={80} height={16} className="mb-2" />
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="text" width={60} height={12} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const GaugeSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-button)] bg-opacity-30 ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      <Skeleton variant="circular" width={32} height={32} />
      <div className="flex-1">
        <Skeleton variant="text" width="70%" height={16} />
      </div>
    </div>
    
    {/* Gauge circle skeleton */}
    <div className="relative h-24 mb-3">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-20 h-20 border-4 border-[var(--neumorphic-text-secondary)] border-opacity-20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-0 w-4 h-4 bg-[var(--neumorphic-accent)] rounded-full transform -translate-x-2 -translate-y-2" />
        </motion.div>
      </div>
    </div>
    
    <Skeleton variant="text" width="100%" height={12} />
    <div className="mt-2 flex justify-center">
      <Skeleton width={60} height={20} variant="rounded" />
    </div>
  </div>
);

export const NetworkGraphSkeleton: React.FC<{ className?: string; height?: string }> = ({ 
  className = '', 
  height = '400px' 
}) => (
  <div 
    className={`relative rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-concave)] overflow-hidden ${className}`}
    style={{ height }}
  >
    <Skeleton className="absolute inset-0" animation="shimmer" />
    
    {/* Network nodes simulation */}
    {[
      { top: '20%', left: '30%', size: 'w-6 h-6', color: 'bg-blue-400' },
      { top: '40%', left: '60%', size: 'w-4 h-4', color: 'bg-red-400' },
      { top: '60%', left: '20%', size: 'w-5 h-5', color: 'bg-green-400' },
      { top: '30%', left: '80%', size: 'w-3 h-3', color: 'bg-orange-400' },
      { top: '70%', left: '70%', size: 'w-4 h-4', color: 'bg-purple-400' },
    ].map((node, i) => (
      <motion.div
        key={i}
        className={`absolute ${node.size} ${node.color} rounded-full`}
        style={{ top: node.top, left: node.left }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: i * 0.3 
        }}
      />
    ))}
    
    {/* Connection lines */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <motion.line
        x1="30%" y1="20%" x2="60%" y2="40%"
        stroke="var(--neumorphic-text-secondary)"
        strokeWidth="1"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.line
        x1="60%" y1="40%" x2="70%" y2="70%"
        stroke="var(--neumorphic-text-secondary)"
        strokeWidth="1"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
      />
    </svg>
    
    {/* Legend skeleton */}
    <div className="absolute top-4 right-4 p-3 bg-[var(--neumorphic-card)] rounded-[var(--neumorphic-radius-md)] shadow-[var(--neumorphic-shadow-convex)]">
      <Skeleton variant="text" width={60} height={14} className="mb-2" />
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton variant="circular" width={10} height={10} />
            <Skeleton variant="text" width={50} height={10} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const EventListSkeleton: React.FC<{ className?: string; itemCount?: number }> = ({ 
  className = '', 
  itemCount = 5 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: itemCount }).map((_, i) => (
      <motion.div
        key={i}
        className="p-4 rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)] border-l-4 border-[var(--neumorphic-accent)]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <div className="flex items-start gap-3">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton variant="text" width="70%" height={16} />
              <Skeleton width={50} height={20} variant="rounded" />
            </div>
            <Skeleton variant="text" width="100%" height={12} />
            <Skeleton variant="text" width="80%" height={12} />
            <div className="flex items-center justify-between mt-3">
              <Skeleton width={80} height={24} variant="rounded" />
              <Skeleton variant="text" width={60} height={12} />
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export const DetailPanelSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 space-y-6 ${className}`}>
    {/* Header skeleton */}
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
    
    {/* Stats grid skeleton */}
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] bg-opacity-30">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width="60%" height={12} />
          </div>
          <Skeleton variant="text" width="40%" height={24} />
        </div>
      ))}
    </div>
    
    {/* Content sections */}
    <div className="space-y-4">
      <Skeleton variant="text" width="50%" height={18} />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-[var(--neumorphic-radius-md)] bg-[var(--neumorphic-button)] bg-opacity-20">
            <div className="flex-1 space-y-1">
              <Skeleton variant="text" width="70%" height={14} />
              <Skeleton variant="text" width="50%" height={12} />
            </div>
            <Skeleton variant="text" width={40} height={14} />
          </div>
        ))}
      </div>
    </div>
    
    {/* Action buttons */}
    <div className="space-y-2">
      <Skeleton height={40} variant="rounded" />
      <Skeleton height={36} variant="rounded" />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[var(--neumorphic-bg)]">
    <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-6">
      {/* Header skeleton */}
      <div className="py-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 auto-rows-min gap-4 lg:gap-6 pb-6">
        <div className="col-span-1 md:col-span-8 lg:col-span-8">
          <MapSkeleton height="500px" />
        </div>
        <div className="col-span-1 md:col-span-8 lg:col-span-4">
          <div className="space-y-4 h-[500px] overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <GaugeSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="col-span-1 md:col-span-8 lg:col-span-8">
          <NetworkGraphSkeleton height="500px" />
        </div>
        <div className="col-span-1 md:col-span-8 lg:col-span-4">
          <DetailPanelSkeleton className="h-[500px] overflow-hidden" />
        </div>
        <div className="col-span-1 md:col-span-8 lg:col-span-12">
          <div className="h-[400px] p-4 rounded-[var(--neumorphic-radius-lg)] bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)]">
            <div className="mb-4">
              <Skeleton variant="text" width={200} height={24} />
            </div>
            <EventListSkeleton />
          </div>
        </div>
      </div>
    </div>
  </div>
);