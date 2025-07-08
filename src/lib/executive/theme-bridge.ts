// CSS Bridge for Executive Dashboard Canvas Libraries
// Provides utilities to extract CSS custom properties and convert them for use in canvas rendering

/**
 * Get CSS custom property value from the document root
 */
export const getCssVariable = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

/**
 * Convert hex color to RGB array for deck.gl and other libraries
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

/**
 * Convert hex color to RGBA array with opacity
 */
export const hexToRgba = (hex: string, alpha: number = 1): [number, number, number, number] => {
  const [r, g, b] = hexToRgb(hex);
  return [r, g, b, Math.floor(alpha * 255)];
};

/**
 * Get neumorphic color based on risk score
 */
export const getRiskColor = (score: number): [number, number, number, number] => {
  const critical = getCssVariable('--neumorphic-severity-critical');
  const high = getCssVariable('--neumorphic-severity-high');
  const medium = getCssVariable('--neumorphic-severity-medium');
  const low = getCssVariable('--neumorphic-severity-low');
  
  if (score >= 75) return hexToRgba(critical, 0.8);
  if (score >= 50) return hexToRgba(high, 0.8);
  if (score >= 25) return hexToRgba(medium, 0.8);
  return hexToRgba(low, 0.8);
};

/**
 * Get theme colors for canvas rendering
 */
export const getThemeColors = () => {
  return {
    background: getCssVariable('--neumorphic-bg'),
    card: getCssVariable('--neumorphic-card'),
    textPrimary: getCssVariable('--neumorphic-text-primary'),
    textSecondary: getCssVariable('--neumorphic-text-secondary'),
    accent: getCssVariable('--neumorphic-accent'),
    border: getCssVariable('--neumorphic-border'),
    shadowConvex: getCssVariable('--neumorphic-shadow-convex'),
    shadowConcave: getCssVariable('--neumorphic-shadow-concave'),
    severityCritical: getCssVariable('--neumorphic-severity-critical'),
    severityHigh: getCssVariable('--neumorphic-severity-high'),
    severityMedium: getCssVariable('--neumorphic-severity-medium'),
    severityLow: getCssVariable('--neumorphic-severity-low'),
  };
};

/**
 * Apply neumorphic styling to canvas context
 */
export const applyNeumorphicToCanvas = (
  ctx: CanvasRenderingContext2D,
  type: 'convex' | 'concave' = 'convex'
) => {
  const colors = getThemeColors();
  
  if (type === 'convex') {
    // Apply convex (raised) shadow
    ctx.shadowColor = colors.border;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  } else {
    // Apply concave (inset) shadow
    ctx.shadowColor = colors.shadowConcave;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = -2;
    ctx.shadowOffsetY = -2;
  }
};

/**
 * Get severity color for event types
 */
export const getSeverityColor = (severity: string): string => {
  const severityMap: Record<string, string> = {
    'Critical': getCssVariable('--neumorphic-severity-critical'),
    'High': getCssVariable('--neumorphic-severity-high'),
    'Medium': getCssVariable('--neumorphic-severity-medium'),
    'Low': getCssVariable('--neumorphic-severity-low'),
    'Informational': getCssVariable('--neumorphic-text-secondary'),
  };
  
  return severityMap[severity] || getCssVariable('--neumorphic-text-primary');
};