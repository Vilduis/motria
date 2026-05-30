import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import authService from "@/services/authService"
import { toast } from "sonner"
import { Loader2, ShieldCheck, Check } from "lucide-react"
import { getErrorMessage } from "@/lib/errorHandler"

interface ChangePasswordFormProps extends React.ComponentProps<"div"> {
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
  ...props
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
    <div className={cn("flex flex-col gap-7", className)} {...props}>
      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/40">
          <ShieldCheck className="size-5 text-muted-foreground/80" />
        </div>
        <div className="space-y-1">
          <h1 className="text-h2">Actualiza tu contraseña</h1>
          <p className="text-body-sm max-w-xs text-balance text-muted-foreground">
            Por seguridad, debes actualizar tu contraseña antes de continuar.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          {/* Live criteria checklist */}
          <ul className="mt-3 grid grid-cols-2 gap-1.5">
            {checks.map((c) => (
              <li
                key={c.label}
                className={cn(
                  "flex items-center gap-1.5 text-[11.5px] transition-colors duration-200",
                  c.passed ? "text-status-done" : "text-muted-foreground/60",
                )}
              >
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                    c.passed
                      ? "border-status-done/40 bg-status-done-bg"
                      : "border-border bg-transparent",
                  )}
                >
                  <Check
                    className={cn(
                      "size-2.5 transition-opacity duration-200",
                      c.passed ? "opacity-100" : "opacity-0",
                    )}
                    strokeWidth={3}
                  />
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            aria-invalid={
              confirmPassword.length > 0 && !passwordsMatch ? true : undefined
            }
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11.5px] text-destructive">
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-1 h-10 w-full"
          disabled={isLoading || !allPassed || !passwordsMatch}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Actualizando…
            </span>
          ) : (
            "Actualizar contraseña"
          )}
        </Button>
      </form>
    </div>
  )
}
