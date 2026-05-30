import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium tracking-[-0.005em] whitespace-nowrap transition-colors duration-[120ms] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-border/70 bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive/25 bg-destructive/10 text-destructive dark:bg-destructive/15",
        outline:
          "border-border/80 text-foreground/85",
        ghost:
          "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        /* Status variants — order/job states */
        pending:
          "border-status-pending/30 bg-status-pending-bg text-status-pending dark:border-status-pending/25",
        progress:
          "border-status-progress/30 bg-status-progress-bg text-status-progress dark:border-status-progress/25",
        done:
          "border-status-done/30 bg-status-done-bg text-status-done dark:border-status-done/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
