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
import { Trash2, Pencil, Briefcase, User as UserIcon, Mail } from "lucide-react"
import technicalService from "@/services/technicalService"
import userService from "@/services/userService"
import type { Technical, DTOTechnical, User } from "@/types"
import { toast } from "sonner"

export function TechnicalsPage() {
  const [technicals, setTechnicals] = useState<Technical[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<Technical | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<DTOTechnical>({
    name: "",
    lastName: "",
    specialty: "",
    userId: 0
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [techsData, usersData] = await Promise.all([
        technicalService.getAllTechnicals(),
        userService.getAllUsers()
      ])
      setTechnicals(techsData)
      
      // Filtro robusto para usuarios con rol TECNICO
      const technicalUsers = usersData.filter((u: any) => {
        const authData = (u as any).authorities;
        let roles: string[] = [];
        if (typeof authData === 'string') {
          roles = authData.replace(/[\[\]]/g, '').split(/[;,]/).map(r => r.trim());
        } else if (Array.isArray(authData)) {
          roles = authData.map((a: any) => typeof a === 'string' ? a : (a as any).name || (a as any).authority || "");
        }
        return roles.some((r: string) => r.includes("TECNICO"));
      });
      
      setUsers(technicalUsers as any)
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
    if (formData.userId === 0) {
      toast.error("Debes seleccionar un usuario del sistema")
      return
    }
    try {
      if (editingTech) {
        await technicalService.updateTechnical(editingTech.id, formData)
        toast.success("Técnico actualizado")
      } else {
        await technicalService.createTechnical(formData)
        toast.success("Técnico registrado")
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
      await technicalService.deleteTechnical(id)
      toast.success("Técnico eliminado")
      fetchData()
    } catch (error) {
      toast.error("Error al eliminar técnico")
    }
  }

  const handleEdit = (tech: Technical) => {
    setEditingTech(tech)
    setFormData({
      name: tech.name,
      lastName: tech.lastName,
      specialty: tech.specialty,
      userId: tech.user?.id || 0
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTech(null)
    setFormData({ name: "", lastName: "", specialty: "", userId: 0 })
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Técnicos</h2>
          <p className="text-muted-foreground">
            Maneja el perfil profesional y especialidad de tus mecánicos.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserIcon className="size-4" />
              Nuevo Técnico
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTech ? 'Editar Técnico' : 'Registrar Nuevo Técnico'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="specialty"
                    required
                    placeholder="Ej: Motores, Frenos, Suspensión"
                    className="pl-10"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">Usuario Vinculado</Label>
                <Select
                  value={formData.userId.toString()}
                  onValueChange={(val) => setFormData({ ...formData, userId: parseInt(val) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un usuario técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic">
                  * Solo se muestran usuarios con rol de TÉCNICO
                </p>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTech ? 'Actualizar' : 'Registrar'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card flex-1 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Técnico</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Usuario/Email</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Cargando equipo técnico...
                </TableCell>
              </TableRow>
            ) : technicals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No hay técnicos registrados.
                </TableCell>
              </TableRow>
            ) : (
              technicals.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <UserIcon className="size-4 text-primary" />
                      </div>
                      <span className="font-medium">{tech.name} {tech.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal border-primary/30 text-primary bg-primary/5">
                      {tech.specialty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="size-3" />
                      {tech.user?.email || "Sin usuario"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tech)}
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
                              Esta acción eliminará al técnico <span className="font-semibold text-foreground">{tech.name} {tech.lastName}</span> de forma permanente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(tech.id)}
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
