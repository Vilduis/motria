import { useState } from "react"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { AuthShell } from "@/components/layout/auth-shell"
import { PasswordStrength } from "@/components/auth/password-strength"
import authService from "@/services/authService"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { getErrorMessage } from "@/lib/errorHandler"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  if (!token) {
    return <Navigate to="/forgot-password" replace />
  }

  const passwordError =
    touched.newPassword && newPassword.length > 0 && newPassword.length < 8
      ? "Mínimo 8 caracteres"
      : null

  const confirmError =
    touched.confirmPassword &&
    confirmPassword.length > 0 &&
    confirmPassword !== newPassword
      ? "Las contraseñas no coinciden"
      : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ newPassword: true, confirmPassword: true })
    if (newPassword.length < 8) return
    if (newPassword !== confirmPassword) return

    setIsLoading(true)
    try {
      await authService.resetPassword({ token, newPassword })
      toast.success("Contraseña actualizada. Inicia sesión con la nueva.")
      navigate("/login", { replace: true })
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "No se pudo restablecer la contraseña."),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell showBrand>
      <Card className="w-full gap-0 py-0 shadow-elevated">
        <CardHeader className="px-7 pb-1 pt-7">
          <CardTitle className="text-h1">Nueva contraseña</CardTitle>
          <CardDescription>
            Elige una contraseña fuerte que no uses en otros sitios.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pb-7 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mín. 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() =>
                  setTouched((p) => ({ ...p, newPassword: true }))
                }
                aria-invalid={passwordError ? true : undefined}
                aria-describedby={
                  passwordError ? "password-error" : "password-strength"
                }
                required
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
              />
            </div>

            <PasswordStrength
              password={newPassword}
              id="password-strength"
            />

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repetir contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setTouched((p) => ({ ...p, confirmPassword: true }))
                }
                aria-invalid={confirmError ? true : undefined}
                aria-describedby={confirmError ? "confirm-error" : undefined}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {passwordError && (
              <p
                id="password-error"
                className="text-[12px] text-destructive"
                role="alert"
              >
                {passwordError}
              </p>
            )}
            {confirmError && (
              <p
                id="confirm-error"
                className="text-[12px] text-destructive"
                role="alert"
              >
                {confirmError}
              </p>
            )}
            {!passwordError &&
              !confirmError &&
              confirmPassword.length > 0 &&
              confirmPassword === newPassword && (
                <p className="flex items-center gap-1 text-[12px] text-status-done">
                  <Check className="size-3.5" />
                  Las contraseñas coinciden
                </p>
              )}

            <Button
              type="submit"
              className="mt-2 h-10 w-full gap-1.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Actualizando…
                </>
              ) : (
                <>
                  Actualizar contraseña
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-[13px] text-muted-foreground">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Volver a iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
