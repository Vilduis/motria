import { cn } from "@/lib/utils"

interface PageShellProps {
  children: React.ReactNode
  className?: string
}

/**
 * Layout wrapper for every dashboard sub-page. Provides consistent vertical
 * spacing and bottom padding. The page-enter animation is owned by the
 * route-level transition in `dashboard-view.tsx` — keep this component
 * motion-free to avoid compounded reveals.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("flex flex-col gap-6 pb-10", className)}>{children}</div>
  )
}
