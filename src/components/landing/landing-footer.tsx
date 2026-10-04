import { Link } from "react-router-dom"
import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MotriaLogo } from "@/components/brand/motria-logo"

export function LandingFooter({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <footer id="empieza" className="motria-footer bg-[#191b20] text-white">
      <div className="motria-container">
        <div className="flex flex-col justify-between gap-8 border-b border-white/15 py-14 md:flex-row md:items-center md:py-18">
          <div>
            <h2 className="motria-heading text-[clamp(2.5rem,4.5vw,3.75rem)] leading-[1.05]">
              Tu próximo paso.
              <br />
              <span className="text-white/65">Un taller más organizado.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              Dale a cada cliente, vehículo y servicio su lugar.
            </p>
          </div>
          <Button asChild className="motria-button w-fit shrink-0">
            <Link to={isLoggedIn ? "/dashboard" : "/signup"}>
              {isLoggedIn ? "Ir a mi panel" : "Crear mi taller"}
              <span className="motria-button-arrow">
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Link>
          </Button>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr] lg:gap-20">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#inicio" aria-label="Motria, volver al inicio">
              <MotriaLogo />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
              Software para talleres mecánicos.
              <br />
              Menos pendientes sueltos.
              <br />
              Más claridad para tu equipo.
            </p>
          </div>
          <nav aria-label="Producto">
            <h3 className="mb-5 text-sm font-bold">Explora Motria</h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <a href="#como-funciona">Cómo funciona</a>
              </li>
              <li>
                <a href="#funciones">Funciones</a>
              </li>
              <li>
                <a href="#por-que-motria">Por qué Motria</a>
              </li>
              <li>
                <a href="#en-accion">Ver la demostración</a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Acceso y ayuda">
            <h3 className="mb-5 text-sm font-bold">Da el siguiente paso</h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <Link to="/signup">Registrar mi taller</Link>
              </li>
              <li>
                <Link to="/login">Iniciar sesión</Link>
              </li>
              <li>
                <a href="#preguntas">Preguntas frecuentes</a>
              </li>
              {isLoggedIn && (
                <li>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2"
                  >
                    Mi panel
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 border-t border-white/15 py-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Motria. Todos los derechos reservados.
          </p>
          <a href="#inicio" className="inline-flex min-h-10 items-center gap-3">
            Volver arriba
            <span className="flex size-8 items-center justify-center rounded-full border border-white/25">
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
