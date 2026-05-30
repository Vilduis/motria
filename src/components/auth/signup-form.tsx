import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
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
import { PasswordStrength } from "@/components/auth/password-strength"
import authService from "@/services/authService"
import { toast } from "sonner"
import { Loader2, ArrowRight, Check } from "lucide-react"
import { getErrorMessage } from "@/lib/errorHandler"
import { isValidPhone, normalizePhone, PHONE_ERROR } from "@/lib/validation"

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSignupSuccess?: (mustChangePassword: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SectionHeading({
  title,
  hint,
}: {
  title: string
  hint?: string
}) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {title}
      </h2>
      {hint && (
        <span className="text-[11px] text-muted-foreground/55">{hint}</span>
      )}
    </div>
  )
}

export function SignupForm({
  className,
  onSignupSuccess,
  ...props
}: SignupFormProps) {
  const [form, setForm] = useState({
    workshopName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const markTouched = (field: string) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const emailError =
    touched.email && form.email.length > 0 && !EMAIL_RE.test(form.email)
      ? "Introduce un correo válido"
      : null

  const passwordError =
    touched.password && form.password.length > 0 && form.password.length < 8
      ? "Mínimo 8 caracteres"
      : null

  const confirmError =
    touched.confirmPassword &&
    form.confirmPassword.length > 0 &&
    form.confirmPassword !== form.password
      ? "Las contraseñas no coinciden"
      : null

  const phoneError =
    touched.phone && form.phone.trim().length > 0 && !isValidPhone(form.phone)
      ? PHONE_ERROR
      : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    })
    if (!EMAIL_RE.test(form.email)) return
    if (form.password.length < 8) return
    if (form.password !== form.confirmPassword) return
    if (form.phone.trim() && !isValidPhone(form.phone)) {
      setTouched((prev) => ({ ...prev, phone: true }))
      return
    }

    setIsLoading(true)
    try {
      const data = await authService.registerWorkshop({
        workshopName: form.workshopName.trim(),
        ownerName: form.ownerName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: normalizePhone(form.phone) || undefined,
        address: form.address.trim() || undefined,
      })
      toast.success(`Bienvenido a ${data.workshopName}`)
      onSignupSuccess?.(Boolean(data.mustChangePassword))
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "No se pudo registrar el taller. Intenta nuevamente.",
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={cn("w-full gap-0 py-0 shadow-elevated", className)}
      {...props}
    >
      <CardHeader className="px-7 pb-1 pt-7">
        <CardTitle className="text-h1">Crea tu cuenta</CardTitle>
        <CardDescription>
          Configura tu taller en menos de 5 minutos.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-7 pb-7 pt-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Sección: Tu taller */}
          <div className="space-y-3">
            <SectionHeading title="Tu taller" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="workshopName">Nombre del taller</Label>
                <Input
                  id="workshopName"
                  type="text"
                  placeholder="Taller Sandoval"
                  value={form.workshopName}
                  onChange={update("workshopName")}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ownerName">Propietario</Label>
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={form.ownerName}
                  onChange={update("ownerName")}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Sección: Tu cuenta */}
          <div className="space-y-3">
            <SectionHeading title="Tu cuenta" />
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="dueno@taller.com"
                value={form.email}
                onChange={update("email")}
                onBlur={markTouched("email")}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "email-error" : undefined}
                required
                disabled={isLoading}
                autoComplete="email"
              />
              {emailError && (
                <p
                  id="email-error"
                  className="text-[12px] text-destructive"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mín. 8 caracteres"
                  value={form.password}
                  onChange={update("password")}
                  onBlur={markTouched("password")}
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={
                    passwordError ? "password-error" : "password-strength"
                  }
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repetir contraseña"
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  onBlur={markTouched("confirmPassword")}
                  aria-invalid={confirmError ? true : undefined}
                  aria-describedby={
                    confirmError ? "confirm-error" : undefined
                  }
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <PasswordStrength
              password={form.password}
              id="password-strength"
            />
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
              form.confirmPassword.length > 0 &&
              form.confirmPassword === form.password && (
                <p className="flex items-center gap-1 text-[12px] text-status-done">
                  <Check className="size-3.5" />
                  Las contraseñas coinciden
                </p>
              )}
          </div>

          {/* Sección: Contacto (opcional) */}
          <div className="space-y-3">
            <SectionHeading title="Contacto" hint="Opcional" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="999 999 999"
                  value={form.phone}
                  onChange={update("phone")}
                  onBlur={markTouched("phone")}
                  aria-invalid={phoneError ? true : undefined}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  disabled={isLoading}
                />
                {phoneError && (
                  <p
                    id="phone-error"
                    className="text-[12px] text-destructive"
                    role="alert"
                  >
                    {phoneError}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Av. Principal 123"
                  value={form.address}
                  onChange={update("address")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-1 h-10 w-full gap-1.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creando cuenta…
              </>
            ) : (
              <>
                Crear cuenta
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            Inicia sesión
          </Link>
        </p>

        <p className="mt-5 text-[11.5px] text-muted-foreground/55">
          Al continuar aceptas los{" "}
          <a
            href="#"
            className="underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            Términos
          </a>{" "}
          y la{" "}
          <a
            href="#"
            className="underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            Política de privacidad
          </a>
          .
        </p>
      </CardContent>
    </Card>
  )
}
