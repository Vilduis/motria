import { useMemo, useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthField } from "@/components/auth/auth-field"
import authService from "@/services/authService"
import { getErrorMessage } from "@/lib/errorHandler"

interface ChangePasswordFormProps {
  className?: string
  onChangeSuccess?: () => void
}

interface Criterion {
  label: string
  test: (pwd: string, currentPwd: string) => boolean
}

const CRITERIA: Criterion[] = [
  {
    label: "Al menos 8 caracteres",
    test: (p) => p.length >= 8,
  },
  {
    label: "Una letra mayúscula",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    label: "Un número",
    test: (p) => /\d/.test(p),
  },
  {
    label: "Diferente a la actual",
    test: (p, c) => p.length > 0 && p !== c,
  },
]

export function ChangePasswordForm({
  className,
  onChangeSuccess,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const checks = useMemo(
    () =>
      CRITERIA.map((c) => ({
        ...c,
        passed: c.test(newPassword, currentPassword),
      })),
    [newPassword, currentPassword],
  )
  const allPassed = checks.every((c) => c.passed)
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword
  const blockedHint = !currentPassword
    ? "Escribe tu contraseña actual."
    : !allPassed
      ? "La nueva contraseña aún no cumple todos los requisitos."
      : !passwordsMatch
        ? "Confirma la nueva contraseña."
        : ""
  const blocked = !isLoading && blockedHint !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (!allPassed) {
      toast.error("La contraseña no cumple todos los requisitos")
      return
    }
    setIsLoading(true)
    try {
      await authService.changePassword({ currentPassword, newPassword })
      toast.success("Contraseña actualizada correctamente")
      onChangeSuccess?.()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "No se pudo actualizar la contraseña"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("motria-auth-card", className)}>
      <CardHeader className="gap-0 px-0">
        <h1 className="motria-heading motria-auth-title">
          Actualiza tu contraseña
        </h1>
        <p className="motria-auth-intro">
          Por seguridad, debes actualizar tu contraseña antes de continuar.
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <form
          onSubmit={handleSubmit}
          className="motria-auth-form space-y-6"
          aria-busy={isLoading}
        >
          <AuthField
            id="currentPassword"
            label="Contraseña actual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          <div className="space-y-3">
            <AuthField
              id="newPassword"
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-describedby="password-criteria"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />

            <ul
              id="password-criteria"
              className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2"
            >
              {checks.map((c) => (
                <li
                  key={c.label}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors duration-200",
                    c.passed ? "text-status-done" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                      c.passed
                        ? "border-status-done bg-status-done text-white"
                        : "border-input bg-transparent",
                    )}
                    aria-hidden="true"
                  >
                    <Check
                      className={cn(
                        "size-2.5 transition-opacity duration-200",
                        c.passed ? "opacity-100" : "opacity-0",
                      )}
                      strokeWidth={3.5}
                    />
                  </span>
                  {c.label}
                  <span className="sr-only">
                    {c.passed ? "(cumplido)" : "(pendiente)"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <AuthField
            id="confirmPassword"
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              confirmPassword.length > 0 && !passwordsMatch
                ? "Las contraseñas no coinciden."
                : undefined
            }
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          <p role="status" className="sr-only">
            {isLoading ? "Actualizando contraseña…" : ""}
          </p>
          <Button
            type="submit"
            className={cn(
              "motria-auth-submit",
              blocked && "motria-auth-submit-blocked",
            )}
            disabled={isLoading || blockedHint !== ""}
            aria-describedby={blocked ? "change-password-hint" : undefined}
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
          {blocked && (
            <p
              id="change-password-hint"
              className="-mt-3 text-xs text-muted-foreground"
            >
              {blockedHint}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
