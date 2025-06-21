
import * as React from "react"
import { cn } from "@/lib/utils"

const MobileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "premium-card rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl shadow-2xl",
      "transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-white/[0.15] hover:scale-[1.01]",
      "p-4 md:p-6",
      className
    )}
    {...props}
  />
))
MobileCard.displayName = "MobileCard"

const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
MobileCardHeader.displayName = "MobileCardHeader"

const MobileCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl md:text-2xl font-bold leading-none tracking-tight text-white",
      "bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
MobileCardTitle.displayName = "MobileCardTitle"

const MobileCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm md:text-base text-white/70", className)}
    {...props}
  />
))
MobileCardDescription.displayName = "MobileCardDescription"

const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
MobileCardContent.displayName = "MobileCardContent"

const MobileCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
MobileCardFooter.displayName = "MobileCardFooter"

export { MobileCard, MobileCardHeader, MobileCardFooter, MobileCardTitle, MobileCardDescription, MobileCardContent }
