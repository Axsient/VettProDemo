import * as React from "react";
import { cn } from "@/lib/utils";

// Base Neumorphic Container (for page/section background)
export const NeumorphicBackground = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "min-h-screen w-full",
      "bg-neumorphic-bg-gradient",
      "p-[var(--neumorphic-spacing-sm)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
NeumorphicBackground.displayName = "NeumorphicBackground";

// Base Neumorphic Card
export const NeumorphicCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-[var(--neumorphic-spacing-lg)]",
      "rounded-[var(--neumorphic-radius-xl)]",
      "neumorphic-card-gradient",
      "shadow-neumorphic-convex-lg",
      "border border-neumorphic-border/10",
      "backdrop-blur-[var(--neumorphic-blur)]",
      "text-neumorphic-text-primary",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
NeumorphicCard.displayName = "NeumorphicCard";

// Neumorphic Button
export const NeumorphicButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "neumorphic-button-enhanced",
      "px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]",
      "rounded-[var(--neumorphic-radius-md)]",
      "bg-neumorphic-button",
      "shadow-neumorphic-button-default",
      "border border-neumorphic-border/20",
      "text-neumorphic-text-primary",
      "font-medium",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "backdrop-blur-[var(--neumorphic-blur)]",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
NeumorphicButton.displayName = "NeumorphicButton";

// Neumorphic Input
export const NeumorphicInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]",
      "rounded-[var(--neumorphic-radius-md)]",
      "bg-neumorphic-button",
      "shadow-neumorphic-concave",
      "border border-neumorphic-border/5",
      "text-neumorphic-text-primary",
      "placeholder:text-neumorphic-text-secondary",
      "focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50",
      "backdrop-blur-[var(--neumorphic-blur)]",
      "w-full",
      className
    )}
    {...props}
  />
));
NeumorphicInput.displayName = "NeumorphicInput";

// Neumorphic Icon Button
export const NeumorphicIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "neumorphic-button-enhanced",
      "p-3",
      "rounded-full",
      "bg-neumorphic-button",
      "shadow-neumorphic-button-default",
      "border border-neumorphic-border/20",
      "text-neumorphic-text-primary",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "backdrop-blur-[var(--neumorphic-blur)]",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
NeumorphicIconButton.displayName = "NeumorphicIconButton";

// Neumorphic Text
export const NeumorphicText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
  }
>(({ className, variant = "primary", size = "md", children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-neumorphic-text-primary leading-tight",
      variant === "secondary" && "text-neumorphic-text-secondary",
      size === "sm" && "text-sm",
      size === "lg" && "text-lg",
      className
    )}
    {...props}
  >
    {children}
  </p>
));
NeumorphicText.displayName = "NeumorphicText";

// Neumorphic Heading
export const NeumorphicHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight",
      "text-neumorphic-text-primary",
      "mb-[var(--neumorphic-spacing-xxs)]",
      className
    )}
    {...props}
  >
    {children}
  </h1>
));
NeumorphicHeading.displayName = "NeumorphicHeading";

// Neumorphic Container
export const NeumorphicContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-8 rounded-[40px]",
      "bg-neumorphic-bg",
      "shadow-neumorphic-convex-lg",
      "border border-neumorphic-border/5",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
NeumorphicContainer.displayName = "NeumorphicContainer";

// Neumorphic Progress Ring Component
export const NeumorphicProgressRing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color: string;
    icon?: React.ElementType;
  }
>(({ progress, size = 60, strokeWidth = 3, color, icon: Icon, className, ...props }, ref) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} className="absolute transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out progress-ring-glow"
          style={{
            filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})`,
          }}
        />
      </svg>
      {Icon && (
        <Icon
          className="text-neumorphic-text-primary z-10"
          size={size * 0.3}
          style={{ color }}
        />
      )}
    </div>
  );
});
NeumorphicProgressRing.displayName = "NeumorphicProgressRing";

// Neumorphic Badge
export const NeumorphicBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "success" | "warning" | "danger" | "info";
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  const variantStyles = {
    default: "bg-neumorphic-button text-neumorphic-text-primary",
    success: "bg-green-500/20 text-green-300 border-green-500/20",
    warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
    danger: "bg-red-500/20 text-red-300 border-red-500/20",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/20",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        "border backdrop-blur-[var(--neumorphic-blur)]",
        "shadow-neumorphic-convex-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
NeumorphicBadge.displayName = "NeumorphicBadge";

// Neumorphic Dialog Components
export const NeumorphicDialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
NeumorphicDialogOverlay.displayName = "NeumorphicDialogOverlay";

export const NeumorphicDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-[50%] left-[50%] z-50",
      "w-full max-w-lg",
      "translate-x-[-50%] translate-y-[-50%]",
      "p-5 gap-4",
      "bg-neumorphic-card rounded-[var(--neumorphic-radius-lg)]",
      "shadow-neumorphic-convex-lg",
      "border border-neumorphic-border/10",
      "backdrop-blur-[var(--neumorphic-blur)]",
      "text-neumorphic-text-primary",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "duration-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
NeumorphicDialogContent.displayName = "NeumorphicDialogContent";

// Neumorphic Popover
export const NeumorphicPopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 p-4",
      "bg-neumorphic-card rounded-[var(--neumorphic-radius-md)]",
      "shadow-neumorphic-convex-lg",
      "border border-neumorphic-border/10",
      "backdrop-blur-[var(--neumorphic-blur)]",
      "text-neumorphic-text-primary",
      "outline-none",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
NeumorphicPopoverContent.displayName = "NeumorphicPopoverContent";

// Neumorphic Table Components
export const NeumorphicTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "p-[var(--neumorphic-spacing-sm)] rounded-[var(--neumorphic-radius-lg)]",
      "bg-neumorphic-card shadow-neumorphic-convex",
      "border border-neumorphic-border/10",
      "backdrop-blur-[var(--neumorphic-blur)]",
      "overflow-hidden"
    )}
  >
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
NeumorphicTable.displayName = "NeumorphicTable";

export const NeumorphicTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-neumorphic-border/20", className)}
    {...props}
  />
));
NeumorphicTableHeader.displayName = "NeumorphicTableHeader";

export const NeumorphicTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
NeumorphicTableBody.displayName = "NeumorphicTableBody";

export const NeumorphicTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-neumorphic-border/10 transition-colors",
      "hover:bg-neumorphic-button/30",
      "data-[state=selected]:bg-neumorphic-accent/10",
      className
    )}
    {...props}
  />
));
NeumorphicTableRow.displayName = "NeumorphicTableRow";

export const NeumorphicTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-8 px-[var(--neumorphic-spacing-xs)] text-left align-middle font-medium",
      "text-neumorphic-text-secondary",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
NeumorphicTableHead.displayName = "NeumorphicTableHead";

export const NeumorphicTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-[var(--neumorphic-spacing-xs)] align-middle text-neumorphic-text-primary",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
NeumorphicTableCell.displayName = "NeumorphicTableCell";

// Neumorphic Stats Card
export const NeumorphicStatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    icon?: React.ReactNode;
  }
>(({ className, title, value, trend, trendValue, icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-[var(--neumorphic-spacing-md)] rounded-[var(--neumorphic-radius-lg)]",
      "bg-neumorphic-card shadow-neumorphic-convex",
      "border border-neumorphic-border/10",
      "backdrop-blur-[var(--neumorphic-blur)]",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-between">
      <div className="space-y-[var(--neumorphic-spacing-xxs)]">
        <NeumorphicText variant="secondary" size="sm">
          {title}
        </NeumorphicText>
        <div className="text-xl font-bold text-neumorphic-text-primary leading-none">
          {value}
        </div>
        {trend && trendValue && (
          <div className={cn(
            "text-xs flex items-center gap-1",
            trend === "up" && "text-green-400",
            trend === "down" && "text-red-400",
            trend === "neutral" && "text-neumorphic-text-secondary"
          )}>
            {trendValue}
          </div>
        )}
      </div>
      {icon && (
        <div className="p-[var(--neumorphic-spacing-xs)] rounded-full bg-neumorphic-button shadow-neumorphic-convex-sm">
          {icon}
        </div>
      )}
    </div>
  </div>
));
NeumorphicStatsCard.displayName = "NeumorphicStatsCard"; 