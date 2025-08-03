import * as React from "react";
import { cn } from "@/lib/utils";

// Base Neumorphic Card with variant support
interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "inset" | "elevated" | "flat";
}

export const NeumorphicCard = React.forwardRef<
  HTMLDivElement,
  NeumorphicCardProps
>(({ className, variant = "default", children, ...props }, ref) => {
  const variantStyles = {
    default: [
      "shadow-neumorphic-convex",
      "bg-neumorphic-card",
      "border border-neumorphic-border/10"
    ],
    inset: [
      "shadow-neumorphic-concave",
      "bg-neumorphic-bg",
      "border border-neumorphic-border/5"
    ],
    elevated: [
      "shadow-neumorphic-convex-lg",
      "bg-neumorphic-card",
      "border border-neumorphic-border/15"
    ],
    flat: [
      "shadow-none",
      "bg-neumorphic-card/50",
      "border border-neumorphic-border/20"
    ]
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--neumorphic-radius-lg)]",
        "backdrop-blur-[var(--neumorphic-blur)]",
        "text-neumorphic-text-primary",
        "transition-all duration-200",
        ...variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
NeumorphicCard.displayName = "NeumorphicCard";