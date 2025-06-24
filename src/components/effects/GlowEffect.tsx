// GlowEffect component placeholder
// Inspired by the luminous chart effects from Recehtok-style_dashboard.png
import React from 'react';
import { cn } from '@/lib/utils';

interface GlowEffectProps {
  /** Optional additional class names to apply to the glow effect div. */
  className?: string;
  /** The color theme of the glow effect. */
  glowColor?: 'blue' | 'purple' | 'cyan' | 'pink';
}

/**
 * A component that renders a subtle, themeable glow effect using CSS box-shadow.
 * It's intended to be absolutely positioned within a relative container.
 */
const GlowEffect: React.FC<GlowEffectProps> = ({
  className,
  glowColor = 'blue',
}) => {
  const colorClass = {
    blue: 'glow-subtle-blue',
    purple: 'glow-purple',
    cyan: '[box-shadow:0_0_20px_theme(colors.cyan.500/0.6)]',
    pink: '[box-shadow:0_0_20px_theme(colors.pink.500/0.6)]',
  }[glowColor];

  return <div className={cn('absolute rounded-full', colorClass, className)} />;
};

export default GlowEffect; 