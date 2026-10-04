import { useRef, useState } from "react"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthField } from "@/components/auth/auth-field"
import { PasswordStrength } from "@/components/auth/password-strength"
import { MotriaAuthShell } from "@/components/layout/motria-auth-shell"
import authService from "@/services/authService"
import { getErrorMessage } from "@/lib/errorHandler"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const formRef = useRef<HTMLFormElement>(null)

  if (!token) {
    return <Navigate to="/forgot-password" replace />
  }

  const passwordError =
    touched.newPassword && newPassword.length < 8
      ? "Usa al menos 8 caracteres."
      : undefined

  const confirmError =
    touched.confirmPassword && confirmPassword !== newPassword
      ? "Las contraseñas no coinciden."
      : undefined

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === newPassword

  const focusField = (name: string) =>
    (formRef.current?.elements.namedItem(name) as HTMLInputElement)?.focus()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setTouched({ newPassword: true, confirmPassword: true })
    if (newPassword.length < 8) return focusField("newPassword")
    if (newPassword !== confirmPassword) return focusField("confirmPassword")

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
    <MotriaAuthShell variant="reset-password">
      <Card className="motria-auth-card">
        <CardHeader className="gap-0 px-0">
          <h1 className="motria-heading motria-auth-title">
            Nueva contraseña
          </h1>
          <p className="motria-auth-intro">
            Elige una contraseña fuerte que no uses en otros sitios.
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="motria-auth-form space-y-6"
            noValidate
            aria-busy={isLoading}
          >
            <div className="space-y-3">
              <AuthField
                id="newPassword"
                label="Nueva contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, newPassword: true }))}
                error={passwordError}
                aria-describedby="password-strength"
                required
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
              />
              <PasswordStrength password={newPassword} id="password-strength" />
            </div>

            <div className="space-y-2">
              <AuthField
                id="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setTouched((p) => ({ ...p, confirmPassword: true }))
                }
                error={confirmError}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              {!confirmError && passwordsMatch && (
                <p className="flex items-center gap-1.5 text-xs text-status-done">
                  <Check className="size-3.5" aria-hidden="true" />
                  Las contraseñas coinciden
                </p>
              )}
            </div>

            <p role="status" className="sr-only">
              {isLoading ? "Actualizando contraseña…" : ""}
            </p>
            <Button
              type="submit"
              className="motria-auth-submit"
              disabled={isLoading}
            >
              <span>{isLoading ? "Actualizando…" : "Actualizar contraseña"}</span>
              <span className="motria-auth-submit-icon" aria-hidden="true">
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </span>
            </Button>
          </form>

          <p className="motria-auth-switch">
            <Link
              to="/login"
              className="motria-auth-link inline-flex min-h-11 items-center gap-2"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver a iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </MotriaAuthShell>
  )
}
