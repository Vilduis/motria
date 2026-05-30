import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
  className?: string
}

export function ModeToggle({ className }: ModeToggleProps) {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60",
            className
          )}
        >
          <Sun className="size-4 scale-100 rotate-0 transition-transform duration-300 ease-expo dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-300 ease-expo dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-elevated"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "cursor-pointer gap-2 rounded-md text-sm",
            theme === "light" && "bg-secondary/60"
          )}
        >
          <Sun className="size-3.5" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "cursor-pointer gap-2 rounded-md text-sm",
            theme === "dark" && "bg-secondary/60"
          )}
        >
          <Moon className="size-3.5" />
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "cursor-pointer gap-2 rounded-md text-sm",
            theme === "system" && "bg-secondary/60"
          )}
        >
          <span className="flex size-3.5 items-center justify-center">
            <span className="size-2 rounded-full bg-current opacity-60" />
          </span>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
