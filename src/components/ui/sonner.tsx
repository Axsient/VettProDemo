"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps as SonnerToasterProps } from "sonner"

interface ToasterProps extends Omit<SonnerToasterProps, 'theme'> {
  variant?: 'default' | 'neumorphic'
}

const Toaster = ({ variant = 'default', ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  const getToastClassNames = () => {
    if (variant === 'neumorphic') {
      return {
        toast: "bg-neumorphic-card shadow-neumorphic-convex-lg border border-neumorphic-border/10 backdrop-blur-[var(--neumorphic-blur)] text-neumorphic-text-primary rounded-[var(--neumorphic-radius-md)]",
        description: "group-[.toast]:text-neumorphic-text-secondary",
        actionButton: "group-[.toast]:bg-neumorphic-accent group-[.toast]:text-white group-[.toast]:shadow-neumorphic-convex-sm group-[.toast]:border group-[.toast]:border-neumorphic-border/5 group-[.toast]:rounded-[var(--neumorphic-radius-sm)]",
        cancelButton: "group-[.toast]:bg-neumorphic-button group-[.toast]:text-neumorphic-text-secondary group-[.toast]:shadow-neumorphic-convex-sm group-[.toast]:border group-[.toast]:border-neumorphic-border/5 group-[.toast]:rounded-[var(--neumorphic-radius-sm)]",
      }
    }
    
    return {
      toast: "glassmorphism text-foreground",
      description: "group-[.toast]:text-muted-foreground",
      actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
      cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
    }
  }

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: getToastClassNames(),
      }}
      {...props}
    />
  )
}

export { Toaster }
