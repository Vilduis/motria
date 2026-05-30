import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ModeToggle } from "@/components/mode-toggle"
import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  children: React.ReactNode
  /** Optional left-side content. When provided, layout becomes a 2-col split on md+. */
  aside?: React.ReactNode
  /** Width of the form container (when no aside) or the full split (when aside). */
  maxWidth?: string
  className?: string
  showBrand?: boolean
  showFooter?: boolean
}

export function AuthShell({
  children,
  aside,
  maxWidth,
  className,
  showBrand = false,
  showFooter = true,
}: AuthShellProps) {
  const hasAside = !!aside
  const containerWidth = maxWidth ?? (hasAside ? "max-w-5xl" : "max-w-sm")

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      {/* Ambient background — radial glow + dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-x-0 top-0 h-[420px] opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 0%, var(--brand-subtle), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 0.6px, transparent 0.6px)",
            backgroundSize: "22px 22px",
            color: "var(--border)",
            maskImage:
              "radial-gradient(ellipse 75% 60% at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 60% at 50% 40%, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
        {showBrand ? (
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <LogoMark size={18} className="text-brand" />
            <span className="font-heading text-[15px] font-semibold tracking-[-0.01em]">
              Workshop
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}
        <ModeToggle />
      </header>

      {/* Centered content */}
      <main
        className={cn(
          "relative flex flex-1 items-center justify-center px-5 pb-12 pt-2 md:px-8",
          hasAside ? "md:pb-12" : "md:pb-16",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn("relative w-full", containerWidth, className)}
        >
          {hasAside ? (
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
              <div className="hidden md:block">{aside}</div>
              <div className="mx-auto w-full max-w-md md:mx-0">{children}</div>
            </div>
          ) : (
            children
          )}
        </motion.div>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="relative z-10 flex items-center justify-between border-t border-border/40 px-5 py-4 text-[11.5px] text-muted-foreground/60 md:px-8">
          <span>© {new Date().getFullYear()} Workshop</span>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="transition-colors hover:text-muted-foreground"
            >
              Términos
            </a>
            <a
              href="#"
              className="transition-colors hover:text-muted-foreground"
            >
              Privacidad
            </a>
          </div>
        </footer>
      )}
    </div>
  )
}
