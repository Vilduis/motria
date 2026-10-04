import {
  CarFront,
  Check,
  CheckCheck,
  CircleDashed,
  ClipboardList,
  UserRound,
  Wrench,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const STAGES = [
  {
    value: "pending",
    label: "Pendiente",
    icon: CircleDashed,
    title: "Todo listo para comenzar.",
    description:
      "El vehículo y el diagnóstico ya están registrados. La orden tiene un técnico asignado y espera el inicio del trabajo.",
    task: "Recepción y diagnóstico registrados",
    next: "Siguiente paso: iniciar el servicio",
  },
  {
    value: "progress",
    label: "En proceso",
    icon: Wrench,
    title: "El trabajo está en marcha.",
    description:
      "El técnico está trabajando en el vehículo. El estado de la orden permite al administrador consultar el avance del servicio.",
    task: "Revisión del sistema de frenos en curso",
    next: "Siguiente paso: finalizar el servicio",
  },
  {
    value: "done",
    label: "Terminado",
    icon: CheckCheck,
    title: "Un servicio más, terminado.",
    description:
      "El técnico marcó el trabajo como terminado. La orden conserva el diagnóstico, el vehículo y el responsable para su consulta.",
    task: "Servicio finalizado por el técnico",
    next: "La orden queda disponible para consultar",
  },
] as const

export function OrderDemo() {
  return (
    <div className="motria-demo overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
        <span className="flex items-center gap-2 text-sm font-bold">
          <ClipboardList aria-hidden="true" className="size-4 text-primary" />{" "}
          Orden de servicio
        </span>
        <Badge
          variant="outline"
          className="rounded-full border-border bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
        >
          Demo interactiva
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="gap-0">
        <div className="px-5 pt-6 sm:px-7">
          <p
            className="mb-3 text-xs text-muted-foreground"
            id="demo-instructions"
          >
            Selecciona un estado para explorar el flujo:
          </p>
          <TabsList
            aria-label="Estado de la orden de ejemplo"
            aria-describedby="demo-instructions"
            className="motria-demo-tabs grid w-full grid-cols-3 gap-1 rounded-lg bg-muted p-1"
          >
            {STAGES.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="min-h-11 gap-1.5 px-1 text-[11px] sm:text-xs"
              >
                <Icon
                  aria-hidden="true"
                  className="hidden size-3.5 min-[400px]:block"
                />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {STAGES.map((stage, index) => (
          <TabsContent
            key={stage.value}
            value={stage.value}
            className="motria-demo-panel px-5 pt-6 pb-5 sm:px-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  ORDEN DE EJEMPLO
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  #DEMO-001
                </p>
              </div>
              <Badge
                className={`motria-demo-status motria-demo-status-${stage.value} mt-1 rounded-full border-0 px-3 py-1.5 text-[11px]`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {stage.label}
              </Badge>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-border py-4 text-xs">
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <CarFront aria-hidden="true" className="size-3.5" />
                  Vehículo
                </dt>
                <dd className="mt-1.5 font-semibold">Vehículo de ejemplo</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <UserRound aria-hidden="true" className="size-3.5" />
                  Responsable
                </dt>
                <dd className="mt-1.5 font-semibold">Técnico de ejemplo</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Diagnóstico inicial</dt>
                <dd className="mt-1.5 font-semibold">
                  Revisión del sistema de frenos
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <div className="mb-4 flex gap-1.5" aria-hidden="true">
                {STAGES.map((step, stepIndex) => (
                  <span
                    key={step.value}
                    className={`h-1 flex-1 rounded-full ${stepIndex <= index ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <h3 className="text-base font-bold">{stage.title}</h3>
              <p className="mt-2 min-h-18 text-[13px] leading-6 text-muted-foreground">
                {stage.description}
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold">
                <Check
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {stage.task}
              </p>
              <p className="mt-2 pl-6 text-[11px] leading-5 text-muted-foreground">
                {stage.next}
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <p className="border-t border-border bg-muted/60 px-5 py-3 text-center text-[10px] leading-5 text-muted-foreground sm:px-7">
        Datos ilustrativos. Esta demostración no crea ni modifica órdenes
        reales.
      </p>
    </div>
  )
}
