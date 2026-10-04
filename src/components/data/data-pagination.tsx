import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataPaginationProps {
  page: number
  pageCount: number
  start: number
  end: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * Footer for a paginated table card: "1–15 de 48" plus previous/next.
 * Renders nothing when everything fits on one page.
 */
export function DataPagination({
  page,
  pageCount,
  start,
  end,
  total,
  onPageChange,
  className,
}: DataPaginationProps) {
  const ref = useRef<HTMLElement>(null)

  if (pageCount <= 1) return null

  const goTo = (next: number) => {
    onPageChange(next)
    // Bring the top of the table back into view when paging from the bottom.
    const card = ref.current?.parentElement
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ block: "start" })
    }
  }

  return (
    <nav
      ref={ref}
      aria-label="Paginación"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-3 py-2.5",
        className
      )}
    >
      <p className="text-caption text-num">
        {start}–{end} de {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        <span
          className="text-num min-w-[6.5rem] text-center text-[13px] text-muted-foreground"
          aria-live="polite"
        >
          Página <span className="font-semibold text-foreground">{page}</span>{" "}
          de {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount}
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}
