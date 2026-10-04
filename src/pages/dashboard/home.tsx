import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Car,
  Users,
  ClipboardList,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Plus,
} from "lucide-react"
import { motion } from "motion/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import authService from "@/services/authService"
import dashboardService from "@/services/dashboardService"
import technicalService from "@/services/technicalService"
import type { DashboardAdmin, DashboardTecnico, OrderStatus } from "@/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorHandler"
import { StatCard } from "@/components/stats/stat-card"
import { PageShell } from "@/components/layout/page-shell"
import { cn } from "@/lib/utils"

const STATUS_BADGE: Record<
  OrderStatus,
  { variant: "pending" | "progress" | "done"; label: string }
> = {
  PENDIENTE: { variant: "pending", label: "Pendiente" },
  EN_PROCESO: { variant: "progress", label: "En Proceso" },
  TERMINADO: { variant: "done", label: "Terminado" },
}

function capitalizeFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 18) return "Buenas tardes"
  return "Buenas noches"
}

// ─── Status breakdown — used by the right panel ────────────────────────────
interface StatusBreakdown {
  pending: number
  progress: number
  done: number
}

function StatusBreakdownPanel({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: StatusBreakdown
}) {
  const total = data.pending + data.progress + data.done
  const safeTotal = total === 0 ? 1 : total
  const pendingPct = (data.pending / safeTotal) * 100
  const progressPct = (data.progress / safeTotal) * 100
  const donePct = (data.done / safeTotal) * 100

  const rows: Array<{
    label: string
    value: number
    color: string
    dot: string
  }> = [
    {
      label: "Pendientes",
      value: data.pending,
      color: "text-status-pending",
      dot: "bg-status-pending",
    },
    {
      label: "En proceso",
      value: data.progress,
      color: "text-status-progress",
      dot: "bg-status-progress",
    },
    {
      label: "Completadas",
      value: data.done,
      color: "text-status-done",
      dot: "bg-status-done",
    },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-eyebrow">Total activas</span>
            <span className="text-stat">{total}</span>
          </div>

          <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
            {total === 0 ? (
              <div className="h-full w-full bg-border/60" />
            ) : (
              <>
                <motion.div
                  className="h-full bg-status-pending"
                  initial={{ width: 0 }}
                  animate={{ width: `${pendingPct}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="h-full bg-status-progress"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.05,
                  }}
                />
                <motion.div
                  className="h-full bg-status-done"
                  initial={{ width: 0 }}
                  animate={{ width: `${donePct}%` }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  }}
                />
              </>
            )}
          </div>
        </div>

        <ul className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2.5 text-muted-foreground">
                <span className={cn("size-1.5 rounded-full", row.dot)} />
                {row.label}
              </span>
              <span className="text-num font-semibold text-foreground">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[124px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-7 h-72 rounded-xl md:col-span-4" />
        <Skeleton className="col-span-7 h-72 rounded-xl md:col-span-3" />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────
export default function DashboardHome() {
  const [adminData, setAdminData] = useState<DashboardAdmin | null>(null)
  const [tecnicoData, setTecnicoData] = useState<DashboardTecnico | null>(null)
  const [activeTechnicians, setActiveTechnicians] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.roles.includes("ADMIN")
  const isTecnico = currentUser.roles.includes("TECHNICAL")
  const userName = currentUser.displayName

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (isAdmin) {
          const [data, technicians] = await Promise.all([
            dashboardService.getAdminDashboard(),
            technicalService.getAllTechnicals(),
          ])
          setAdminData(data)
          setActiveTechnicians(
            technicians.filter((t) => t.user?.active === true).length,
          )
        } else if (isTecnico) {
          const technicians = await technicalService.getAllTechnicals()
          const myProfile = technicians.find(
            (t) =>
              t.user?.email === currentUser.email ||
              (t.user?.id && String(t.user?.id) === String(currentUser.id)),
          )
          if (myProfile) {
            const data = await dashboardService.getTecnicoDashboard(myProfile.id)
            setTecnicoData(data)
          } else {
            toast.error("No se encontró perfil técnico")
          }
        }
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(error, "Error al cargar estadísticas del panel"),
        )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAdmin, isTecnico, currentUser.email, currentUser.id])

  if (loading) return <DashboardSkeleton />

  const recentOrders = isAdmin
    ? adminData?.recentOrders
    : tecnicoData?.myRecentOrders

  const adminStats = [
    {
      title: "Técnicos activos",
      value: activeTechnicians,
      description: "Equipo operativo",
      icon: <ShieldCheck className="size-4" />,
    },
    {
      title: "Vehículos",
      value: adminData?.totalVehicles ?? 0,
      description: "Total registrados",
      trend: adminData?.newVehiclesThisWeek
        ? `+${adminData.newVehiclesThisWeek} esta semana`
        : undefined,
      icon: <Car className="size-4" />,
    },
    {
      title: "Clientes",
      value: adminData?.totalCustomers ?? 0,
      description: "En base de datos",
      trend: adminData?.newCustomersThisWeek
        ? `+${adminData.newCustomersThisWeek} nuevos`
        : undefined,
      icon: <Users className="size-4" />,
    },
    {
      title: "Órdenes hoy",
      value: adminData?.ordersToday ?? 0,
      description: "Servicios del día",
      trend: adminData?.completedToday
        ? `${adminData.completedToday} terminadas`
        : undefined,
      icon: <ClipboardList className="size-4" />,
    },
  ]

  const tecnicoStats = [
    {
      title: "Mis órdenes",
      value: tecnicoData?.totalMyOrders ?? 0,
      description: "Historial asignadas",
      icon: <Wrench className="size-4" />,
    },
    {
      title: "En proceso",
      value: tecnicoData?.myInProcessOrders ?? 0,
      description: "Trabajo activo",
      trend: "Prioritario",
      icon: <ClipboardList className="size-4" />,
    },
    {
      title: "Completadas",
      value: tecnicoData?.myCompletedOrders ?? 0,
      description: "Servicios finalizados",
      icon: <CheckCircle2 className="size-4" />,
    },
  ]

  const stats = isAdmin ? adminStats : tecnicoStats

  const breakdown: StatusBreakdown = isAdmin
    ? {
        pending: adminData?.pendingOrders ?? 0,
        progress: adminData?.inProcessOrders ?? 0,
        done: adminData?.completedOrders ?? 0,
      }
    : {
        pending: tecnicoData?.myPendingOrders ?? 0,
        progress: tecnicoData?.myInProcessOrders ?? 0,
        done: tecnicoData?.myCompletedOrders ?? 0,
      }

  return (
    <PageShell>
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="text-h1">
            {getGreeting()},{" "}
            <span className="text-brand">{userName}</span>
          </h1>
          <p className="text-body-sm text-muted-foreground">
            {isAdmin
              ? "Resumen de operaciones del taller."
              : "Tu carga de trabajo y órdenes asignadas."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caption hidden sm:inline">
            {capitalizeFirst(format(new Date(), "EEEE, dd MMM", { locale: es }))}
          </span>
          <Button asChild>
            <Link to="/dashboard/orders">
              <Plus className="size-4" />
              Nueva orden
            </Link>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-3 md:gap-4",
          isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {stats.map((stat, i) => (
          <StatCard key={stat.title} index={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>
                {isAdmin
                  ? "Últimas órdenes generadas en el taller."
                  : "Tus últimos trabajos asignados."}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/dashboard/orders"
                className="text-xs text-brand hover:text-brand"
              >
                Ver todas
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {!recentOrders || recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <ClipboardList className="size-7 opacity-40" />
                <p className="text-sm">Sin actividad reciente</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {recentOrders.map((order, i) => {
                  const statusInfo = STATUS_BADGE[order.status as OrderStatus]
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.05 + i * 0.04,
                      }}
                      className="flex items-center gap-3 py-3 first:pt-1 last:pb-1"
                    >
                      <Badge
                        variant={statusInfo?.variant ?? "outline"}
                        className="shrink-0"
                      >
                        {statusInfo?.label ?? order.status}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium leading-none">
                          {order.diagnosis || "Sin diagnóstico"}
                        </p>
                        <p className="mt-1 truncate text-caption">
                          <span className="text-mono text-foreground/75">
                            {order.vehiclePlate}
                          </span>{" "}
                          · {order.vehicleBrand} {order.vehicleModel}
                        </p>
                      </div>
                      <p className="text-num shrink-0 text-xs text-muted-foreground">
                        {format(new Date(order.date), "dd MMM", {
                          locale: es,
                        })}
                      </p>
                    </motion.li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="col-span-7 md:col-span-3">
          <StatusBreakdownPanel
            title={isAdmin ? "Estado del taller" : "Mi estado"}
            description={
              isAdmin
                ? "Distribución de órdenes por estado."
                : "Distribución de tus órdenes asignadas."
            }
            data={breakdown}
          />
        </div>
      </div>
    </PageShell>
  )
}
