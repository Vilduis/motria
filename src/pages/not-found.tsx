import { Link, useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoMark } from "@/components/brand/logo"
import { ModeToggle } from "@/components/mode-toggle"
import authService from "@/services/authService"

export default function NotFoundPage() {
  const location = useLocation()
  const isAuthenticated = authService.isAuthenticated()

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <span className="flex size-8 -rotate-8 items-center justify-center rounded-full border-2 border-brand text-brand">
            <LogoMark size={17} strokeWidth={2.7} />
          </span>
          <span className="font-heading text-2xl font-bold leading-none tracking-[-0.03em]">
            motria<span className="text-brand">.</span>
          </span>
        </Link>
        <ModeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-center"
        >
          <p className="text-eyebrow mb-3 text-brand">Error 404</p>
          <h1 className="text-display">
            Página no encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-body text-muted-foreground">
            La ruta{" "}
            <span className="text-mono rounded-md border border-border/70 bg-secondary/50 px-1.5 py-0.5 text-[12px] text-foreground/80 dark:bg-white/[0.04]">
              {location.pathname}
            </span>{" "}
            no existe o fue movida.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/"}>
                {isAuthenticated ? (
                  <>
                    <LayoutDashboard className="size-4" />
                    Ir al panel
                  </>
                ) : (
                  <>
                    <ArrowLeft className="size-4" />
                    Volver al inicio
                  </>
                )}
              </Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to="/">Ir a la portada</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border/40 px-5 py-4 text-center text-[11.5px] text-muted-foreground/55 md:px-8">
        © {new Date().getFullYear()} Motria
      </footer>
    </div>
  )
}
