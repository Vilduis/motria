import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DataToolbarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  count?: number
  countLabel?: string
  actions?: React.ReactNode
  filters?: React.ReactNode
  className?: string
}

export function DataToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  count,
  countLabel,
  actions,
  filters,
  className,
}: DataToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {onSearchChange && (
        <div className="relative w-full max-w-xs flex-shrink">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 pl-8 text-[13px]"
            aria-label="Buscar"
          />
        </div>
      )}
      {filters}
      {count !== undefined && (
        <span className="text-caption text-num">
          {count} {countLabel ?? (count === 1 ? "resultado" : "resultados")}
        </span>
      )}
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  )
}
