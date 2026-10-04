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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Pencil,
  Briefcase,
  Mail,
  Loader2,
  UserPlus,
} from "lucide-react"
import technicalService from "@/services/technicalService"
import type { Technical } from "@/types"
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
import { DataPagination } from "@/components/data/data-pagination"

type TechnicalFormState = {
  name: string
  lastName: string
  specialty: string
  email: string
}

const emptyForm: TechnicalFormState = {
  name: "",
  lastName: "",
  specialty: "",
  email: "",
}

export default function TechnicalsPage() {
  const [technicals, setTechnicals] = useState<Technical[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<Technical | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Technical | null>(null)
  const [formData, setFormData] = useState<TechnicalFormState>(emptyForm)

  const fetchData = async () => {
    try {
      setLoading(true)
      const techsData = await technicalService.getAllTechnicals()
      setTechnicals(techsData)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cargar técnicos"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getSearchable = useCallback(
    (t: Technical) =>
      `${t.name} ${t.lastName} ${t.specialty} ${t.user?.email ?? ""}`,
    [],
  )
  const { query, setQuery, filtered } = useTableFilter(
    technicals,
    getSearchable,
  )
  const pagination = usePagination(filtered, { resetKey: query })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingTech) {
        await technicalService.updateTechnical(editingTech.id, {
          id: editingTech.id,
          name: formData.name.trim(),
          lastName: formData.lastName.trim(),
          specialty: formData.specialty.trim(),
          userId: editingTech.user?.id,
        })
        toast.success("Técnico actualizado")
      } else {
        await technicalService.createTechnical({
          name: formData.name.trim(),
          lastName: formData.lastName.trim(),
          specialty: formData.specialty.trim(),
          email: formData.email.trim(),
        })
        toast.success(
          "Técnico registrado. Se envió la contraseña temporal por correo.",
        )
      }
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al procesar la solicitud"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await technicalService.deleteTechnical(pendingDelete.id)
      toast.success("Técnico eliminado")
      fetchData()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar técnico"))
    } finally {
      setPendingDelete(null)
    }
  }

  const handleEdit = (tech: Technical) => {
    setEditingTech(tech)
    setFormData({
      name: tech.name,
      lastName: tech.lastName,
      specialty: tech.specialty,
      email: tech.user?.email ?? "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTech(null)
    setFormData(emptyForm)
  }

  const initials = (name: string, lastName: string) =>
    `${name[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()

  const newTechButton = (
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
          Nuevo técnico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {editingTech ? "Editar técnico" : "Registrar técnico"}
          </DialogTitle>
          <DialogDescription>
            {editingTech
              ? "Actualiza los datos profesionales del técnico."
              : "Se creará una cuenta TECHNICAL y se enviará una contraseña temporal por correo."}
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
            <Label htmlFor="specialty">Especialidad</Label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="specialty"
                required
                placeholder="Motores, Frenos, Suspensión..."
                className="pl-9"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">
              {editingTech ? "Correo (no modificable)" : "Correo del técnico"}
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="email"
                type="email"
                required={!editingTech}
                disabled={!!editingTech}
                placeholder="tecnico@taller.com"
                className="pl-9"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {!editingTech && (
              <p className="text-caption">
                Se enviará una contraseña temporal. El técnico deberá cambiarla
                al iniciar sesión.
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={submitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {editingTech ? "Guardando..." : "Registrando..."}
                </span>
              ) : editingTech ? (
                "Guardar cambios"
              ) : (
                "Registrar técnico"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <PageShell>
      <PageHeader
        title="Técnicos"
        description="Maneja el perfil profesional y especialidad de tu equipo."
        action={newTechButton}
      />

      <DataToolbar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar por nombre, especialidad o correo..."
        count={loading ? undefined : filtered.length}
      />

      <div className="scroll-mt-16 overflow-hidden rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Técnico</TableHead>
              <TableHead className="hidden sm:table-cell">Especialidad</TableHead>
              <TableHead className="hidden md:table-cell">Correo</TableHead>
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
                    icon={Briefcase}
                    title={query ? "Sin coincidencias" : "Sin técnicos aún"}
                    description={
                      query
                        ? "Prueba con otro término de búsqueda."
                        : "Agrega tu primer técnico con el botón de arriba."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              pagination.pageItems.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                        {initials(tech.name, tech.lastName)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium">
                          {tech.name} {tech.lastName}
                        </span>
                        <div className="text-caption truncate md:hidden">
                          <span className="sm:hidden">{tech.specialty} · </span>
                          {tech.user?.email ?? "Sin usuario"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {tech.specialty}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <Mail className="size-3 shrink-0" />
                      {tech.user?.email ?? "Sin usuario"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      actions={[
                        {
                          label: "Editar",
                          icon: <Pencil className="size-3.5" />,
                          onSelect: () => handleEdit(tech),
                        },
                        {
                          label: "Eliminar",
                          icon: <Trash2 className="size-3.5" />,
                          variant: "destructive",
                          separatorBefore: true,
                          onSelect: () => setPendingDelete(tech),
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
        title="¿Eliminar técnico?"
        description={
          <>
            Esta acción eliminará al técnico{" "}
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
