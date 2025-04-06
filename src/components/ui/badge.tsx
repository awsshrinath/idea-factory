
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-input",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        success: "border-transparent bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
        info: "border-transparent bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
        warning: "border-transparent bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
        // New variants for image metadata
        style: "border-transparent bg-primary/20 text-primary-foreground/90 hover:bg-primary/30",
        mood: "border-transparent bg-accent/20 text-accent-foreground/90 hover:bg-accent/30", 
        dimension: "border-transparent bg-secondary/20 text-secondary-foreground/90 hover:bg-secondary/30",
        shimmer: "border-transparent bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 text-muted-foreground/80 animate-shimmer bg-[length:200%_100%]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
