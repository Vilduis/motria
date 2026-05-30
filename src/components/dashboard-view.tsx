import { Suspense, useEffect, useState } from "react"
import { useLocation, Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { CommandPalette } from "@/components/command-palette"
import { Loader2, Search } from "lucide-react"

function RouteFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  )
}

const PAGE_LABELS: Record<string, string> = {
  "/dashboard": "Inicio",
  "/dashboard/customers": "Clientes",
  "/dashboard/vehicles": "Vehículos",
  "/dashboard/orders": "Órdenes de Servicio",
  "/dashboard/technicians": "Técnicos",
  "/dashboard/users": "Usuarios",
  "/dashboard/account": "Mi Cuenta",
}

function DashboardHeader({
  onOpenPalette,
}: {
  onOpenPalette: () => void
}) {
  const { pathname } = useLocation()
  const label = PAGE_LABELS[pathname] ?? "Dashboard"
  const isHome = pathname === "/dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-3 backdrop-blur-md md:px-4">
      <SidebarTrigger className="-ml-1 size-7 rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground" />
      <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-[12.5px]">
          {!isHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-border" />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              {label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-7 items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-2 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-secondary/70 hover:text-foreground dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
        aria-label="Buscar"
      >
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Buscar</span>
        <kbd className="ml-1 hidden h-4 items-center rounded border border-border/70 bg-background px-1 text-[9.5px] font-medium text-foreground/70 sm:inline-flex">
          ⌘K
        </kbd>
      </button>
      <ModeToggle />
    </header>
  )
}

function AnimatedOutlet() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex flex-1 flex-col"
      >
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export function DashboardView({ onLogout }: { onLogout?: () => void }) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"
      if (isShortcut) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar onLogout={onLogout} />
      <SidebarInset>
        <DashboardHeader onOpenPalette={() => setPaletteOpen(true)} />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <AnimatedOutlet />
        </div>
      </SidebarInset>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </SidebarProvider>
  )
}
