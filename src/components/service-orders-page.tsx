import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
} from "lucide-react"
import orderService from "@/services/orderService"
import vehicleService from "@/services/vehicleService"
import customerService from "@/services/customerService"
import technicalService from "@/services/technicalService"
import type {
  ServiceOrder,
  DTOServiceOrder,
  Vehicle,
  Customer,
  Technical,
  OrderStatus,
} from "@/types"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import authService from "@/services/authService"

export function ServiceOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [technicians, setTechnicians] = useState<Technical[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null)

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.roles.includes("ADMIN")
  const isTecnico = currentUser.roles.includes("TECNICO")

  // Form state
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
      // Cargar catálogos
      const [vData, cData, tData] = await Promise.all([
        vehicleService.getAllVehicles(),
        customerService.getAllCustomers(),
        technicalService.getAllTechnicals(),
      ])

      setVehicles(vData)
      setCustomers(cData)
      setTechnicians(tData)

      // Cargar órdenes según rol
      let oData: ServiceOrder[] = []
      if (isTecnico && !isAdmin) {
        // Buscar el perfil de técnico del usuario actual
        // currentUser.id viene de localStorage (string), t.user?.id es number
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
    } catch (error) {
      toast.error("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Si es técnico y está editando, solo permitimos cambiar estado vía PATCH (o update normal si el backend lo permite)
    // El controlador dice: updateServiceOrder (ADMIN) vs updateStatus (TECNICO)

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
    } catch (error) {
      toast.error("Error al procesar la solicitud")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await orderService.deleteOrder(id)
      toast.success("Orden eliminada")
      fetchData()
    } catch (error) {
      toast.error("Error al eliminar orden")
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

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Órdenes de Servicio
          </h2>
          <p className="text-muted-foreground">
            Control de reparaciones y diagnósticos técnicos.
          </p>
        </div>
        {isAdmin && (
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <ClipboardCheck className="size-4" />
                Nueva Orden
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingOrder ? "Editar Orden" : "Crear Orden de Servicio"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente</Label>
                  <Select
                    value={formData.customerId.toString()}
                    onValueChange={(val) =>
                      setFormData({ ...formData, customerId: parseInt(val) })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name} {c.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehículo (Placa)</Label>
                    <Select
                      value={formData.vehicleId.toString()}
                      onValueChange={(val) =>
                        setFormData({ ...formData, vehicleId: parseInt(val) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.plate} - {v.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technical">Técnico Asignado</Label>
                    <Select
                      value={formData.technicalId.toString()}
                      onValueChange={(val) =>
                        setFormData({ ...formData, technicalId: parseInt(val) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.name} {t.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnóstico / Observaciones</Label>
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

                {/* El estado solo es seleccionable al crear si se desea, pero la regla dice que lo actualiza el técnico. 
                    Por lo tanto, para Admin lo ocultamos en edición y en creación lo dejamos fijo en PENDIENTE. */}
                {!editingOrder ? (
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado Inicial</Label>
                    <div className="flex h-11 items-center rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground">
                      Pendiente (Se asignará al técnico)
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Estado Actual</Label>
                    <div className="flex h-11 items-center">
                      {getStatusBadge(editingOrder.status)}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                      * El estado solo puede ser actualizado por el técnico
                      asignado.
                    </p>
                  </div>
                )}

                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingOrder ? "Actualizar Orden" : "Crear Orden"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog separado para edición (usado por Técnicos) */}
        {!isAdmin && isTecnico && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Actualizar Estado de Orden</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Diagnóstico:</p>
                  <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    {editingOrder?.diagnosis}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-tech">Nuevo Estado</Label>
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
                      <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                      <SelectItem value="TERMINADO">Terminado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Actualizar Estado
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex-1 overflow-auto rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Vehículo y Dueño</TableHead>
              <TableHead>Asignado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  Cargando órdenes...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay órdenes de servicio registradas.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="size-3 text-muted-foreground" />
                      {order.date
                        ? format(new Date(order.date), "dd MMM, yyyy", {
                            locale: es,
                          })
                        : "S/F"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Car className="size-3 text-primary" />
                        {order.vehicle?.plate} ({order.vehicle?.brand})
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <UserIcon className="size-3" />
                        {order.customer?.name} {order.customer?.lastName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Wrench className="size-3 text-muted-foreground" />
                      {order.technical
                        ? `${order.technical.name} ${order.technical.lastName}`
                        : "Sin asignar"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(order)}
                        title={
                          isAdmin ? "Editar diagnóstico" : "Cambiar estado"
                        }
                      >
                        {isAdmin ? (
                          <Pencil className="size-4" />
                        ) : (
                          <ClipboardCheck className="size-4" />
                        )}
                      </Button>
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Confirmar eliminación?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará la orden de servicio{" "}
                                <span className="font-semibold text-foreground">
                                  #{order.id}
                                </span>{" "}
                                para el vehículo{" "}
                                <span className="font-semibold text-foreground">
                                  {order.vehicle?.plate}
                                </span>{" "}
                                de forma permanente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(order.id)}
                                className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
