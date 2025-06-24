import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--chart-1))] text-primary-foreground hover:bg-[hsl(var(--chart-1))]/90 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--chart-1))] focus-visible:shadow-[0_0_15px_hsl(var(--chart-1))] transition-all duration-200",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Neumorphic variants - Enhanced with dramatic feedback
        neumorphic:
          "neumorphic-button-enhanced px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)] rounded-[var(--neumorphic-radius-md)] bg-neumorphic-button shadow-neumorphic-button-default border border-neumorphic-border/20 text-neumorphic-text-primary backdrop-blur-[var(--neumorphic-blur)] font-medium focus-visible:ring-2 focus-visible:ring-neumorphic-accent/20",
        "neumorphic-outline":
          "neumorphic-button-enhanced px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)] rounded-[var(--neumorphic-radius-md)] bg-transparent shadow-neumorphic-concave border border-neumorphic-border/20 text-neumorphic-text-primary backdrop-blur-[var(--neumorphic-blur)] font-medium focus-visible:ring-2 focus-visible:ring-neumorphic-accent/20",
        "neumorphic-ghost":
          "neumorphic-button-enhanced px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)] rounded-[var(--neumorphic-radius-md)] bg-transparent text-neumorphic-text-primary font-medium focus-visible:ring-2 focus-visible:ring-neumorphic-accent/20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        // Neumorphic sizes
        "neumorphic-sm": "h-8 px-[var(--neumorphic-spacing-sm)] py-1 has-[>svg]:px-2",
        "neumorphic-md": "h-10 px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)] has-[>svg]:px-3",
        "neumorphic-lg": "h-12 px-[var(--neumorphic-spacing-lg)] py-[var(--neumorphic-spacing-md)] has-[>svg]:px-4",
        "neumorphic-icon": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
