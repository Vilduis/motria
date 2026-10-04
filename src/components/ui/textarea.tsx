import * as React from "react"

import { cn } from "@/lib/utils"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm transition-colors duration-[120ms] outline-none resize-none",
          "placeholder:text-muted-foreground hover:border-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "dark:bg-white/[0.03]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
