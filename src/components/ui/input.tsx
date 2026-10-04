import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground transition-[border-color,box-shadow,background-color] duration-150 ease-(--ease-out-quart) outline-none",
        "placeholder:text-muted-foreground placeholder:font-normal",
        "selection:bg-accent selection:text-accent-foreground",
        "hover:border-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-muted/40",
        "aria-invalid:border-destructive/60 aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
        "dark:bg-white/[0.025] dark:focus-visible:bg-white/[0.04] dark:aria-invalid:border-destructive/55 dark:aria-invalid:ring-destructive/25",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
