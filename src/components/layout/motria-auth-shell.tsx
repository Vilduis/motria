import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { MotriaLogo } from "@/components/brand/motria-logo"
import "@/styles/auth.css"

export function MotriaAuthShell({
  children,
  variant,
}: {
  children: ReactNode
  variant:
    | "login"
    | "signup"
    | "forgot-password"
    | "reset-password"
    | "change-password"
}) {
  const isSignup = variant === "signup"
  const isRecovery = variant === "forgot-password" || variant === "reset-password"
  const isChange = variant === "change-password"
  const title =
    variant === "forgot-password"
      ? "Recupera tu contraseña"
      : variant === "reset-password"
        ? "Nueva contraseña"
        : isChange
          ? "Actualiza tu contraseña"
          : isSignup
            ? "Crea tu cuenta"
            : "Inicia sesión"

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} · Motria`
    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <div className="motria-auth">
      <a href="#auth-form" className="motria-auth-skip">
        Saltar al formulario
      </a>
      <aside className="motria-auth-aside" aria-label="Tu taller con Motria">
        <img
          src={
            isSignup ? "/images/workshop-team.jpg" : "/images/workshop-hero.jpg"
          }
          alt=""
          className="motria-auth-photo"
          width={1600}
          height={1067}
          fetchPriority="high"
        />
        <div className="motria-auth-shade" />
        <Link
          to="/"
          aria-label="Motria, ir al inicio"
          className="relative w-fit"
        >
          <MotriaLogo />
        </Link>
        <div className="motria-auth-story">
          <h2 className="motria-heading">
            {isChange ? (
              <>
                Un último paso.
                <br />
                <span>Tu taller te espera.</span>
              </>
            ) : isRecovery ? (
              <>
                Vuelve a entrar.
                <br />
                <span>Sigue con tu taller.</span>
              </>
            ) : isSignup ? (
              <>
                Tu próximo paso.
                <br />
                <span>Un taller más organizado.</span>
              </>
            ) : (
              <>
                Tu taller,
                <br />
                <span>bajo control.</span>
              </>
            )}
          </h2>
          <p>
            {isChange
              ? "Por seguridad, crea una contraseña propia antes de entrar al panel de tu taller."
              : isRecovery
              ? "Recupera el acceso a Motria y vuelve a organizar el día a día de tu taller."
              : isSignup
              ? "Dale a cada cliente, vehículo y servicio su lugar. Empieza con tu taller y suma a tu equipo."
              : "Cada orden, cada vehículo, cada persona. Vuelve al lugar donde todo el trabajo se conecta."}
          </p>
        </div>
        <div className="motria-auth-aside-footer">
          <p>
            Tu experiencia mueve el taller.
            <br />
            Motria te ayuda a organizarlo.
          </p>
          <ArrowUpRight className="size-6" aria-hidden="true" />
        </div>
      </aside>

      <div className="motria-auth-panel">
        <header className="motria-auth-header">
          <Link to="/" className="motria-auth-back">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Volver al inicio</span>
          </Link>
          <Link to="/" aria-label="Motria, ir al inicio" className="lg:hidden">
            <MotriaLogo />
          </Link>
          <span className="hidden text-xs text-muted-foreground lg:block">
            Software para talleres
          </span>
        </header>
        <main id="auth-form" tabIndex={-1} className="motria-auth-main">
          {children}
        </main>
        <footer className="motria-auth-footer">
          <span>© {new Date().getFullYear()} Motria</span>
          <Link to="/#preguntas">
            Preguntas frecuentes{" "}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </div>
  )
}
