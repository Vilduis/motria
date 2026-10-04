import { useEffect, useState, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Pencil,
  ClipboardCheck,
  Calendar,
  Car,
  User as UserIcon,
  Wrench,
  Plus,
} from "lucide-react"
import orderService from "@/services/orderService"
import vehicleService from "@/services/vehicleService"
import technicalService from "@/services/technicalService"
import authService from "@/services/authService"
import type {
  ServiceOrder,
  DTOServiceOrder,
  Vehicle,
  Technical,
  OrderStatus,
} from "@/types"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getErrorMessage } from "@/lib/errorHandler"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/data/empty-state"
import { LoadingRows } from "@/components/data/loading-rows"
import { DataToolbar } from "@/components/data/data-toolbar"
import { RowActions } from "@/components/data/row-actions"
import { ConfirmDialog } from "@/components/data/confirm-dialog"
import { useTableFilter } from "@/hooks/use-table-filter"
import { usePagination } from "@/hooks/use-pagination"
import { EntityCombobox } from "@/components/data/entity-combobox"
import { DataPagination } from "@/components/data/data-pagination"

const STATUS_BADGE: Record<
  OrderStatus,
  { variant: "pending" | "progress" | "done"; label: string }
> = {
  PENDIENTE: { variant: "pending", label: "Pendiente" },
  EN_PROCESO: { variant: "progress", label: "En Proceso" },
  TERMINADO: { variant: "done", label: "Terminado" },
}

const STATUS_FILTER_OPTIONS: Array<{
  value: "ALL" | OrderStatus
  label: string
}> = [
  { value: "ALL", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "TERMINADO", label: "Terminado" },
]

export default function ServiceOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [technicians, setTechnicians] = useState<Technical[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ServiceOrder | null>(null)
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTER_OPTIONS)[number]["value"]>("ALL")

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.roles.includes("ADMIN")
  const isTecnico = currentUser.roles.includes("TECHNICAL")

  const [formData, setFormData] = useState<DTOServiceOrder>({
    vehicleId: 0,
    customerId: 0,
    technicalId: 0,
    diagnosis: "",
    status: "PENDIENTE",
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [vData, tData] = await Promise.all([
        vehicleService.getAllVehicles(),
        technicalService.getAllTechnicals(),
      ])
      setVehicles(vData)
      setTechnicians(tData)

      let oData: ServiceOrder[] = []
      if (isTecnico && !isAdmin) {
        const myProfile = tData.find(
          (t) =>
            t.user?.email === currentUser.email ||
            (t.user?.id && String(t.user?.id) === String(currentUser.id))
        )
        if (myProfile) {
          oData = await orderService.getOrdersByTechnical(myProfile.id)
        } else {
          toast.error("No se encontró perfil técnico para este usuario")
        }
      } else {
        oData = await orderService.getAllOrders()
      }
      setOrders(oData)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cargar datos"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSearchable = useCallback(
    (o: ServiceOrder) =>
      `${o.id} ${o.diagnosis} ${o.vehicle?.plate ?? ""} ${o.vehicle?.brand ?? ""} ${
        o.vehicle?.model ?? ""
      } ${o.customer?.name ?? ""} ${o.customer?.lastName ?? ""} ${
        o.technical?.name ?? ""
      } ${o.technical?.lastName ?? ""}`,
    []
  )
  const {
    query,
    setQuery,
    filtered: searchFiltered,
  } = useTableFilter(orders, getSearchable)
  const filtered =
    statusFilter === "ALL"
      ? searchFiltered
      : searchFiltered.filter((o) => o.status === statusFilter)
  const pagination = usePagination(filtered, {
    resetKey: `${query}|${statusFilter}`,
  })

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId)
  const orderCustomer = selectedVehicle?.customer ?? editingOrder?.customer
  const orderCustomerName = orderCustomer
    ? `${orderCustomer.name} ${orderCustomer.lastName}`
    : ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!(isTecnico && !isAdmin) && formData.vehicleId === 0) {
      toast.warning("Selecciona el vehículo de la orden")
      document.getElementById("order-vehicle")?.focus()
      return
    }
    try {
      if (editingOrder) {
        if (isTecnico && !isAdmin) {
          await orderService.updateOrderStatus(
            editingOrder.id,
            formData.status || "PENDIENTE"
          )
          toast.success("Estado de orden actualizado")
        } else {
          await orderService.updateOrder(editingOrder.id, formData)
          toast.success("Orden actualizada correctamente")
        }
      } else {
        await orderService.createOrder(formData)
        toast.success("Orden de servicio creada")
      }
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al procesar la solicitud"))
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await orderService.deleteOrder(pendingDelete.id)
      toast.success("Orden eliminada")
      fetchData()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar orden"))
    } finally {
      setPendingDelete(null)
    }
  }

  const handleEdit = (order: ServiceOrder) => {
    setEditingOrder(order)
    setFormData({
      vehicleId: order.vehicle?.id || 0,
      customerId: order.customer?.id || 0,
      technicalId: order.technical?.id || 0,
      diagnosis: order.diagnosis,
      status: order.status,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingOrder(null)
    setFormData({
      vehicleId: 0,
      customerId: 0,
      technicalId: 0,
      diagnosis: "",
      status: "PENDIENTE",
    })
  }

  const adminDialog = (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5" />
          Nueva orden
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? "Editar orden" : "Nueva orden de servicio"}
          </DialogTitle>
          <DialogDescription>
            {editingOrder
              ? "Modifica el diagnóstico, vehículo o técnico asignado."
              : "Registra el diagnóstico inicial y asigna un técnico."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="order-vehicle">Vehículo</Label>
            <EntityCombobox
              id="order-vehicle"
              value={formData.vehicleId}
              onChange={(id) => {
                // The vehicle's owner becomes the order's customer.
                const vehicle = vehicles.find((v) => v.id === id)
                setFormData({
                  ...formData,
                  vehicleId: id,
                  customerId: vehicle?.customer?.id ?? 0,
                })
              }}
              options={vehicles.map((v) => ({
                value: v.id,
                label: `${v.plate} · ${v.brand} ${v.model}`,
                description: v.customer
                  ? `${v.customer.name} ${v.customer.lastName} · ${v.customer.phone}`
                  : "Sin dueño registrado",
              }))}
              placeholder="Selecciona un vehículo"
              searchPlaceholder="Buscar por placa, marca, modelo o dueño"
              emptyText="Ningún vehículo coincide. Regístralo en Vehículos."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="order-customer">Cliente</Label>
              <Input
                id="order-customer"
                readOnly
                tabIndex={-1}
                value={orderCustomerName}
                placeholder="Se completa con el vehículo"
                className="truncate bg-muted text-foreground hover:border-input focus-visible:ring-0 dark:bg-white/[0.04]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-technical">Técnico asignado</Label>
              <EntityCombobox
                id="order-technical"
                value={formData.technicalId}
                onChange={(id) => setFormData({ ...formData, technicalId: id })}
                options={technicians.map((t) => ({
                  value: t.id,
                  label: `${t.name} ${t.lastName}`,
                  description: t.specialty,
                }))}
                placeholder="Selecciona..."
                searchPlaceholder="Buscar por nombre o especialidad"
                emptyText="Ningún técnico coincide."
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              required
              placeholder="Describe el problema del vehículo..."
              className="min-h-[100px]"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
            />
          </div>
          {editingOrder && (
            <div className="space-y-1.5">
              <Label>Estado actual</Label>
              <div className="flex h-9 items-center">
                <Badge
                  variant={
                    STATUS_BADGE[editingOrder.status]?.variant ?? "outline"
                  }
                >
                  {STATUS_BADGE[editingOrder.status]?.label ??
                    editingOrder.status}
                </Badge>
              </div>
              <p className="text-caption">
                El estado solo puede actualizarlo el técnico asignado.
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {editingOrder ? "Guardar cambios" : "Crear orden"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  const techStatusDialog = !isAdmin && isTecnico && (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Actualizar estado de orden</DialogTitle>
          <DialogDescription>
            Cambia el estado del trabajo según el progreso real.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-eyebrow">Diagnóstico</p>
            <p className="rounded-lg border border-border/70 bg-secondary/40 p-3 text-[13px] text-foreground/85 dark:bg-white/[0.02]">
              {editingOrder?.diagnosis}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status-tech">Nuevo estado</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                setFormData({ ...formData, status: val as OrderStatus })
              }
            >
              <SelectTrigger id="status-tech" className="w-full">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="EN_PROCESO">En proceso</SelectItem>
                <SelectItem value="TERMINADO">Terminado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Actualizar estado</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <PageShell>
      <PageHeader
        title="Órdenes de servicio"
        description="Control de reparaciones y diagnósticos técnicos."
        action={isAdmin ? adminDialog : undefined}
      />

      <DataToolbar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar placa, cliente o técnico"
        count={loading ? undefined : filtered.length}
        filters={
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(
                v as (typeof STATUS_FILTER_OPTIONS)[number]["value"]
              )
            }
          >
            <SelectTrigger size="sm" className="h-8 min-w-[160px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {techStatusDialog}

      <div className="scroll-mt-16 overflow-hidden rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[70px] md:table-cell">
                ID
              </TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead>Vehículo y dueño</TableHead>
              <TableHead className="hidden md:table-cell">Técnico</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingRows cols={6} />
            ) : filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="p-0">
                  <EmptyState
                    icon={ClipboardCheck}
                    title={
                      query || statusFilter !== "ALL"
                        ? "Sin coincidencias"
                        : "Sin órdenes aún"
                    }
                    description={
                      query || statusFilter !== "ALL"
                        ? "Ajusta los filtros o el término de búsqueda."
                        : isAdmin
                          ? "Crea la primera orden de servicio con el botón de arriba."
                          : "Aún no tienes órdenes asignadas."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              pagination.pageItems.map((order) => {
                const statusInfo = STATUS_BADGE[order.status]
                const actions = [
                  {
                    label: isAdmin ? "Editar" : "Cambiar estado",
                    icon: isAdmin ? (
                      <Pencil className="size-3.5" />
                    ) : (
                      <ClipboardCheck className="size-3.5" />
                    ),
                    onSelect: () => handleEdit(order),
                  },
                  ...(isAdmin
                    ? [
                        {
                          label: "Eliminar",
                          icon: <Trash2 className="size-3.5" />,
                          variant: "destructive" as const,
                          separatorBefore: true,
                          onSelect: () => setPendingDelete(order),
                        },
                      ]
                    : []),
                ]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="text-mono hidden text-muted-foreground md:table-cell">
                      #{order.id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-[13px]">
                        <Calendar className="size-3 shrink-0 text-muted-foreground" />
                        {order.date
                          ? format(new Date(order.date), "dd MMM yyyy", {
                              locale: es,
                            })
                          : "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-caption md:hidden">
                          <span className="text-mono text-foreground">
                            #{order.id}
                          </span>
                          {order.date &&
                            ` · ${format(new Date(order.date), "dd MMM", { locale: es })}`}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13.5px] font-medium">
                          <Car className="size-3 shrink-0 text-muted-foreground" />
                          <span className="text-mono tracking-wider">
                            {order.vehicle?.plate}
                          </span>
                          <span className="font-normal text-muted-foreground">
                            ({order.vehicle?.brand})
                          </span>
                        </div>
                        <div className="text-caption flex items-center gap-1.5">
                          <UserIcon className="size-3 shrink-0" />
                          {order.customer?.name} {order.customer?.lastName}
                        </div>
                        <div className="text-caption flex items-center gap-1.5 md:hidden">
                          <Wrench className="size-3 shrink-0" />
                          {order.technical
                            ? `${order.technical.name} ${order.technical.lastName}`
                            : "Sin asignar"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <Wrench className="size-3 shrink-0" />
                        {order.technical
                          ? `${order.technical.name} ${order.technical.lastName}`
                          : "Sin asignar"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo?.variant ?? "outline"}>
                        {statusInfo?.label ?? order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions actions={actions} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <DataPagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          start={pagination.start}
          end={pagination.end}
          total={pagination.total}
          onPageChange={pagination.setPage}
        />
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="¿Eliminar orden?"
        description={
          <>
            Esta acción eliminará la orden{" "}
            <span className="text-mono font-semibold text-foreground">
              #{pendingDelete?.id}
            </span>{" "}
            del vehículo{" "}
            <span className="text-mono font-semibold text-foreground">
              {pendingDelete?.vehicle?.plate}
            </span>{" "}
            de forma permanente.
          </>
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </PageShell>
  )
}
