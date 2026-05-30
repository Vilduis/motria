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
import authService from "@/services/authService"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"
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
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError =
    emailTouched && email.length > 0 && !EMAIL_RE.test(email)
      ? "Introduce un correo válido"
      : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    if (!EMAIL_RE.test(email)) return
    setIsLoading(true)
    try {
      const data = await authService.login({ email, password })
      toast.success(
        data.workshopName
          ? `Bienvenido a ${data.workshopName}`
          : "Bienvenido de nuevo",
      )
      onLoginSuccess?.(Boolean(data.mustChangePassword))
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Credenciales incorrectas o error de servidor"),
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
        <CardTitle className="text-h1">Inicia sesión</CardTitle>
        <CardDescription>
          Accede al panel de control de tu taller.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-7 pb-7 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@taller.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
              required
              disabled={isLoading}
              autoComplete="email"
              autoFocus
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                to="/forgot-password"
                className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 h-10 w-full gap-1.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Iniciando sesión…
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
