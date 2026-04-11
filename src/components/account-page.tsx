import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import authService from "@/services/authService"
import userService from "@/services/userService"
import { toast } from "sonner"
import { User, Shield, Lock, Loader2 } from "lucide-react"

export function AccountPage() {
  const currentUser = authService.getCurrentUser()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 4) {
      toast.error("La contraseña debe tener al menos 4 caracteres")
      return
    }

    try {
      setLoading(true)
      // Necesitamos el ID del usuario. authService.getCurrentUser() retorna string o null para el id.
      const userId = currentUser.id ? parseInt(currentUser.id) : 0
      
      if (!userId) {
        toast.error("No se pudo identificar al usuario actual")
        return
      }

      await userService.updateUser(userId, {
        email: currentUser.email,
        password: formData.password,
        authorities: currentUser.roles[0] || "TECNICO",
        active: true
      })

      toast.success("Contraseña actualizada correctamente")
      setFormData({ password: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error("Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Cuenta</h2>
        <p className="text-muted-foreground">
          Gestiona tu perfil y configuración de seguridad.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <User className="size-5 text-blue-500" />
                <CardTitle>Información del Perfil</CardTitle>
            </div>
            <CardDescription>
                Detalles básicos de tu cuenta en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Correo Electrónico</Label>
              <div className="text-lg font-medium">{currentUser.email}</div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs uppercase text-muted-foreground font-semibold">Rol del Sistema</Label>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                <span className="font-medium uppercase">{currentUser.roles.join(", ") || "USUARIO"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <Lock className="size-5 text-orange-500" />
                <CardTitle>Seguridad</CardTitle>
            </div>
            <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Actualizando...
                    </>
                ) : "Actualizar Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
