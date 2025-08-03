/**
 * Vetting Canvas Animation Configurations
 * 
 * This module provides animation settings and configurations for the Smart Vetting Canvas
 * feature, including CountUp animations, progress rings, hover states, and form interactions.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { CSSProperties } from 'react';

// Animation timing constants
export const ANIMATION_TIMING = {
  fast: 150,
  normal: 300,
  slow: 500,
  countUp: 2000,
  progressRing: 1500,
  hover: 200,
  form: 250,
} as const;

// Easing functions for CSS transitions
export const EASING = {
  ease: 'ease',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

// CountUp animation configurations
export interface CountUpConfig {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
  useEasing?: boolean;
  useGrouping?: boolean;
  smartEasing?: boolean;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (value: number) => string;
  onStart?: () => void;
  onEnd?: () => void;
  onUpdate?: (value: number) => void;
}

export const COUNTUP_CONFIGS = {
  currency: {
    duration: ANIMATION_TIMING.countUp,
    decimals: 0,
    prefix: 'R',
    separator: ',',
    useEasing: true,
    useGrouping: true,
    smartEasing: true,
  } as CountUpConfig,
  
  percentage: {
    duration: ANIMATION_TIMING.countUp,
    decimals: 1,
    suffix: '%',
    useEasing: true,
    smartEasing: true,
  } as CountUpConfig,
  
  days: {
    duration: ANIMATION_TIMING.countUp,
    decimals: 0,
    suffix: ' days',
    useEasing: true,
    smartEasing: true,
  } as CountUpConfig,
  
  count: {
    duration: ANIMATION_TIMING.countUp,
    decimals: 0,
    useEasing: true,
    useGrouping: true,
    smartEasing: true,
  } as CountUpConfig,
  
  score: {
    duration: ANIMATION_TIMING.countUp,
    decimals: 0,
    suffix: '/100',
    useEasing: true,
    smartEasing: true,
  } as CountUpConfig,
} as const;

// Progress ring animation configurations
export interface ProgressRingConfig {
  duration: number;
  easing: string;
  strokeWidth: number;
  size: number;
  animateOnMount: boolean;
  showPercentage: boolean;
  gradientColors?: {
    start: string;
    end: string;
  };
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
}

export const PROGRESS_RING_CONFIGS = {
  small: {
    duration: ANIMATION_TIMING.progressRing,
    easing: EASING.easeInOut,
    strokeWidth: 4,
    size: 48,
    animateOnMount: true,
    showPercentage: false,
  } as ProgressRingConfig,
  
  medium: {
    duration: ANIMATION_TIMING.progressRing,
    easing: EASING.easeInOut,
    strokeWidth: 6,
    size: 80,
    animateOnMount: true,
    showPercentage: true,
    thresholds: {
      low: 30,
      medium: 70,
      high: 90,
    },
  } as ProgressRingConfig,
  
  large: {
    duration: ANIMATION_TIMING.progressRing,
    easing: EASING.easeInOut,
    strokeWidth: 8,
    size: 120,
    animateOnMount: true,
    showPercentage: true,
    gradientColors: {
      start: 'var(--neumorphic-accent-primary)',
      end: 'var(--neumorphic-accent-secondary)',
    },
    thresholds: {
      low: 30,
      medium: 70,
      high: 90,
    },
  } as ProgressRingConfig,
  
  riskAssessment: {
    duration: ANIMATION_TIMING.progressRing,
    easing: EASING.easeInOut,
    strokeWidth: 6,
    size: 100,
    animateOnMount: true,
    showPercentage: true,
    thresholds: {
      low: 25,
      medium: 50,
      high: 75,
    },
  } as ProgressRingConfig,
} as const;

// Hover state animations
export interface HoverAnimationConfig {
  scale?: number;
  translateY?: number;
  rotate?: number;
  brightness?: number;
  saturate?: number;
  shadow?: string;
  borderRadius?: string;
  duration: number;
  easing: string;
}

export const HOVER_ANIMATIONS = {
  card: {
    scale: 1.02,
    translateY: -2,
    shadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    duration: ANIMATION_TIMING.hover,
    easing: EASING.easeInOut,
  } as HoverAnimationConfig,
  
  button: {
    scale: 1.05,
    brightness: 1.1,
    duration: ANIMATION_TIMING.hover,
    easing: EASING.easeInOut,
  } as HoverAnimationConfig,
  
  checkItem: {
    scale: 1.01,
    translateY: -1,
    shadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    duration: ANIMATION_TIMING.hover,
    easing: EASING.easeInOut,
  } as HoverAnimationConfig,
  
  packageCard: {
    scale: 1.03,
    translateY: -4,
    shadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    duration: ANIMATION_TIMING.hover,
    easing: EASING.bounce,
  } as HoverAnimationConfig,
  
  recommendation: {
    scale: 1.02,
    translateY: -2,
    brightness: 1.05,
    duration: ANIMATION_TIMING.hover,
    easing: EASING.easeInOut,
  } as HoverAnimationConfig,
} as const;

// Form interaction animations
export interface FormAnimationConfig {
  focusScale?: number;
  focusTranslateY?: number;
  focusBorderWidth?: number;
  focusGlow?: string;
  errorShake?: boolean;
  successPulse?: boolean;
  duration: number;
  easing: string;
}

export const FORM_ANIMATIONS = {
  input: {
    focusScale: 1.01,
    focusTranslateY: -1,
    focusBorderWidth: 2,
    focusGlow: '0 0 0 3px var(--neumorphic-accent-primary-alpha)',
    errorShake: true,
    duration: ANIMATION_TIMING.form,
    easing: EASING.easeInOut,
  } as FormAnimationConfig,
  
  select: {
    focusScale: 1.02,
    focusGlow: '0 0 0 3px var(--neumorphic-accent-primary-alpha)',
    duration: ANIMATION_TIMING.form,
    easing: EASING.easeInOut,
  } as FormAnimationConfig,
  
  checkbox: {
    focusScale: 1.1,
    successPulse: true,
    duration: ANIMATION_TIMING.form,
    easing: EASING.bounce,
  } as FormAnimationConfig,
  
  radio: {
    focusScale: 1.08,
    successPulse: true,
    duration: ANIMATION_TIMING.form,
    easing: EASING.bounce,
  } as FormAnimationConfig,
} as const;

// Transition classes for CSS
export const TRANSITION_CLASSES = {
  all: `transition-all duration-${ANIMATION_TIMING.normal} ${EASING.easeInOut}`,
  transform: `transition-transform duration-${ANIMATION_TIMING.normal} ${EASING.easeInOut}`,
  colors: `transition-colors duration-${ANIMATION_TIMING.normal} ${EASING.easeInOut}`,
  opacity: `transition-opacity duration-${ANIMATION_TIMING.normal} ${EASING.easeInOut}`,
  shadow: `transition-shadow duration-${ANIMATION_TIMING.normal} ${EASING.easeInOut}`,
  fast: `transition-all duration-${ANIMATION_TIMING.fast} ${EASING.easeInOut}`,
  slow: `transition-all duration-${ANIMATION_TIMING.slow} ${EASING.easeInOut}`,
} as const;

// Keyframe animations for CSS-in-JS or styled-components
export const KEYFRAMES = {
  fadeIn: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  
  fadeInUp: {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  
  fadeInDown: {
    '0%': { opacity: 0, transform: 'translateY(-20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  
  slideInLeft: {
    '0%': { opacity: 0, transform: 'translateX(-20px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
  },
  
  slideInRight: {
    '0%': { opacity: 0, transform: 'translateX(20px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
  },
  
  scaleIn: {
    '0%': { opacity: 0, transform: 'scale(0.9)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
    '40%, 43%': { transform: 'translate3d(0, -6px, 0)' },
    '70%': { transform: 'translate3d(0, -3px, 0)' },
    '90%': { transform: 'translate3d(0, -1px, 0)' },
  },
  
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
  },
  
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  
  rotate: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  
  progressRing: {
    '0%': { strokeDasharray: '0 100' },
    '100%': { strokeDasharray: 'var(--progress) 100' },
  },
  
  shimmer: {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
} as const;

// Animation utilities
export const createAnimationStyle = (config: HoverAnimationConfig): CSSProperties => ({
  transition: `all ${config.duration}ms ${config.easing}`,
  ':hover': {
    transform: [
      config.scale && `scale(${config.scale})`,
      config.translateY && `translateY(${config.translateY}px)`,
      config.rotate && `rotate(${config.rotate}deg)`,
    ].filter(Boolean).join(' '),
    filter: [
      config.brightness && `brightness(${config.brightness})`,
      config.saturate && `saturate(${config.saturate})`,
    ].filter(Boolean).join(' '),
    boxShadow: config.shadow,
    borderRadius: config.borderRadius,
  },
});

export const createFormAnimationStyle = (config: FormAnimationConfig): CSSProperties => ({
  transition: `all ${config.duration}ms ${config.easing}`,
  ':focus': {
    transform: [
      config.focusScale && `scale(${config.focusScale})`,
      config.focusTranslateY && `translateY(${config.focusTranslateY}px)`,
    ].filter(Boolean).join(' '),
    borderWidth: config.focusBorderWidth,
    boxShadow: config.focusGlow,
  },
});

// Stagger animation utilities
export const createStaggerDelay = (index: number, baseDelay: number = 100): number => {
  return index * baseDelay;
};

export const createStaggerStyle = (index: number, baseDelay: number = 100): CSSProperties => ({
  animationDelay: `${createStaggerDelay(index, baseDelay)}ms`,
});

// Loading animations
export const LOADING_ANIMATIONS = {
  spinner: {
    duration: 1000,
    easing: 'linear',
    iterations: 'infinite',
    keyframes: KEYFRAMES.rotate,
  },
  
  pulse: {
    duration: 2000,
    easing: EASING.easeInOut,
    iterations: 'infinite',
    keyframes: KEYFRAMES.pulse,
  },
  
  shimmer: {
    duration: 2000,
    easing: 'linear',
    iterations: 'infinite',
    keyframes: KEYFRAMES.shimmer,
  },
} as const;

// Theme-aware animation configurations
export const getThemeAnimations = (isDark: boolean) => ({
  shadowColors: isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)',
  glowColors: isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)',
  highlightColors: isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)',
});

// Performance optimization utilities
export const PERFORMANCE_SETTINGS = {
  // Reduce animations on slower devices
  reducedMotion: typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // Optimize for mobile
  isMobile: typeof window !== 'undefined' && 
    window.innerWidth < 768,
  
  // Battery optimization
  lowPowerMode: typeof navigator !== 'undefined' && 
    // @ts-expect-error - experimental API
    navigator.getBattery?.().then((battery: { charging: boolean; level: number }) => !battery.charging && battery.level < 0.2),
} as const;

// Conditional animation wrapper
export const withConditionalAnimation = <T extends object>(
  config: T,
  condition: boolean = true
): T | Record<string, never> => {
  if (PERFORMANCE_SETTINGS.reducedMotion || !condition) {
    return {};
  }
  return config;
};

// Export animation class names for Tailwind
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
} as const;