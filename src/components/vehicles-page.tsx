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
import { Input } from "@/components/ui/input"
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
import { Car, Trash2, Pencil, Calendar, Settings, User as UserIcon } from "lucide-react"
import vehicleService from "@/services/vehicleService"
import customerService from "@/services/customerService"
import type { Vehicle, DTOVehicle, Customer } from "@/types"
import { toast } from "sonner"

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<DTOVehicle>({
    plate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    customerId: 0
  })

  const fetchData = async () => {
    try {
      const [vData, cData] = await Promise.all([
        vehicleService.getAllVehicles(),
        customerService.getAllCustomers()
      ])
      setVehicles(vData)
      setCustomers(cData)
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
    if (formData.customerId === 0) {
      toast.warning("Por favor, selecciona un cliente")
      return
    }

    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, formData)
        toast.success("Vehículo actualizado correctamente")
      } else {
        await vehicleService.createVehicle(formData)
        toast.success("Vehículo registrado correctamente")
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
      await vehicleService.deleteVehicle(id)
      toast.success("Vehículo eliminado")
      fetchData()
    } catch (error) {
      toast.error("Error al eliminar vehículo")
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      customerId: vehicle.customer?.id || 0
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingVehicle(null)
    setFormData({ 
      plate: "", 
      brand: "", 
      model: "", 
      year: new Date().getFullYear(), 
      customerId: 0 
    })
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehículos</h2>
          <p className="text-muted-foreground">
            Gestiona la flota de vehículos de tus clientes.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Car className="size-4" />
              Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa / Matrícula</Label>
                  <Input
                    id="plate"
                    required
                    placeholder="ABC-123"
                    className="uppercase"
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    required
                    placeholder="Toyota"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    required
                    placeholder="Corolla"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Cliente (Dueño)</Label>
                <Select 
                  value={formData.customerId.toString()} 
                  onValueChange={(val) => setFormData({ ...formData, customerId: parseInt(val) })}
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

              <DialogFooter>
                <Button type="submit">{editingVehicle ? 'Actualizar' : 'Guardar'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead>Especificaciones</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Cargando vehículos...
                </TableCell>
              </TableRow>
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No hay vehículos registrados.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Car className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg leading-none">{vehicle.plate}</div>
                        <div className="text-xs text-muted-foreground mt-1 capitalize">{vehicle.brand} {vehicle.model}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span>Año: {vehicle.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Settings className="size-3 text-muted-foreground" />
                        <span className="capitalize">{vehicle.brand}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <UserIcon className="size-3 text-muted-foreground" />
                      {vehicle.customer ? `${vehicle.customer.name} ${vehicle.customer.lastName}` : "Desconocido"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(vehicle)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el vehículo con placa <span className="font-semibold text-foreground">{vehicle.plate}</span> de forma permanente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(vehicle.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
