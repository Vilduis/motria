import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  CornerDownLeft,
  LayoutDashboard,
  Users,
  Car,
  List,
  Wrench,
  User as UserIcon,
  CircleUserRound,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import authService from "@/services/authService"
import { cn } from "@/lib/utils"

type Role = "ADMIN" | "TECHNICAL"

interface Command {
  id: string
  title: string
  group: string
  icon: React.ReactNode
  to: string
  roles?: Role[]
  keywords?: string[]
}

const COMMANDS: Command[] = [
  {
    id: "home",
    title: "Inicio",
    group: "Navegación",
    icon: <LayoutDashboard className="size-4" />,
    to: "/dashboard",
    keywords: ["dashboard", "home", "panel"],
  },
  {
    id: "customers",
    title: "Clientes",
    group: "Navegación",
    icon: <Users className="size-4" />,
    to: "/dashboard/customers",
  },
  {
    id: "vehicles",
    title: "Vehículos",
    group: "Navegación",
    icon: <Car className="size-4" />,
    to: "/dashboard/vehicles",
    keywords: ["autos", "carros"],
  },
  {
    id: "orders",
    title: "Órdenes de servicio",
    group: "Navegación",
    icon: <List className="size-4" />,
    to: "/dashboard/orders",
    keywords: ["ordenes", "servicios", "trabajos"],
  },
  {
    id: "technicians",
    title: "Técnicos",
    group: "Administración",
    icon: <Wrench className="size-4" />,
    to: "/dashboard/technicians",
    roles: ["ADMIN"],
  },
  {
    id: "users",
    title: "Usuarios",
    group: "Administración",
    icon: <UserIcon className="size-4" />,
    to: "/dashboard/users",
    roles: ["ADMIN"],
  },
  {
    id: "account",
    title: "Mi cuenta",
    group: "Cuenta",
    icon: <CircleUserRound className="size-4" />,
    to: "/dashboard/account",
  },
]

function matches(cmd: Command, q: string): boolean {
  if (!q) return true
  const haystack = [cmd.title, cmd.group, ...(cmd.keywords ?? [])]
    .join(" ")
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((part) => haystack.includes(part))
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const [query, setQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)

  const visible = useMemo(
    () =>
      COMMANDS.filter(
        (c) =>
          !c.roles ||
          c.roles.some((r) => currentUser.roles.includes(r)),
      ).filter((c) => matches(c, query)),
    [query, currentUser.roles],
  )

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setActiveIdx(0)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("")
      setActiveIdx(0)
    }
    onOpenChange(next)
  }

  const select = (cmd: Command) => {
    navigate(cmd.to)
    handleOpenChange(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, visible.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const cmd = visible[activeIdx]
      if (cmd) select(cmd)
    }
  }

  // Group results by group label
  const grouped = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    visible.forEach((c) => {
      groups[c.group] = groups[c.group] ?? []
      groups[c.group].push(c)
    })
    return groups
  }, [visible])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 p-0 sm:max-w-[560px]"
      >
        <div className="flex items-center gap-2.5 border-b border-border/80 px-4">
          <Search className="size-4 shrink-0 text-muted-foreground/70" />
          <input
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Buscar páginas, acciones..."
            className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/45"
          />
          <kbd className="hidden h-5 items-center rounded border border-border/70 bg-secondary/50 px-1.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-10 text-center">
              <p className="text-sm text-foreground">Sin resultados</p>
              <p className="text-caption">
                Prueba con otro término de búsqueda.
              </p>
            </div>
          ) : (
            <ul role="listbox" className="space-y-3">
              {Object.entries(grouped).map(([groupName, items]) => (
                <li key={groupName}>
                  <div className="text-eyebrow mb-1 px-2">{groupName}</div>
                  <ul className="space-y-px">
                    {items.map((cmd) => {
                      const idx = visible.indexOf(cmd)
                      const active = idx === activeIdx
                      return (
                        <li key={cmd.id}>
                          <button
                            type="button"
                            onClick={() => select(cmd)}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13.5px] transition-colors",
                              active
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            <span
                              className={cn(
                                "shrink-0 transition-colors",
                                active
                                  ? "text-brand"
                                  : "text-muted-foreground/60",
                              )}
                            >
                              {cmd.icon}
                            </span>
                            <span className="flex-1 truncate text-left font-medium">
                              {cmd.title}
                            </span>
                            {active && (
                              <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground/70" />
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/80 bg-secondary/35 px-4 py-2 text-[10.5px] text-muted-foreground dark:bg-white/[0.015]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border/70 bg-background px-1 text-[9.5px] font-medium text-foreground/70">
                ↑↓
              </kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border/70 bg-background px-1 text-[9.5px] font-medium text-foreground/70">
                ↵
              </kbd>
              Abrir
            </span>
          </div>
          <span className="font-medium">Motria</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
