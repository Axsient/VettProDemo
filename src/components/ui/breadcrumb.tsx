import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const breadcrumbVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        neumorphic: "neumorphic-breadcrumb-container",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbListVariants = cva(
  "flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        neumorphic: "text-neumorphic-text-secondary",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbLinkVariants = cva(
  "transition-colors",
  {
    variants: {
      variant: {
        default: "hover:text-foreground",
        neumorphic: "text-neumorphic-text-secondary hover:text-neumorphic-text-primary hover:text-neumorphic-accent",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbPageVariants = cva(
  "font-normal",
  {
    variants: {
      variant: {
        default: "text-foreground",
        neumorphic: "text-neumorphic-text-primary",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbSeparatorVariants = cva(
  "[&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "",
        neumorphic: "text-neumorphic-text-secondary",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Breadcrumb({ 
  variant,
  className,
  ...props 
}: React.ComponentProps<"nav"> & VariantProps<typeof breadcrumbVariants>) {
  return (
    <nav 
      aria-label="breadcrumb" 
      data-slot="breadcrumb" 
      className={cn(breadcrumbVariants({ variant, className }))}
      {...props} 
    />
  )
}

function BreadcrumbList({ 
  variant,
  className, 
  ...props 
}: React.ComponentProps<"ol"> & VariantProps<typeof breadcrumbListVariants>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListVariants({ variant, className }))}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  variant,
  className,
  ...props
}: React.ComponentProps<"a"> & 
  VariantProps<typeof breadcrumbLinkVariants> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(breadcrumbLinkVariants({ variant, className }))}
      {...props}
    />
  )
}

function BreadcrumbPage({ 
  variant,
  className, 
  ...props 
}: React.ComponentProps<"span"> & VariantProps<typeof breadcrumbPageVariants>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(breadcrumbPageVariants({ variant, className }))}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  variant,
  className,
  ...props
}: React.ComponentProps<"li"> & VariantProps<typeof breadcrumbSeparatorVariants>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorVariants({ variant, className }))}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
