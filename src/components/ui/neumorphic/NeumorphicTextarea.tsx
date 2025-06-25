import * as React from "react";
import { cn } from "@/lib/utils";

const NeumorphicTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full",
        "px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]",
        "rounded-[var(--neumorphic-radius-md)]",
        "bg-neumorphic-input-bg",
        "shadow-neumorphic-inset",
        "border border-neumorphic-border/10",
        "text-neumorphic-text-primary",
        "placeholder:text-neumorphic-text-secondary",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50",
        "focus:shadow-neumorphic-inset-focus",
        "backdrop-blur-[var(--neumorphic-blur)]",
        "resize-vertical",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
NeumorphicTextarea.displayName = "NeumorphicTextarea";

export { NeumorphicTextarea }; 