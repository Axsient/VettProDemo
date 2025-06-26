import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}

const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  percentage,
  size = 50,
  strokeWidth = 4,
  className,
  animate = true,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  const getRingColor = () => {
    if (percentage >= 90) return 'var(--neumorphic-severity-low)'; // Green for excellent scores
    if (percentage >= 75) return 'var(--neumorphic-severity-medium)'; // Yellow for good scores
    if (percentage >= 50) return 'var(--neumorphic-severity-high)'; // Orange for caution
    return 'var(--neumorphic-severity-critical)'; // Red for critical scores
  };

  const getGlowColor = () => {
    if (percentage >= 90) return 'rgba(13, 212, 66, 0.3)'; // Custom green glow
    if (percentage >= 75) return 'rgba(234, 179, 8, 0.3)'; // Yellow glow
    if (percentage >= 50) return 'rgba(249, 115, 22, 0.3)'; // Orange glow
    return 'rgba(239, 68, 68, 0.3)'; // Red glow
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animate]);

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-105",
        animate && "animate-in fade-in duration-500",
        className
      )}
      style={{ 
        width: size, 
        height: size,
        filter: `drop-shadow(0 0 8px ${getGlowColor()})`,
        animation: animate ? 'progressRingFadeIn 0.6s ease-out' : undefined,
      }}
    >
      {/* Neumorphic background circle */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'var(--neumorphic-card)',
          boxShadow: 'var(--neumorphic-shadow-convex-sm)',
          backdropFilter: 'blur(var(--neumorphic-blur))',
        }}
      />
      
      {/* SVG Progress Ring */}
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
        style={{
          filter: `drop-shadow(0 0 4px ${getGlowColor()})`,
        }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--neumorphic-text-secondary)"
          strokeWidth={strokeWidth}
          strokeOpacity={0.6}
          className="transition-all duration-300"
        />
        
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getRingColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 2px ${getRingColor()})`,
          }}
        />
      </svg>
      
      {/* Percentage text */}
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-bold z-20"
        style={{ 
          color: 'var(--neumorphic-text-primary)',
          textShadow: `0 0 4px ${getGlowColor()}`,
        }}
      >
        {Math.round(animatedPercentage)}
      </div>
      
      {/* Subtle glow animation for critical scores */}
      {percentage < 50 && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${getGlowColor()} 0%, transparent 60%)`,
            animation: 'pulse 2s infinite ease-in-out',
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
};

export default CircularProgressRing; 