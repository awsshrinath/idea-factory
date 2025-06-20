
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] border border-purple-500/20 hover:border-purple-400/40",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-xl hover:shadow-red-500/25 hover:scale-[1.02] border border-red-500/20",
        outline: "border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/30 backdrop-blur-sm hover:scale-[1.02] shadow-sm hover:shadow-lg",
        secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-100 hover:shadow-lg hover:shadow-slate-500/20 hover:scale-[1.02] border border-slate-600/40",
        ghost: "hover:bg-white/10 hover:text-white transition-all duration-300 hover:backdrop-blur-sm",
        link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300 transition-colors",
        premium: "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] border border-purple-500/30 hover:border-purple-400/50",
        gold: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-[1.02] border border-amber-500/30",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs font-medium",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
