import { useEffect, useState } from "react"
import {
  Car,
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Calendar,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import authService from "@/services/authService"
import dashboardService from "@/services/dashboardService"
import technicalService from "@/services/technicalService"
import type { DashboardAdmin, DashboardTecnico, OrderStatus } from "@/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorHandler"

export function DashboardHome() {
  const [adminData, setAdminData] = useState<DashboardAdmin | null>(null)
  const [tecnicoData, setTecnicoData] = useState<DashboardTecnico | null>(null)
  const [loading, setLoading] = useState(true)

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.roles.includes("ADMIN")
  const isTecnico = currentUser.roles.includes("TECNICO")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (isAdmin) {
          const data = await dashboardService.getAdminDashboard()
          setAdminData(data)
        } else if (isTecnico) {
          // Obtener technicalId resolviendo el perfil
          const technicians = await technicalService.getAllTechnicals()
          const myProfile = technicians.find(
            (t) =>
              t.user?.email === currentUser.email ||
              (t.user?.id && String(t.user?.id) === String(currentUser.id))
          )

          if (myProfile) {
            const data = await dashboardService.getTecnicoDashboard(
              myProfile.id
            )
            setTecnicoData(data)
          } else {
            toast.error("No se encontró perfil técnico")
          }
        }
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(error, "Error al cargar estadísticas del panel")
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAdmin, isTecnico, currentUser.email, currentUser.id])

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDIENTE":
        return (
          <Badge
            variant="secondary"
            className="border-none bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          >
            Pendiente
          </Badge>
        )
      case "EN_PROCESO":
        return (
          <Badge className="border-none bg-blue-100 text-blue-800 hover:bg-blue-100">
            En Proceso
          </Badge>
        )
      case "TERMINADO":
        return (
          <Badge className="border-none bg-green-100 text-green-800 hover:bg-green-100">
            Terminado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDIENTE":
        return <Clock className="size-4 text-amber-500" />
      case "EN_PROCESO":
        return <AlertCircle className="size-4 text-blue-500" />
      case "TERMINADO":
        return <CheckCircle2 className="size-4 text-green-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="animate-pulse text-sm text-muted-foreground">
            Cargando estadísticas...
          </p>
        </div>
      </div>
    )
  }

  // Common stats format for the top grid
  const stats = isAdmin
    ? [
        {
          title: "Vehículos",
          value: adminData?.totalVehicles || 0,
          description: "Total registrados",
          icon: <Car className="size-5 text-blue-500" />,
          trend: `${adminData?.newVehiclesThisWeek || 0} esta semana`,
          color: "from-blue-500/10 to-transparent",
        },
        {
          title: "Clientes",
          value: adminData?.totalCustomers || 0,
          description: "Clientes en base",
          icon: <Users className="size-5 text-purple-500" />,
          trend: `${adminData?.newCustomersThisWeek || 0} nuevos`,
          color: "from-purple-500/10 to-transparent",
        },
        {
          title: "Ordenes Hoy",
          value: adminData?.ordersToday || 0,
          description: "Servicios hoy",
          icon: <ClipboardList className="size-5 text-orange-500" />,
          trend: `${adminData?.completedToday || 0} terminadas`,
          color: "from-orange-500/10 to-transparent",
        },
      ]
    : [
        {
          title: "Mis Órdenes",
          value: tecnicoData?.totalMyOrders || 0,
          description: "Asignadas históricas",
          icon: <Wrench className="size-5 text-blue-500" />,
          trend: `${tecnicoData?.myPendingOrders || 0} pendientes`,
          color: "from-blue-500/10 to-transparent",
        },
        {
          title: "En Proceso",
          value: tecnicoData?.myInProcessOrders || 0,
          description: "Trabajando actualmente",
          icon: <AlertCircle className="size-5 text-orange-500" />,
          trend: "Prioritario",
          color: "from-orange-500/10 to-transparent",
        },
        {
          title: "Completadas",
          value: tecnicoData?.myCompletedOrders || 0,
          description: "Servicios finalizados",
          icon: <CheckCircle2 className="size-5 text-green-500" />,
          trend: "Buen trabajo",
          color: "from-green-500/10 to-transparent",
        },
      ]

  const recentOrders = isAdmin
    ? adminData?.recentOrders
    : tecnicoData?.myRecentOrders

  // Calcular porcentaje de ocupación (Admin: In Process / (Total orders active), simple logic)
  const calculateOccupancy = () => {
    if (!adminData) return 0
    const totalActive = adminData.pendingOrders + adminData.inProcessOrders
    if (totalActive === 0) return 0
    return Math.round((adminData.inProcessOrders / totalActive) * 100)
  }

  const occupancyPercent = isAdmin ? calculateOccupancy() : 0

  return (
    <div className="animate-in space-y-8 pb-10 duration-500 fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Gestión global del taller y estadísticas de negocio."
            : "Mi carga de trabajo y órdenes asignadas recientemente."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className={`overflow-hidden border-none bg-gradient-to-br shadow-md transition-all hover:scale-[1.02] ${stat.color}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-muted-foreground">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="rounded-lg border bg-background/50 p-2 shadow-sm">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-primary">
                <TrendingUp className="size-3" />
                <span>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-muted/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                {isAdmin
                  ? "Últimas órdenes generadas en el taller."
                  : "Mis últimos trabajos asignados."}
              </CardDescription>
            </div>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!recentOrders || recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <ClipboardList className="mb-2 size-10 opacity-20" />
                  <p className="text-sm">
                    No hay actividad reciente para mostrar
                  </p>
                </div>
              ) : (
                recentOrders.map((order, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-muted/30 bg-card/50 p-4 transition-all hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg border bg-background p-2.5 shadow-sm">
                        {getStatusIcon(order.status as OrderStatus)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="max-w-[200px] truncate text-sm font-bold">
                            {order.diagnosis || "Sin diagnóstico"}
                          </p>
                          {getStatusBadge(order.status as OrderStatus)}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {order.vehiclePlate} — {order.vehicleBrand}{" "}
                          {order.vehicleModel}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                          {order.customerName} | {order.technicalName}
                        </p>
                      </div>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        {format(new Date(order.date), "dd MMM, HH:mm", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {isAdmin ? (
          <Card className="group relative col-span-3 overflow-hidden border-dashed border-muted/20 bg-muted/10 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50" />
            <CardHeader>
              <CardTitle>Estado del Taller</CardTitle>
              <CardDescription>Operatividad en tiempo real.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-8">
              <div className="relative mb-8 size-40">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                    strokeDasharray="100"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray={`${occupancyPercent} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {occupancyPercent}%
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Ocupación
                  </span>
                </div>
              </div>
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-background p-3 shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Pendientes
                    </p>
                    <p className="text-xl font-bold">
                      {adminData?.pendingOrders}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-3 shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase">
                      En Proceso
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {adminData?.inProcessOrders}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="mb-1.5 flex justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      Eficiencia de flujo
                    </span>
                    <span className="font-bold">
                      {adminData?.completedOrders} completadas total
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="col-span-3 flex flex-col justify-center space-y-4 overflow-hidden border-dashed border-muted/20 bg-primary/5 p-6 text-center shadow-sm dark:bg-primary/10">
            <div className="mx-auto rounded-full bg-primary/10 p-4">
              <Wrench className="size-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                Mis Estadísticas
              </h3>
              <p className="mt-2 px-4 text-sm text-muted-foreground">
                Has completado un total de{" "}
                <span className="font-bold text-foreground">
                  {tecnicoData?.myCompletedOrders}
                </span>{" "}
                órdenes de servicio.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between rounded-xl border bg-background p-3 text-sm shadow-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Clock className="size-4 text-amber-500" /> Pendientes
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {tecnicoData?.myPendingOrders}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-background p-3 text-sm shadow-sm">
                <span className="flex items-center gap-2 font-medium">
                  <AlertCircle className="size-4 text-blue-500" /> En Proceso
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {tecnicoData?.myInProcessOrders}
                </span>
              </div>
            </div>
            <p className="pt-4 text-[10px] text-muted-foreground italic">
              * Recuerda actualizar el estado de tus órdenes una vez termines el
              trabajo.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
