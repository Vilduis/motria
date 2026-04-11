import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import authService from "@/services/authService"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLoginSuccess?: () => void
}

export function LoginForm({
  className,
  onLoginSuccess,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.login({ email, password })
      toast.success("¡Bienvenido de nuevo!")
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const message = error.response?.data?.message || "Credenciales incorrectas o error de servidor"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid min-h-[500px] p-0 md:grid-cols-2">
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-6 md:p-12 lg:p-16"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Bienvenido de nuevo
                </h1>
                <p className="text-balance text-muted-foreground">
                  Inicia sesión en tu cuenta de Workshop
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/login-bg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#">Términos de servicio</a> y{" "}
        <a href="#">Política de privacidad</a>.
      </FieldDescription>
    </div>
  )
}

