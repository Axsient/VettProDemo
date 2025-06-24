import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "neumorphic-input-enhanced px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)] rounded-[var(--neumorphic-radius-md)] text-neumorphic-text-primary",
        legacy: "dark:bg-input/30 dark:border-white/10 border-input focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[hsl(var(--chart-1))] focus-visible:shadow-[0_0_10px_hsl(var(--chart-1))] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-transparent px-3 py-1 shadow-xs transition-all duration-200 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Input({ 
  className, 
  type, 
  variant,
  ...props 
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
