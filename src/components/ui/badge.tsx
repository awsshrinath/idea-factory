
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide backdrop-blur-sm shadow-lg",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary-foreground hover:bg-primary/30 border-primary/30",
        secondary:
          "border-transparent bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 border-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 border-destructive/30",
        outline: "text-foreground border-white/20 hover:bg-white/5",
        style:
          "border-transparent bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-indigo-500/40",
        dimension:
          "border-transparent bg-slate-500/20 text-slate-300 hover:bg-slate-500/30 border-slate-500/40",
        shimmer:
          "border-transparent bg-muted/20 text-muted-foreground animate-shimmer bg-[length:200%_100%] border-muted/30",
        recommended:
          "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30",
        trending:
          "bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30",
        hot:
          "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30",
        premium:
          "bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30",
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
