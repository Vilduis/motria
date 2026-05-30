import { Link } from "react-router-dom"
import { motion } from "motion/react"
import {
  ClipboardList,
  Users,
  Car,
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  Wrench,
  Command,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LogoMark } from "@/components/brand/logo"
import { ProductPreview } from "@/components/brand/product-preview"
import authService from "@/services/authService"

const ease = [0.16, 1, 0.3, 1] as const

// ─── Features ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: ClipboardList,
    title: "Órdenes en tiempo real",
    description:
      "Crea, asigna y actualiza órdenes desde cualquier dispositivo. Tu equipo ve los cambios al instante.",
  },
  {
    icon: Users,
    title: "Equipo y roles",
    description:
      "Administradores y técnicos con permisos específicos. Cada quien accede solo a lo que necesita.",
  },
  {
    icon: Car,
    title: "Clientes y vehículos",
    description:
      "Historial completo de cada cliente y vehículo. Organizado, buscable y siempre disponible.",
  },
]

// ─── Footer columns ───────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    label: "Producto",
    links: [
      { label: "Funciones", href: "#features" },
      { label: "Precios", href: "#" },
      { label: "Cambios", href: "#" },
    ],
  },
  {
    label: "Empresa",
    links: [
      { label: "Sobre nosotros", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contacto", href: "#" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Seguridad", href: "#" },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const isLoggedIn = authService.isAuthenticated()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <LogoMark size={18} className="text-brand" />
            <span className="font-heading text-[15px] font-semibold tracking-[-0.01em]">
              Workshop
            </span>
          </Link>

          <nav className="flex items-center gap-1.5">
            <a
              href="#features"
              className="hidden h-7 items-center px-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Funciones
            </a>
            <ModeToggle />
            <div className="mx-1 h-5 w-px bg-border/60" />
            {isLoggedIn ? (
              <Button size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="size-3.5" />
                  Ir al panel
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Crear cuenta</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative py-20 md:py-28">
          {/* Subtle horizon line — single tasteful effect, no glow blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent"
          />

          <div className="mx-auto max-w-5xl px-6">
            <div className="grid items-center gap-14 md:grid-cols-[1fr_1.1fr]">
              {/* Copy */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground dark:bg-white/[0.03]">
                  <Wrench className="size-3" />
                  Software para talleres mecánicos
                </div>

                <h1 className="text-display">
                  El sistema operativo
                  <br />
                  <span className="text-muted-foreground/55">de tu taller.</span>
                </h1>

                <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Clientes, vehículos, órdenes y técnicos en un solo lugar.
                  Construido para talleres que quieren operar con precisión.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button size="lg" asChild>
                    <Link to="/signup">
                      Empieza gratis
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-1 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Iniciar sesión
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease, delay: 0.12 }}
              >
                <ProductPreview />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────── */}
        <section
          id="features"
          className="border-t border-border/40 py-24 md:py-28"
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-14 max-w-xl">
              <p className="text-eyebrow mb-3">Funciones</p>
              <h2 className="text-h1 text-[28px] md:text-[32px]">
                Todo lo que necesitas,
                <br />
                nada más.
              </h2>
              <p className="mt-3 text-body text-muted-foreground">
                Diseñado para talleres reales, con flujos de trabajo reales.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, ease, delay: i * 0.08 }}
                  className="flex flex-col gap-4 bg-card p-7"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/40">
                    <feat.icon className="size-4 text-muted-foreground/85" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-h3">{feat.title}</h3>
                    <p className="text-body-sm text-muted-foreground">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Keyboard / shortcuts callout ───────────────── */}
        <section className="border-t border-border/40 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease }}
              className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="max-w-md space-y-2">
                <p className="text-eyebrow">Hecho para ir rápido</p>
                <h3 className="text-h2 text-[22px]">
                  Atajos de teclado en cada acción.
                </h3>
                <p className="text-body-sm text-muted-foreground">
                  Buscar, navegar y crear sin tocar el ratón. Tu equipo trabaja
                  más rápido desde el primer día.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="inline-flex h-9 items-center gap-1 rounded-md border border-border/80 bg-card px-2.5 text-[13px] font-medium text-foreground shadow-card">
                  <Command className="size-3.5" />K
                </kbd>
                <span className="text-[13px] text-muted-foreground">
                  Abrir paleta de comandos
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────── */}
        <section className="border-t border-border/40 py-24 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease }}
            className="mx-auto max-w-2xl px-6 text-center"
          >
            <h2 className="text-display text-[clamp(1.9rem,3.8vw,2.6rem)]">
              Tu taller, bajo control.
            </h2>
            <p className="mt-4 text-body text-muted-foreground">
              Únete y empieza a gestionar órdenes, clientes y tu equipo técnico
              desde el primer día.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Crear cuenta gratis
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand col */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LogoMark size={16} className="text-brand" />
                <span className="font-heading text-[14px] font-semibold tracking-[-0.01em]">
                  Workshop
                </span>
              </div>
              <p className="max-w-[220px] text-[12.5px] leading-relaxed text-muted-foreground">
                El sistema operativo de tu taller mecánico.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.label} className="space-y-3">
                <p className="text-eyebrow">{col.label}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 sm:flex-row sm:items-center">
            <p className="text-[11.5px] text-muted-foreground/55">
              © {new Date().getFullYear()} Workshop. Todos los derechos
              reservados.
            </p>
            <p className="text-[11.5px] text-muted-foreground/55">
              Hecho para talleres modernos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
