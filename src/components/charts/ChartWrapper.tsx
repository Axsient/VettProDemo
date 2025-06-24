import { cn } from '@/lib/utils';

type ChartWrapperProps = {
  /** The chart component to be rendered inside the wrapper. */
  children: React.ReactNode;
  /** Optional additional class names to apply to the wrapper. */
  className?: string;
};

/**
 * A wrapper component that provides consistent styling for charts,
 * including a glassmorphism background effect.
 */
export default function ChartWrapper({ children, className }: ChartWrapperProps) {
  return (
    <div className={cn("relative rounded-lg p-4", className)}>
      <div className="absolute inset-0 glassmorphism rounded-lg" />
      <div className="relative z-10">{children}</div>
    </div>
  );
} 