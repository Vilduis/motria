import * as React from "react"

import { cn } from "@/lib/utils"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors duration-[120ms] outline-none resize-none",
          "placeholder:text-muted-foreground/50",
          "focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15",
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
