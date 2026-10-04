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
import { usePagination } from "@/hooks/use-pagination"
import { EntityCombobox } from "@/components/data/entity-combobox"
import { DataPagination } from "@/components/data/data-pagination"

type VehicleForm = Omit<DTOVehicle, "year"> & { year: string }

const EMPTY_FORM: VehicleForm = {
  plate: "",
  brand: "",
  model: "",
  year: "",
  customerId: 0,
}

const MIN_YEAR = 1950

/** Accepts 1950 through next year (new models ship with next year's date). */
function getYearError(value: string): string | undefined {
  const maxYear = new Date().getFullYear() + 1
  if (!value) return "Indica el año."
  const year = Number(value)
  if (value.length !== 4 || year < MIN_YEAR || year > maxYear) {
    return `Usa un año entre ${MIN_YEAR} y ${maxYear}.`
  }
  return undefined
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null)

  // The year is kept as text so the field can start empty (placeholder only)
  // and be validated before it becomes a number in the payload.
  const [formData, setFormData] = useState<VehicleForm>(EMPTY_FORM)
  const [yearTouched, setYearTouched] = useState(false)
  const yearError = getYearError(formData.year)
  const showYearError = yearTouched && yearError !== undefined

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
    []
  )
  const { query, setQuery, filtered } = useTableFilter(vehicles, getSearchable)
  const pagination = usePagination(filtered, { resetKey: query })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setYearTouched(true)
    if (yearError) {
      document.getElementById("year")?.focus()
      return
    }
    if (formData.customerId === 0) {
      toast.warning("Por favor, selecciona un cliente")
      return
    }
    const payload: DTOVehicle = { ...formData, year: Number(formData.year) }
    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, payload)
        toast.success("Vehículo actualizado correctamente")
      } else {
        await vehicleService.createVehicle(payload)
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
      year: String(vehicle.year),
      customerId: vehicle.customer?.id || 0,
    })
    setYearTouched(false)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingVehicle(null)
    setFormData(EMPTY_FORM)
    setYearTouched(false)
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
                className="font-mono tracking-wider uppercase"
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
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                required
                placeholder="Ej. 2018"
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: e.target.value.replace(/\D/g, ""),
                  })
                }
                onBlur={() => setYearTouched(true)}
                aria-invalid={showYearError || undefined}
                aria-describedby={showYearError ? "year-error" : undefined}
              />
              {showYearError && (
                <p id="year-error" className="text-xs text-destructive">
                  {yearError}
                </p>
              )}
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
            <Label htmlFor="vehicle-customer">Cliente (dueño)</Label>
            <EntityCombobox
              id="vehicle-customer"
              value={formData.customerId}
              onChange={(id) => setFormData({ ...formData, customerId: id })}
              options={customers.map((c) => ({
                value: c.id,
                label: `${c.name} ${c.lastName}`,
                description: [c.phone, c.email].filter(Boolean).join(" · "),
              }))}
              placeholder="Selecciona un cliente"
              searchPlaceholder="Buscar por nombre, teléfono o correo"
              emptyText="Ningún cliente coincide."
            />
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

      <div className="scroll-mt-16 overflow-hidden rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead className="hidden md:table-cell">Año</TableHead>
              <TableHead className="hidden md:table-cell">Dueño</TableHead>
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
              pagination.pageItems.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Car className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-mono text-[13.5px] font-semibold tracking-wider">
                          {vehicle.plate}
                        </div>
                        <div className="text-caption capitalize">
                          {vehicle.brand} {vehicle.model}
                          <span className="md:hidden"> · {vehicle.year}</span>
                        </div>
                        <div className="text-caption md:hidden">
                          {vehicle.customer
                            ? `${vehicle.customer.name} ${vehicle.customer.lastName}`
                            : "Desconocido"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-num hidden text-muted-foreground md:table-cell">
                    {vehicle.year}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <UserIcon className="size-3 shrink-0 text-muted-foreground" />
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
