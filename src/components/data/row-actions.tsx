import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface RowAction {
  label: string
  icon?: React.ReactNode
  onSelect: () => void
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  disabled?: boolean
}

interface RowActionsProps {
  actions: RowAction[]
  label?: string
  align?: "start" | "end"
  className?: string
}

export function RowActions({
  actions,
  label = "Acciones",
  align = "end",
  className,
}: RowActionsProps) {
  if (actions.length === 0) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className={cn(
            "size-7 text-muted-foreground/70 hover:text-foreground",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={6}
        className="min-w-[160px] border-border/80 shadow-elevated"
      >
        {actions.map((action, i) => (
          <span key={`${action.label}-${i}`}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              variant={action.variant}
              disabled={action.disabled}
              onSelect={(e) => {
                e.preventDefault()
                action.onSelect()
              }}
              className="gap-2 text-[13px]"
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          </span>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
