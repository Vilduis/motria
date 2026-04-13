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
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, User as UserIcon } from "lucide-react"
import userService from "@/services/userService"
import type { User, DTOUser } from "@/types"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorHandler"
import { getPrimaryRole, hasRole, mapUserRoles } from "@/lib/userMapper"

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Form state
  const [formData, setFormData] = useState<DTOUser>({
    email: "",
    password: "",
    authorities: "TECNICO",
    active: true,
  })

  const fetchUsers = async () => {
    try {
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

  const handleOpenCreate = () => {
    setEditingUser(null)
    setFormData({
      email: "",
      password: "",
      authorities: "TECNICO",
      active: true,
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    
    // Usamos el rol principal para el selector del formulario
    const roles = mapUserRoles(user)
    const role = roles.includes("ADMIN") ? "ADMIN" : "TECNICO"

    setFormData({
      id: user.id,
      email: user.email,
      password: "", // No cargamos el password por seguridad
      authorities: role,
      active: user.active,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData)
        toast.success("Usuario actualizado correctamente")
      } else {
        await userService.createUser(formData)
        toast.success("Usuario creado correctamente")
      }
      setIsDialogOpen(false)
      fetchUsers()
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          editingUser ? "Error al actualizar usuario" : "Error al crear usuario"
        )
      )
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id)
      toast.success("Usuario eliminado")
      fetchUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al eliminar usuario"))
    }
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground">
            Gestiona las credenciales y roles de acceso al sistema.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleOpenCreate}>
              <Plus className="size-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="usuario@taller.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {editingUser
                    ? "Contraseña (dejar en blanco para no cambiar)"
                    : "Contraseña"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol / Autoridad</Label>
                <Select
                  value={formData.authorities}
                  onValueChange={(val) =>
                    setFormData({ ...formData, authorities: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="TECNICO">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingUser && (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="active">Usuario Activo</Label>
                </div>
              )}
              <DialogFooter>
                <Button type="submit">
                  {editingUser ? "Actualizar Cambios" : "Guardar Usuario"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "default" : "secondary"}>
                      {user.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {hasRole(user, "ADMIN") ? (
                        <Shield className="size-4 text-primary" />
                      ) : (
                        <UserIcon className="size-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {getPrimaryRole(user).toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(user)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Shield className="size-4" />
                      </Button>
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
                              Esta acción eliminará al usuario{" "}
                              <span className="font-semibold text-foreground">
                                {user.email}
                              </span>{" "}
                              de forma permanente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
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
