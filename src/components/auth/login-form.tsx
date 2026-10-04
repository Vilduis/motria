import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthField } from "@/components/auth/auth-field"
import authService from "@/services/authService"
import { getErrorMessage } from "@/lib/errorHandler"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLoginSuccess?: (mustChangePassword: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm({
  className,
  onLoginSuccess,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [serverError, setServerError] = useState("")
  const pending = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (serverError) errorRef.current?.focus()
  }, [serverError])
  const emailError = !email.trim()
    ? "Introduce tu correo electrónico."
    : !EMAIL_RE.test(email.trim())
      ? "Introduce un correo válido."
      : undefined
  const passwordError = !password ? "Introduce tu contraseña." : undefined

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (pending.current) return
    setTouched({ email: true, password: true })
    setServerError("")
    if (emailError || passwordError) {
      const field = emailError ? "email" : "password"
      ;(formRef.current?.elements.namedItem(field) as HTMLInputElement)?.focus()
      return
    }
    pending.current = true
    setIsLoading(true)
    try {
      const data = await authService.login({ email: email.trim(), password })
      toast.success(
        data.workshopName
          ? `Bienvenido a ${data.workshopName}`
          : "Bienvenido de nuevo"
      )
      onLoginSuccess?.(Boolean(data.mustChangePassword))
    } catch (error: unknown) {
      setServerError(
        axios.isAxiosError(error) && error.response?.status === 401
          ? "El correo o la contraseña no son correctos. Revisa tus datos e inténtalo de nuevo."
          : axios.isAxiosError(error) && !error.response
            ? "No pudimos conectar. Comprueba tu conexión e inténtalo de nuevo."
            : getErrorMessage(
                error,
                "No pudimos iniciar sesión. Inténtalo de nuevo."
              )
      )
    } finally {
      pending.current = false
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("motria-auth-card", className)} {...props}>
      <CardHeader className="gap-0 px-0">
        <h1 className="motria-heading motria-auth-title">
          Qué bueno verte de nuevo.
        </h1>
        <p className="motria-auth-intro">
          Inicia sesión y sigue con el día a día de tu taller.
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
          <AuthField
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="tu@taller.com"
            value={email}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={isLoading}
            onChange={(event) => {
              setEmail(event.target.value)
              setServerError("")
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            error={touched.email ? emailError : undefined}
          />
          <AuthField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            autoComplete="current-password"
            required
            disabled={isLoading}
            onChange={(event) => {
              setPassword(event.target.value)
              setServerError("")
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            error={touched.password ? passwordError : undefined}
            trailing={
              <Link
                to="/forgot-password"
                className="motria-auth-link py-1 text-xs"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            }
          />
          <p role="status" className="sr-only">
            {isLoading ? "Iniciando sesión…" : ""}
          </p>
          <Button
            type="submit"
            className="motria-auth-submit"
            disabled={isLoading}
          >
            <span>
              {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
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
          ¿Aún no usas Motria?{" "}
          <Link to="/signup" className="motria-auth-link">
            Crea tu cuenta
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
