import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthField } from "@/components/auth/auth-field"
import { MotriaAuthShell } from "@/components/layout/motria-auth-shell"
import authService from "@/services/authService"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [serverError, setServerError] = useState("")
  const pending = useRef(false)
  const wasSubmitted = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (serverError) errorRef.current?.focus()
  }, [serverError])

  useEffect(() => {
    if (submitted) confirmationRef.current?.focus()
    else if (wasSubmitted.current) {
      ;(formRef.current?.elements.namedItem("email") as HTMLInputElement)?.focus()
    }
    wasSubmitted.current = submitted
  }, [submitted])

  const emailError = !email.trim()
    ? "Introduce tu correo electrónico."
    : !EMAIL_RE.test(email.trim())
      ? "Introduce un correo válido."
      : undefined

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (pending.current) return
    setEmailTouched(true)
    setServerError("")
    if (emailError) {
      ;(formRef.current?.elements.namedItem("email") as HTMLInputElement)?.focus()
      return
    }
    pending.current = true
    setIsLoading(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSubmitted(true)
    } catch (error: unknown) {
      // Never echo backend messages that could disclose account existence.
      setServerError(
        axios.isAxiosError(error) && !error.response
          ? "No pudimos conectar. Comprueba tu conexión e inténtalo de nuevo."
          : axios.isAxiosError(error) && error.response?.status === 429
            ? "Has hecho varios intentos. Espera unos minutos antes de volver a intentarlo."
            : "No pudimos completar la solicitud. Inténtalo de nuevo en unos minutos."
      )
    } finally {
      pending.current = false
      setIsLoading(false)
    }
  }

  return (
    <MotriaAuthShell variant="forgot-password">
      <Card className="motria-auth-card">
        {submitted ? (
          <>
            <CardHeader className="gap-0 px-0">
              <MailCheck
                className="mb-5 size-8 text-status-done"
                aria-hidden="true"
              />
              <h1
                ref={confirmationRef}
                tabIndex={-1}
                className="motria-heading motria-auth-title"
              >
                Revisa tu correo
              </h1>
              <p className="motria-auth-intro">
                Si <strong className="font-semibold text-foreground [overflow-wrap:anywhere]">{email.trim()}</strong>{" "}
                está registrado, recibirás un enlace para restablecer tu
                contraseña en unos minutos.
              </p>
            </CardHeader>
            <CardContent className="px-0">
              <div className="motria-auth-recovery-note">
                <p>Revisa también tu carpeta de spam.</p>
                <p>El enlace expira en 30 minutos.</p>
              </div>
              <Button asChild className="motria-auth-submit">
                <Link to="/login">
                  <span>Volver a iniciar sesión</span>
                  <span className="motria-auth-submit-icon" aria-hidden="true">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </Button>
              <div className="motria-auth-switch">
                <Button
                  type="button"
                  variant="link"
                  className="motria-auth-link min-h-11 h-auto px-0 text-[13px]"
                  onClick={() => {
                    setSubmitted(false)
                    setEmailTouched(false)
                  }}
                >
                  Probar con otro correo
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="gap-0 px-0">
              <h1 className="motria-heading motria-auth-title">
                Recupera tu contraseña
              </h1>
              <p className="motria-auth-intro">
                Introduce el correo de tu cuenta y te enviaremos un enlace para
                crear una nueva contraseña.
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
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setServerError("")
                  }}
                  onBlur={() => setEmailTouched(true)}
                  error={emailTouched ? emailError : undefined}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                />
                <p role="status" className="sr-only">
                  {isLoading ? "Enviando solicitud…" : ""}
                </p>
                <Button
                  type="submit"
                  className="motria-auth-submit"
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Enviando…" : "Enviar enlace"}</span>
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
          </>
        )}
      </Card>
    </MotriaAuthShell>
  )
}
