import { cn } from "@/lib/utils/utils"
import * as React from "react"

type TButtonNav = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  classname?: string
  children?: React.ReactNode
}

export const ButtonNav = React.forwardRef<HTMLButtonElement, TButtonNav>(
  ({ classname, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={
          cn(classname) +
          `flex h-12 items-center justify-center rounded-full border-t border-border bg-background px-4 shadow-lg shadow-border hover:bg-accent`
        }
        {...props}
      >
        {children}
      </button>
    )
  }
)
ButtonNav.displayName = "ButtonNav"
