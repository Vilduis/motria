import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
  className?: string
}

/**
 * Single-click light/dark switch. Until the user clicks, the theme follows the
 * operating system ("system"); a click stores the explicit choice.
 */
export function ModeToggle({ className }: ModeToggleProps) {
  const { setTheme, theme } = useTheme()

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "size-8 text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-transform duration-300 ease-expo dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-300 ease-expo dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
