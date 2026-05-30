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
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
  Users,
  Pencil,
} from "lucide-react"
import userService from "@/services/userService"
import type { User, DTOUser } from "@/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorHandler"
import { getPrimaryRole, hasRole } from "@/lib/userMapper"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/data/empty-state"
import { LoadingRows } from "@/components/data/loading-rows"
import { DataToolbar } from "@/components/data/data-toolbar"
import { RowActions } from "@/components/data/row-actions"
import { ConfirmDialog } from "@/components/data/confirm-dialog"
import { useTableFilter } from "@/hooks/use-table-filter"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)

  const [formData, setFormData] = useState<DTOUser>({
    email: "",
    password: "",
    authorities: "",
    active: true,
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al cargar usuarios"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getSearchable = useCallback(
    (u: User) => `${u.email} ${u.authorities ?? ""} ${u.active ? "activo" : "inactivo"}`,
    [],
  )
  const { query, setQuery, filtered } = useTableFilter(users, getSearchable)

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      id: user.id,
      email: user.email,
      password: "",
      authorities: user.authorities ?? "",
      active: user.active,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setSubmitting(true)
    try {
      await userService.updateUser(editingUser.id, {
        ...formData,
        email: formData.email.trim(),
      })
      toast.success("Usuario actualizado correctamente")
      setEditingUser(null)
      fetchUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar usuario"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!pendingDelete) return
    try {
      await userService.deleteUser(pendingDelete.id)
      toast.success("Usuario eliminado")
      fetchUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar usuario"))
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Usuarios"
        description="Gestiona credenciales y estado de las cuentas del taller."
      />

      <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-[13px] dark:bg-white/[0.02]">
        <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
        <p className="text-muted-foreground">
          Los administradores se registran públicamente y los técnicos desde la
          sección{" "}
          <span className="font-medium text-foreground">Técnicos</span>. Aquí
          puedes activar/desactivar cuentas, resetear contraseñas o eliminar
          usuarios.
        </p>
      </div>

      <DataToolbar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Buscar por correo o rol..."
        count={loading ? undefined : filtered.length}
        countLabel={filtered.length === 1 ? "cuenta" : "cuentas"}
      />

      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Actualiza el correo, restablece la contraseña o cambia el estado.
              El rol no se modifica desde aquí.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">
                Nueva contraseña{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (dejar vacío para no cambiar)
                </span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="size-4 rounded border-border accent-brand"
              />
              <Label htmlFor="active" className="cursor-pointer font-normal">
                Cuenta activa
              </Label>
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
                    Guardando...
                  </span>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingRows cols={5} />
            ) : filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={Users}
                    title={query ? "Sin coincidencias" : "Sin usuarios"}
                    description={
                      query
                        ? "Prueba con otro término de búsqueda."
                        : "No hay usuarios registrados en el sistema."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-mono text-muted-foreground">
                    {user.id}
                  </TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "done" : "outline"}>
                      {user.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {hasRole(user, "ADMIN") ? (
                        <Shield className="size-3.5 text-brand" />
                      ) : (
                        <UserIcon className="size-3.5 text-muted-foreground" />
                      )}
                      <span className="text-[13px]">
                        {getPrimaryRole(user).toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      actions={[
                        {
                          label: "Editar",
                          icon: <Pencil className="size-3.5" />,
                          onSelect: () => handleOpenEdit(user),
                        },
                        {
                          label: "Eliminar",
                          icon: <Trash2 className="size-3.5" />,
                          variant: "destructive",
                          separatorBefore: true,
                          onSelect: () => setPendingDelete(user),
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
        title="¿Eliminar usuario?"
        description={
          <>
            Esta acción eliminará al usuario{" "}
            <span className="font-semibold text-foreground">
              {pendingDelete?.email}
            </span>{" "}
            de forma permanente.
          </>
        }
        confirmLabel="Eliminar"
        onConfirm={handleDeleteUser}
      />
    </PageShell>
  )
}
