import { useState } from "react"
import { Link } from "react-router-dom"
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
import authService from "@/services/authService"
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
      await authService.forgotPassword({ email })
    } catch {
      // El backend siempre responde 204 — si llegamos aquí es un error de red.
      // Aún así mostramos el mensaje genérico para no revelar nada.
    } finally {
      setIsLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <AuthShell showBrand>
      <Card className="w-full gap-0 py-0 shadow-elevated">
        {submitted ? (
          <>
            <CardHeader className="px-7 pb-1 pt-7">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-status-done-bg">
                <MailCheck className="size-5 text-status-done" />
              </div>
              <CardTitle className="text-h1">Revisa tu correo</CardTitle>
              <CardDescription>
                Si <span className="font-medium text-foreground">{email}</span>{" "}
                está registrado, recibirás un enlace para restablecer tu
                contraseña en unos minutos. Revisa también tu carpeta de spam.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-7 pb-7 pt-6">
              <p className="text-[12.5px] text-muted-foreground">
                El enlace expira en 30 minutos.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false)
                    setEmail("")
                    setEmailTouched(false)
                  }}
                >
                  Probar con otro correo
                </Button>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" />
                  Volver a iniciar sesión
                </Link>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="px-7 pb-1 pt-7">
              <CardTitle className="text-h1">
                Recupera tu contraseña
              </CardTitle>
              <CardDescription>
                Introduce tu correo y te enviaremos un enlace para crear una
                nueva.
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

                <Button
                  type="submit"
                  className="mt-2 h-10 w-full gap-1.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Enviar enlace
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
          </>
        )}
      </Card>
    </AuthShell>
  )
}
