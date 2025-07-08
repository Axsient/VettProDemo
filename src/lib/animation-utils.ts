// Animation utility functions and constants for consistent motion design across the executive dashboard

import { Variants } from 'framer-motion';

// Animation durations and easing
export const ANIMATION_DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

export const ANIMATION_EASINGS = {
  smooth: [0.4, 0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 1, 1],
  soft: [0.25, 0.46, 0.45, 0.94],
} as const;

// Stagger animations for lists
export const STAGGER_DELAYS = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;

// Common animation variants
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const slideInFromLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const slideInFromRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const bounceInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.slow,
      ease: ANIMATION_EASINGS.bouncy,
    },
  },
};

// Staggered container variants
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAYS.normal,
    },
  },
};

export const fastStaggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAYS.fast,
    },
  },
};

export const slowStaggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAYS.slow,
    },
  },
};

// Loading and skeleton variants
export const pulseVariants: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
};

export const shimmerVariants: Variants = {
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Microinteraction variants
export const hoverScaleVariants = {
  whileHover: {
    scale: 1.02,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const hoverLiftVariants = {
  whileHover: {
    y: -2,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  whileTap: {
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const buttonPressVariants = {
  whileHover: {
    scale: 1.05,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  whileTap: {
    scale: 0.95,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

// Loading spinner variants
export const spinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Utility functions for creating dynamic variants
export const createSlideVariants = (
  direction: 'up' | 'down' | 'left' | 'right',
  distance: number = 20
): Variants => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
    }
  };

  return {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.normal,
        ease: ANIMATION_EASINGS.smooth,
      },
    },
  };
};

export const createStaggerDelay = (index: number, delay: number = STAGGER_DELAYS.normal): number => {
  return index * delay;
};

// Alert and notification animation variants
export const alertVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.bouncy,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

// Risk level pulse animation
export const riskPulseVariants: Variants = {
  critical: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  high: {
    scale: [1, 1.03, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
};

// Chart animation variants
export const chartDataVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: ANIMATION_DURATIONS.slower,
        ease: ANIMATION_EASINGS.smooth,
      },
      opacity: {
        duration: ANIMATION_DURATIONS.fast,
      },
    },
  },
};

// Modal and overlay variants
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.sharp,
    },
  },
};

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
    },
  },
};