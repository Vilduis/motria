import { motion } from "motion/react"
import { Car, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type MockStatus = "PENDIENTE" | "EN_PROCESO" | "TERMINADO"

interface MockOrder {
  id: number
  plate: string
  brand: string
  customer: string
  tech: string
  status: MockStatus
}

const DEFAULT_ORDERS: MockOrder[] = [
  {
    id: 1248,
    plate: "ABC-123",
    brand: "Toyota Corolla",
    customer: "Juan Pérez",
    tech: "R. García",
    status: "EN_PROCESO",
  },
  {
    id: 1247,
    plate: "XYZ-789",
    brand: "Honda Civic",
    customer: "María López",
    tech: "C. Ramos",
    status: "PENDIENTE",
  },
  {
    id: 1246,
    plate: "MNO-456",
    brand: "Hyundai Tucson",
    customer: "Pedro Silva",
    tech: "A. Torres",
    status: "TERMINADO",
  },
  {
    id: 1245,
    plate: "DEF-321",
    brand: "Kia Sportage",
    customer: "Ana Flores",
    tech: "R. García",
    status: "EN_PROCESO",
  },
]

const STATUS_MAP: Record<
  MockStatus,
  { variant: "pending" | "progress" | "done"; label: string }
> = {
  PENDIENTE: { variant: "pending", label: "Pendiente" },
  EN_PROCESO: { variant: "progress", label: "En Proceso" },
  TERMINADO: { variant: "done", label: "Terminado" },
}

const ease = [0.16, 1, 0.3, 1] as const

interface ProductPreviewProps {
  orders?: MockOrder[]
  /** When true, hide the optional columns to fit narrower spaces (auth layout). */
  compact?: boolean
  className?: string
  /** Delay before rows start animating in, useful when used inside a delayed parent. */
  rowDelayBase?: number
}

export function ProductPreview({
  orders = DEFAULT_ORDERS,
  compact = false,
  className,
  rowDelayBase = 0.3,
}: ProductPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card shadow-modal",
        className,
      )}
    >
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-semibold text-foreground">
            Órdenes de servicio
          </span>
          <Badge variant="outline" className="h-[18px] px-1.5 text-[10px]">
            {orders.length} activas
          </Badge>
        </div>
        <span
          aria-hidden
          className="inline-flex h-7 items-center gap-1.5 rounded-md bg-brand px-2 text-[11px] font-medium text-brand-foreground"
        >
          <Plus className="size-3" />
          Nueva
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
        <div className="relative w-full max-w-[200px]">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground/60" />
          <div className="h-6 rounded-md border border-border/70 bg-secondary/40 pl-7 text-[10.5px] leading-6 text-muted-foreground/55">
            Buscar...
          </div>
        </div>
        <span className="text-caption text-num">
          {orders.length} resultados
        </span>
      </div>

      {/* Table header */}
      <div
        className={cn(
          "grid gap-3 border-b border-border/40 px-4 py-2",
          compact
            ? "grid-cols-[1.4fr_1fr_auto]"
            : "grid-cols-[1.2fr_1fr_0.8fr_auto]",
        )}
      >
        <span className="text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground/55">
          Vehículo
        </span>
        <span className="text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground/55">
          Cliente
        </span>
        {!compact && (
          <span className="text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground/55">
            Técnico
          </span>
        )}
        <span className="text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground/55">
          Estado
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/40">
        {orders.map((order, i) => {
          const s = STATUS_MAP[order.status]
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease,
                delay: rowDelayBase + i * 0.07,
              }}
              className={cn(
                "grid items-center gap-3 px-4 py-2.5",
                compact
                  ? "grid-cols-[1.4fr_1fr_auto]"
                  : "grid-cols-[1.2fr_1fr_0.8fr_auto]",
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-secondary/40">
                  <Car className="size-3 text-muted-foreground/70" />
                </div>
                <div className="min-w-0">
                  <div className="text-mono text-[11.5px] font-semibold tracking-wider text-foreground">
                    {order.plate}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground/70">
                    {order.brand}
                  </div>
                </div>
              </div>
              <div className="truncate text-[11.5px] text-foreground/80">
                {order.customer}
              </div>
              {!compact && (
                <div className="truncate text-[11.5px] text-muted-foreground">
                  {order.tech}
                </div>
              )}
              <Badge
                variant={s.variant}
                className="h-[18px] px-1.5 text-[10px]"
              >
                {s.label}
              </Badge>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
