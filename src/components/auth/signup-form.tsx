import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AuthField } from "@/components/auth/auth-field"
import { PasswordStrength } from "@/components/auth/password-strength"
import authService from "@/services/authService"
import { getErrorMessage } from "@/lib/errorHandler"
import { isValidPhone, normalizePhone, PHONE_ERROR } from "@/lib/validation"

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSignupSuccess?: (mustChangePassword: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INITIAL_FORM = {
  workshopName: "",
  ownerName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  address: "",
}
type Field = keyof typeof INITIAL_FORM

export function SignupForm({
  className,
  onSignupSuccess,
  ...props
}: SignupFormProps) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [serverError, setServerError] = useState("")
  const [contactOpen, setContactOpen] = useState("")
  const pending = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (serverError) errorRef.current?.focus()
  }, [serverError])

  const errors: Partial<Record<Field, string>> = {}
  if (!form.workshopName.trim())
    errors.workshopName = "Introduce el nombre de tu taller."
  if (!form.ownerName.trim())
    errors.ownerName = "Introduce el nombre del propietario."
  if (!form.email.trim()) errors.email = "Introduce tu correo electrónico."
  else if (!EMAIL_RE.test(form.email.trim()))
    errors.email = "Introduce un correo válido."
  if (form.password.length < 8) errors.password = "Usa al menos 8 caracteres."
  if (!form.confirmPassword) errors.confirmPassword = "Repite tu contraseña."
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Las contraseñas no coinciden."
  if (form.phone.trim() && !isValidPhone(form.phone)) errors.phone = PHONE_ERROR

  const fieldProps = (field: Field) => ({
    id: field,
    value: form[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setServerError("")
    },
    onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
    error: touched[field] ? errors[field] : undefined,
    disabled: isLoading,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (pending.current) return
    setTouched({
      workshopName: true,
      ownerName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    })
    setServerError("")
    const firstInvalid = (Object.keys(INITIAL_FORM) as Field[]).find(
      (field) => errors[field]
    )
    if (firstInvalid) {
      if (errors.phone) setContactOpen("contact")
      requestAnimationFrame(() => {
        ;(
          formRef.current?.elements.namedItem(firstInvalid) as HTMLInputElement
        )?.focus()
      })
      return
    }
    pending.current = true
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
      setServerError(
        axios.isAxiosError(error) && !error.response
          ? "No pudimos conectar. Comprueba tu conexión e inténtalo de nuevo."
          : getErrorMessage(
              error,
              "No se pudo registrar el taller. Inténtalo de nuevo."
            )
      )
    } finally {
      pending.current = false
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={cn("motria-auth-card motria-auth-card-signup", className)}
      {...props}
    >
      <CardHeader className="gap-0 px-0">
        <h1 className="motria-heading motria-auth-title">
          Dale un lugar a tu taller.
        </h1>
        <p className="motria-auth-intro">
          Crea tu cuenta para organizar tu taller con Motria.
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
          {serverError && (
            <div
              ref={errorRef}
              role="alert"
              tabIndex={-1}
              className="motria-auth-server-error"
            >
              {serverError}
            </div>
          )}
          <fieldset className="min-w-0" disabled={isLoading}>
            <legend className="motria-auth-legend">Tu taller</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField
                {...fieldProps("workshopName")}
                label="Nombre del taller"
                placeholder="Nombre de tu taller"
                autoComplete="organization"
                required
              />
              <AuthField
                {...fieldProps("ownerName")}
                label="Propietario"
                placeholder="Tu nombre completo"
                autoComplete="name"
                required
              />
            </div>
          </fieldset>
          <fieldset className="min-w-0 space-y-4" disabled={isLoading}>
            <legend className="motria-auth-legend">Tu cuenta</legend>
            <AuthField
              {...fieldProps("email")}
              label="Correo electrónico"
              type="email"
              placeholder="tu@taller.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField
                {...fieldProps("password")}
                label="Contraseña"
                type="password"
                placeholder="Mín. 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                aria-describedby="password-hint"
                required
              />
              <AuthField
                {...fieldProps("confirmPassword")}
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
              />
            </div>
            <p
              id="password-hint"
              className="text-xs leading-5 text-muted-foreground"
            >
              Usa al menos 8 caracteres. Combina letras, números y símbolos para
              hacerla más segura.
            </p>
            <PasswordStrength password={form.password} />
          </fieldset>
          <Accordion
            type="single"
            collapsible
            value={contactOpen}
            onValueChange={setContactOpen}
          >
            <AccordionItem value="contact" className="border-y">
              <AccordionTrigger
                className="py-4 text-[13px]"
                disabled={isLoading}
              >
                <span>
                  Datos de contacto{" "}
                  <span className="ml-2 font-normal text-muted-foreground">
                    Opcional
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pr-0 pb-5">
                <p className="text-xs leading-5">
                  Puedes añadirlos ahora o completarlos después desde tu cuenta.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AuthField
                    {...fieldProps("phone")}
                    label="Teléfono"
                    type="tel"
                    inputMode="tel"
                    maxLength={11}
                    placeholder="999 999 999"
                    autoComplete="tel-national"
                  />
                  <AuthField
                    {...fieldProps("address")}
                    label="Dirección"
                    placeholder="Calle y número"
                    autoComplete="street-address"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p role="status" className="sr-only">
            {isLoading ? "Creando cuenta…" : ""}
          </p>
          <Button
            type="submit"
            className="motria-auth-submit"
            disabled={isLoading}
          >
            <span>
              {isLoading ? "Creando cuenta…" : "Crear cuenta"}
            </span>
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
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="motria-auth-link">
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
