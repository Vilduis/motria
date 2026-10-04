import { Link } from "react-router-dom"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CarFront,
  ChartNoAxesCombined,
  Check,
  ClipboardList,
  Globe2,
  LayoutDashboard,
  MonitorSmartphone,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { OrderDemo } from "@/components/landing/order-demo"
import authService from "@/services/authService"
import "@/styles/landing.css"

const STEPS = [
  {
    number: "01",
    title: "Dale un lugar a tu taller",
    description:
      "Crea tu cuenta, registra tu taller y añade a los técnicos que forman tu equipo.",
  },
  {
    number: "02",
    title: "Organiza cada servicio",
    description:
      "Registra al cliente y su vehículo. Crea la orden, anota el diagnóstico y asigna un técnico.",
  },
  {
    number: "03",
    title: "Sigue el trabajo",
    description:
      "Consulta qué está pendiente, qué está en proceso y qué servicios ya terminaron.",
  },
]

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Órdenes de servicio",
    description:
      "Del diagnóstico al trabajo terminado. Cada servicio con su estado y responsable.",
    image: "workshop-engine.jpg",
    alt: "Mecánico revisando el motor de un vehículo",
  },
  {
    icon: UsersRound,
    title: "Clientes organizados",
    description:
      "Nombres, teléfonos y correos a mano para encontrar a cada cliente cuando lo necesitas.",
    image: "workshop-detail.jpg",
    alt: "Profesional en un taller de reparación automotriz",
  },
  {
    icon: CarFront,
    title: "Cada vehículo, en su lugar",
    description:
      "Placa, marca, modelo y propietario. La información del vehículo siempre vinculada a su cliente.",
    image: "workshop-tools.jpg",
    alt: "Vehículo en reparación dentro de un taller",
  },
  {
    icon: Wrench,
    title: "Un equipo coordinado",
    description:
      "Asigna el trabajo a tus técnicos. Cada uno puede consultar sus órdenes y actualizar el estado.",
    image: "workshop-team.jpg",
    alt: "Técnico trabajando en la suspensión de un automóvil",
  },
  {
    icon: ChartNoAxesCombined,
    title: "El taller, de un vistazo",
    description:
      "Consulta órdenes del día, actividad reciente y carga de trabajo desde el panel de inicio.",
    image: "workshop-service.jpg",
    alt: "Servicio de mantenimiento de una rueda en el elevador",
  },
  {
    icon: ShieldCheck,
    title: "Un acceso para cada rol",
    description:
      "Cuentas de administrador y técnico para organizar quién gestiona el taller y quién realiza el trabajo.",
    image: "workshop-hero.jpg",
    alt: "Trabajo de carrocería en un taller mecánico",
  },
]

const FAQS = [
  {
    question: "¿Qué puedo gestionar con Motria?",
    answer:
      "Puedes registrar clientes y vehículos, organizar a tus técnicos y crear órdenes de servicio con diagnóstico, responsable y estado. El panel reúne indicadores y actividad reciente para consultar la operación del taller.",
  },
  {
    question: "¿Necesito instalar algún programa?",
    answer:
      "No. Motria funciona desde el navegador, con conexión a internet. Puedes acceder a tu cuenta desde un ordenador, una tablet o un móvil.",
  },
  {
    question: "¿Mis técnicos tienen su propia cuenta?",
    answer:
      "Sí. El administrador registra a los técnicos desde el panel. Cada técnico recibe sus credenciales por correo y debe cambiar la contraseña temporal al entrar. Desde su cuenta puede consultar sus órdenes asignadas y actualizar su estado.",
  },
  {
    question: "¿Cómo empiezo a organizar mi taller?",
    answer:
      "Selecciona «Crear mi taller» y completa los datos de tu negocio y tu cuenta. Después podrás añadir a tu equipo, registrar al primer cliente y su vehículo, y crear una orden de servicio.",
  },
]

export default function LandingPage() {
  const isLoggedIn = authService.isAuthenticated()

  return (
    <div className="motria-landing" id="inicio">
      <a href="#contenido" className="motria-skip-link">
        Saltar al contenido
      </a>

      <div className="motria-utility bg-[#f5f5f4]">
        <div className="motria-container flex min-h-9 items-center justify-between gap-4 py-2 text-[10px] font-medium tracking-wide text-[#62646a] sm:text-[11px]">
          <span className="inline-flex items-center gap-2">
            <Wrench aria-hidden="true" className="size-3.5 text-primary" />
            Hecho para el día a día de tu taller
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Globe2 aria-hidden="true" className="size-3.5" />
            Tu taller, conectado
          </span>
        </div>
      </div>

      <main id="contenido" tabIndex={-1} className="outline-none">
        <div className="motria-hero relative isolate overflow-hidden bg-[#191b20] text-white">
          <img
            src="/images/workshop-hero.jpg"
            alt=""
            width={1920}
            height={1280}
            fetchPriority="high"
            className="motria-hero-image absolute inset-0 -z-20 size-full object-cover"
          />
          <div className="motria-hero-shade absolute inset-0 -z-10" />
          <LandingHeader isLoggedIn={isLoggedIn} />

          <section
            aria-labelledby="hero-title"
            className="motria-container relative pt-16 pb-9 md:pt-22 md:pb-12"
          >
            <div className="motria-hero-copy max-w-2xl">
              <h1
                id="hero-title"
                className="motria-heading text-[clamp(4.25rem,7.3vw,6.5rem)] leading-[0.98]"
              >
                Tu taller,
                <br />
                <span className="text-[#ff4858]">bajo</span> control.
              </h1>
              <p className="mt-7 max-w-[27rem] text-[15px] leading-7 text-white/85 sm:text-base">
                Clientes, vehículos y órdenes de servicio en un solo lugar. Tú
                te enfocas en el taller. Motria, en organizarlo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="motria-button">
                  <Link to={isLoggedIn ? "/dashboard" : "/signup"}>
                    {isLoggedIn ? "Ir a mi panel" : "Crear mi taller"}
                    <span className="motria-button-arrow">
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="motria-button motria-button-outline"
                >
                  <a href="#en-accion">
                    Ver cómo funciona
                    <span className="motria-button-arrow">
                      <ArrowDown aria-hidden="true" />
                    </span>
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-14 flex flex-wrap items-end justify-between gap-8 md:mt-18">
              <ul
                aria-label="Módulos del taller"
                className="motria-hero-modules flex items-center gap-6 rounded-xl border border-white/15 bg-black/20 px-5 py-4 sm:gap-8 sm:px-7"
              >
                {[
                  { icon: ClipboardList, label: "Órdenes" },
                  { icon: UsersRound, label: "Clientes" },
                  { icon: CarFront, label: "Vehículos" },
                  { icon: Wrench, label: "Técnicos" },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex flex-col items-center gap-2 text-[9px] font-medium tracking-wider text-white/85 sm:text-[10px]"
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-6 stroke-[1.2] sm:size-7"
                    />
                    <span className="uppercase">{label}</span>
                  </li>
                ))}
              </ul>
              <p className="hidden border-l border-white/35 pl-4 text-xs leading-6 text-white/75 lg:block">
                Tu experiencia mueve el taller.
                <br />
                Una buena gestión lo hace avanzar.
              </p>
            </div>
          </section>
        </div>

        <section
          id="como-funciona"
          aria-labelledby="steps-title"
          className="bg-white py-16 md:py-20"
        >
          <div className="motria-container">
            <h2 id="steps-title" className="sr-only">
              De tu primer registro al servicio terminado, en tres pasos
            </h2>
            <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
              {STEPS.map((step) => (
                <li key={step.number}>
                  <Card className="motria-step h-full gap-0 rounded-xl border-0 bg-muted py-0 shadow-none">
                    <CardContent className="px-7 py-7 sm:px-8">
                      <span className="motria-step-number" aria-hidden="true">
                        {step.number}
                      </span>
                      <h3 className="motria-heading mt-6 text-[27px] leading-tight">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="funciones"
          aria-labelledby="features-title"
          className="bg-muted py-18 md:py-24"
        >
          <div className="motria-container">
            <div className="mx-auto mb-11 max-w-xl text-center">
              <h2 id="features-title" className="motria-section-title">
                Todo lo que tu taller
                <br className="sm:hidden" />{" "}
                <span className="text-primary">necesita.</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                De la recepción al último ajuste.
                <br />
                Un lugar para organizar cada parte del trabajo.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FEATURES.map(
                ({ icon: Icon, title, description, image, alt }) => (
                  <Card
                    key={title}
                    className="motria-feature group gap-0 rounded-xl border-0 bg-white py-0 shadow-none"
                  >
                    <div className="relative h-44 overflow-hidden lg:h-48">
                      <Icon
                        aria-hidden="true"
                        className="absolute top-7 left-7 size-8 stroke-[1.2] text-primary/70"
                      />
                      <img
                        src={`/images/${image}`}
                        alt={alt}
                        width={600}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="motria-feature-image absolute top-0 right-0 h-full w-[73%] object-cover"
                      />
                    </div>
                    <CardContent className="flex flex-1 flex-col px-7 pt-6 pb-7">
                      <h3 className="motria-heading text-[28px] leading-tight">
                        {title}
                      </h3>
                      <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
            <div className="mt-9 text-center">
              <a
                href="#en-accion"
                className="motria-text-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
              >
                Mira una orden en acción
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="por-que-motria"
          aria-labelledby="about-title"
          className="bg-white py-20 md:py-26"
        >
          <div className="motria-container grid items-center gap-12 md:grid-cols-2 lg:gap-22">
            <div className="motria-about-photo relative mx-auto w-full max-w-lg pb-7 pl-3 md:pl-0">
              <div className="motria-photo-accent absolute top-6 right-0 bottom-2 left-9 rounded-xl bg-[#f8e4e5]" />
              <img
                src="/images/workshop-team.jpg"
                alt="Técnico revisando un vehículo elevado en el taller"
                width={1100}
                height={733}
                loading="lazy"
                decoding="async"
                className="motria-about-image relative h-105 w-full rounded-xl object-cover sm:h-125"
              />
              <div className="absolute right-6 bottom-0 left-0 flex items-center gap-4 rounded-lg border border-border bg-white px-5 py-5 shadow-lg shadow-black/5 sm:right-16 md:-left-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fcecef] text-primary">
                  <Wrench aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">Tú conoces tu taller.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Motria te ayuda a organizarlo.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 id="about-title" className="motria-section-title">
                Hecho para el taller.
                <br />
                <span className="text-primary">Pensado para tu equipo.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
                Entre vehículos, herramientas y clientes, hay mucho por
                coordinar. Motria reúne la información del trabajo para que cada
                persona sepa por dónde seguir.
              </p>
              <ul className="mt-8 space-y-6">
                {[
                  {
                    icon: LayoutDashboard,
                    title: "La información, en un solo lugar",
                    description:
                      "Consulta clientes, vehículos y órdenes sin cambiar de herramienta.",
                  },
                  {
                    icon: UsersRound,
                    title: "Cada persona conoce su trabajo",
                    description:
                      "Asigna responsables y da a tus técnicos acceso a sus órdenes.",
                  },
                  {
                    icon: MonitorSmartphone,
                    title: "Del escritorio al taller",
                    description:
                      "Accede desde tu navegador, en ordenador, tablet o móvil.",
                  },
                ].map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex items-start gap-4">
                    <Icon
                      aria-hidden="true"
                      className="mt-1 size-7 shrink-0 stroke-[1.4] text-[#72757b]"
                    />
                    <div>
                      <h3 className="motria-heading text-2xl leading-tight">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild className="motria-button mt-8">
                <a href="#en-accion">
                  Conoce el flujo de trabajo
                  <span className="motria-button-arrow">
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="en-accion"
          aria-labelledby="demo-title"
          className="bg-muted py-18 md:py-24"
        >
          <div className="motria-container">
            <div className="mx-auto mb-11 max-w-2xl text-center">
              <h2 id="demo-title" className="motria-section-title">
                Cada servicio avanza.
                <br />
                <span className="text-primary">
                  Tú sabes en qué punto está.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                Explora una orden de ejemplo y descubre cómo se organiza el
                trabajo, desde la recepción hasta el cierre.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-7">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <article className="motria-photo-panel relative isolate flex min-h-64 items-end overflow-hidden rounded-xl bg-[#191b20] p-7 text-white">
                  <img
                    src="/images/workshop-engine.jpg"
                    alt=""
                    width={800}
                    height={533}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-20 size-full object-cover"
                  />
                  <div className="motria-panel-shade absolute inset-0 -z-10" />
                  <div>
                    <h3 className="motria-heading text-[32px] leading-tight">
                      Una recepción más organizada.
                    </h3>
                    <p className="mt-3 max-w-xs text-[13px] leading-6 text-white/85">
                      Cliente, vehículo y diagnóstico conectados desde el primer
                      momento.
                    </p>
                  </div>
                </article>
                <article className="motria-photo-panel relative isolate flex min-h-64 items-end overflow-hidden rounded-xl bg-[#191b20] p-7 text-white">
                  <img
                    src="/images/workshop-service.jpg"
                    alt=""
                    width={1000}
                    height={667}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-20 size-full object-cover"
                  />
                  <div className="motria-panel-shade absolute inset-0 -z-10" />
                  <div>
                    <h3 className="motria-heading text-[32px] leading-tight">
                      Un equipo que sabe qué sigue.
                    </h3>
                    <p className="mt-3 max-w-xs text-[13px] leading-6 text-white/85">
                      Cada orden tiene un responsable. Cada estado cuenta cómo
                      va el trabajo.
                    </p>
                  </div>
                </article>
              </div>
              <OrderDemo />
            </div>
          </div>
        </section>

        <section
          id="preguntas"
          aria-labelledby="faq-title"
          className="bg-white py-18 md:py-24"
        >
          <div className="motria-container grid gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-22">
            <div>
              <h2 id="faq-title" className="motria-section-title">
                Antes de empezar,
                <br />
                <span className="text-primary">resolvamos tus dudas.</span>
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
                Lo esencial para dar el primer paso con Motria.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Check aria-hidden="true" className="size-4 text-primary" />
                Sin instalaciones. Desde tu navegador.
              </span>
            </div>
            <Accordion
              type="single"
              collapsible
              className="border-t border-border"
            >
              {FAQS.map(({ question, answer }, index) => (
                <AccordionItem key={question} value={`question-${index}`}>
                  <AccordionTrigger className="text-[14px] leading-6">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <LandingFooter isLoggedIn={isLoggedIn} />
    </div>
  )
}
