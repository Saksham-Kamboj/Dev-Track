import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border/50",
        // Status variants - matching the design
        "in-progress": "border-transparent bg-blue-500/15 text-blue-400 hover:bg-blue-500/20",
        backlog: "border-transparent bg-gray-500/15 text-gray-400 hover:bg-gray-500/20",
        todo: "border-transparent bg-purple-500/15 text-purple-400 hover:bg-purple-500/20",
        done: "border-transparent bg-green-500/15 text-green-400 hover:bg-green-500/20",
        cancelled: "border-transparent bg-red-500/15 text-red-400 hover:bg-red-500/20",
        // Priority variants - matching the design
        high: "border-transparent bg-red-500/15 text-red-400 hover:bg-red-500/20",
        medium: "border-transparent bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/20",
        low: "border-transparent bg-green-500/15 text-green-400 hover:bg-green-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
