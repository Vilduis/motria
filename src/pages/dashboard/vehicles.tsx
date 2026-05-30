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
import { Car, Trash2, Pencil, User as UserIcon } from "lucide-react"
import vehicleService from "@/services/vehicleService"
import customerService from "@/services/customerService"
import type { Vehicle, DTOVehicle, Customer } from "@/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorHandler"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/data/empty-state"
import { LoadingRows } from "@/components/data/loading-rows"
import { DataToolbar } from "@/components/data/data-toolbar"
import { RowActions } from "@/components/data/row-actions"
import { ConfirmDialog } from "@/components/data/confirm-dialog"
import { useTableFilter } from "@/hooks/use-table-filter"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null)

  const [formData, setFormData] = useState<DTOVehicle>({
    plate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    customerId: 0,
  })

  const fetchData = async () => {
    try {
      const [vData, cData] = await Promise.all([
        vehicleService.getAllVehicles(),
        customerService.getAllCustomers(),
      ])
      setVehicles(vData)
      setCustomers(cData)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cargar datos"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getSearchable = useCallback(
    (v: Vehicle) =>
      `${v.plate} ${v.brand} ${v.model} ${v.year} ${v.customer?.name ?? ""} ${
        v.customer?.lastName ?? ""
      }`,
    [],
  )
  const { query, setQuery, filtered } = useTableFilter(vehicles, getSearchable)

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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al procesar la solicitud"))
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await vehicleService.deleteVehicle(pendingDelete.id)
      toast.success("Vehículo eliminado")
      fetchData()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar vehículo"))
    } finally {
      setPendingDelete(null)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      customerId: vehicle.customer?.id || 0,
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
      customerId: 0,
    })
  }

  const newVehicleButton = (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Car className="size-3.5" />
          Nuevo vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>
            {editingVehicle ? "Editar vehículo" : "Registrar vehículo"}
          </DialogTitle>
          <DialogDescription>
            {editingVehicle
              ? "Actualiza los datos del vehículo."
              : "Asocia un vehículo a un cliente existente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="plate">Placa</Label>
              <Input
                id="plate"
                required
                placeholder="ABC-123"
                className="font-mono uppercase tracking-wider"
                value={formData.plate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    plate: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                required
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                required
                placeholder="Toyota"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                required
                placeholder="Corolla"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cliente (dueño)</Label>
            <Select
              value={
                formData.customerId === 0
                  ? undefined
                  : formData.customerId.toString()
              }
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {editingVehicle ? "Guardar cambios" : "Registrar vehículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <PageShell>
      <PageHeader
        title="Vehículos"
        description="Gestiona la flota de vehículos de tus clientes."
        action={newVehicleButton}
      />

      <DataToolbar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar por placa, marca, modelo o cliente..."
        count={loading ? undefined : filtered.length}
      />

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingRows cols={4} />
            ) : filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={Car}
                    title={query ? "Sin coincidencias" : "Sin vehículos aún"}
                    description={
                      query
                        ? "Prueba con otro término de búsqueda."
                        : "Registra el primer vehículo de un cliente."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-secondary/40">
                        <Car className="size-4 text-muted-foreground/80" />
                      </div>
                      <div>
                        <div className="text-mono text-[13.5px] font-semibold tracking-wider">
                          {vehicle.plate}
                        </div>
                        <div className="text-caption capitalize">
                          {vehicle.brand} {vehicle.model}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-num text-muted-foreground">
                    {vehicle.year}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <UserIcon className="size-3 shrink-0 text-muted-foreground/70" />
                      <span className="text-muted-foreground">
                        {vehicle.customer
                          ? `${vehicle.customer.name} ${vehicle.customer.lastName}`
                          : "Desconocido"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      actions={[
                        {
                          label: "Editar",
                          icon: <Pencil className="size-3.5" />,
                          onSelect: () => handleEdit(vehicle),
                        },
                        {
                          label: "Eliminar",
                          icon: <Trash2 className="size-3.5" />,
                          variant: "destructive",
                          separatorBefore: true,
                          onSelect: () => setPendingDelete(vehicle),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="¿Eliminar vehículo?"
        description={
          <>
            Esta acción eliminará el vehículo con placa{" "}
            <span className="text-mono font-semibold text-foreground">
              {pendingDelete?.plate}
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
