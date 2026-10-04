import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, Menu, UserRound, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MotriaLogo } from "@/components/brand/motria-logo"

const NAVIGATION = [
  { label: "Inicio", href: "#inicio" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Funciones", href: "#funciones" },
  { label: "Por qué Motria", href: "#por-que-motria" },
] as const

export function LandingHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const destination = isLoggedIn ? "/dashboard" : "/signup"
  const action = isLoggedIn ? "Ir a mi panel" : "Crear mi taller"

  return (
    <header className="motria-header relative z-20 border-b border-white/15">
      <div className="motria-container flex h-22 items-center justify-between gap-6">
        <a
          href="#inicio"
          aria-label="Motria, inicio"
          className="shrink-0 text-white"
        >
          <MotriaLogo />
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAVIGATION.map((item) => (
            <a key={item.href} href={item.href} className="motria-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {!isLoggedIn && (
            <Link
              to="/login"
              className="motria-nav-link inline-flex items-center gap-2"
            >
              <UserRound aria-hidden="true" className="size-4" />
              Ingresar
            </Link>
          )}
          <Button asChild className="motria-button h-11">
            <Link to={destination}>
              {action}
              <span className="motria-button-arrow">
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Link>
          </Button>
        </div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Abrir menú"
              className="size-11 text-white hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu aria-hidden="true" className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="motria-landing motria-mobile-menu w-[88%] max-w-sm">
            <SheetHeader className="px-6 py-8">
              <SheetTitle>
                <MotriaLogo />
              </SheetTitle>
              <SheetDescription>Tu taller, bajo control.</SheetDescription>
            </SheetHeader>
            <nav
              aria-label="Navegación móvil"
              className="flex flex-col px-6 py-5"
            >
              {NAVIGATION.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center justify-between border-b border-border py-4 text-base font-medium"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href="#preguntas"
                  className="border-b border-border py-4 text-base font-medium"
                >
                  Preguntas frecuentes
                </a>
              </SheetClose>
            </nav>
            <div className="mt-auto space-y-3 px-6 py-8">
              <SheetClose asChild>
                <Button asChild className="motria-button w-full">
                  <Link to={destination}>
                    {action}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </Button>
              </SheetClose>
              {!isLoggedIn && (
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-full"
                  >
                    <Link to="/login">Iniciar sesión</Link>
                  </Button>
                </SheetClose>
              )}
              <p className="flex items-center justify-center gap-2 pt-3 text-xs text-muted-foreground">
                <Wrench aria-hidden="true" className="size-3.5" /> Software para
                talleres mecánicos
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
