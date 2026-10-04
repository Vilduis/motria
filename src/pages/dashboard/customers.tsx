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
import {
  UserPlus,
  Trash2,
  Pencil,
  Mail,
  Phone,
  Users,
} from "lucide-react"
import customerService from "@/services/customerService"
import type { Customer, DTOCustomer } from "@/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorHandler"
import { isValidPhone, normalizePhone, PHONE_ERROR } from "@/lib/validation"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/data/empty-state"
import { LoadingRows } from "@/components/data/loading-rows"
import { DataToolbar } from "@/components/data/data-toolbar"
import { RowActions } from "@/components/data/row-actions"
import { ConfirmDialog } from "@/components/data/confirm-dialog"
import { useTableFilter } from "@/hooks/use-table-filter"
import { usePagination } from "@/hooks/use-pagination"
import { DataPagination } from "@/components/data/data-pagination"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null)

  const [formData, setFormData] = useState<DTOCustomer>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers()
      setCustomers(data)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cargar clientes"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const getSearchable = useCallback(
    (c: Customer) =>
      `${c.name} ${c.lastName} ${c.email} ${c.phone}`,
    [],
  )
  const { query, setQuery, filtered } = useTableFilter(customers, getSearchable)
  const pagination = usePagination(filtered, { resetKey: query })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidPhone(formData.phone)) {
      toast.error(PHONE_ERROR)
      return
    }
    const payload = { ...formData, phone: normalizePhone(formData.phone) }
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, payload)
        toast.success("Cliente actualizado correctamente")
      } else {
        await customerService.createCustomer(payload)
        toast.success("Cliente creado correctamente")
      }
      setIsDialogOpen(false)
      resetForm()
      fetchCustomers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al procesar la solicitud"))
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await customerService.deleteCustomer(pendingDelete.id)
      toast.success("Cliente eliminado")
      fetchCustomers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar cliente"))
    } finally {
      setPendingDelete(null)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingCustomer(null)
    setFormData({ name: "", lastName: "", email: "", phone: "" })
  }

  const initials = (name: string, lastName: string) =>
    `${name[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()

  const newCustomerButton = (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-3.5" />
          Nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>
            {editingCustomer ? "Editar cliente" : "Nuevo cliente"}
          </DialogTitle>
          <DialogDescription>
            {editingCustomer
              ? "Actualiza la información de contacto."
              : "Registra los datos de contacto del cliente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="email"
                type="email"
                required
                className="pl-9"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="phone"
                required
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="999 999 999"
                className="pl-9"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {editingCustomer ? "Guardar cambios" : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <PageShell>
      <PageHeader
        title="Clientes"
        description="Registra y gestiona los datos de contacto de tus clientes."
        action={newCustomerButton}
      />

      <DataToolbar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar por nombre, correo o teléfono..."
        count={loading ? undefined : filtered.length}
      />

      <div className="scroll-mt-16 overflow-hidden rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Correo</TableHead>
              <TableHead className="hidden md:table-cell">Teléfono</TableHead>
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
                    icon={Users}
                    title={query ? "Sin coincidencias" : "Sin clientes aún"}
                    description={
                      query
                        ? "Prueba con otro término de búsqueda."
                        : "Agrega tu primer cliente con el botón de arriba."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              pagination.pageItems.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                        {initials(customer.name, customer.lastName)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium">
                          {customer.name} {customer.lastName}
                        </span>
                        <div className="text-caption truncate md:hidden">
                          {customer.phone} · {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <Mail className="size-3 shrink-0" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <Phone className="size-3 shrink-0" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      actions={[
                        {
                          label: "Editar",
                          icon: <Pencil className="size-3.5" />,
                          onSelect: () => handleEdit(customer),
                        },
                        {
                          label: "Eliminar",
                          icon: <Trash2 className="size-3.5" />,
                          variant: "destructive",
                          separatorBefore: true,
                          onSelect: () => setPendingDelete(customer),
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
        title="¿Eliminar cliente?"
        description={
          <>
            Esta acción eliminará a{" "}
            <span className="font-semibold text-foreground">
              {pendingDelete?.name} {pendingDelete?.lastName}
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
