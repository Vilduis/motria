import { Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { useWorkshopPlan, type PlanId } from "@/hooks/use-workshop-plan"
import { cn } from "@/lib/utils"

interface PlanInfo {
  id: PlanId
  name: string
  price: string
  priceNote: string
  summary: string
  features: string[]
}

// Visual only for now: prices and the Pro feature list are placeholders until
// billing exists in the backend.
const PLANS: PlanInfo[] = [
  {
    id: "FREE",
    name: "Free",
    price: "Gratis",
    priceNote: "para siempre",
    summary: "Todo lo necesario para llevar el día a día del taller.",
    features: [
      "Órdenes de servicio",
      "Clientes y vehículos",
      "Técnicos y usuarios",
      "Panel de inicio con el resumen del taller",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "Muy pronto",
    priceNote: "precio por anunciar",
    summary: "Para talleres que crecen y necesitan más capacidad.",
    features: [
      "Todo lo del plan Free",
      "Más técnicos y órdenes",
      "Reportes del taller",
      "Soporte prioritario",
    ],
  },
]

export default function PlansPage() {
  const { plan, loading } = useWorkshopPlan()

  return (
    <PageShell className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Planes"
        description="Compara los planes de Motria y elige el que encaja con tu taller."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {PLANS.map((info) => (
          <PlanColumn
            key={info.id}
            info={info}
            current={!loading && plan === info.id}
            loading={loading}
          />
        ))}
      </div>

      <p className="text-caption text-center">
        El cambio de plan estará disponible muy pronto desde esta página.
      </p>
    </PageShell>
  )
}

function PlanColumn({
  info,
  current,
  loading,
}: {
  info: PlanInfo
  current: boolean
  loading: boolean
}) {
  const isPro = info.id === "PRO"

  return (
    <section
      aria-labelledby={`plan-${info.id}`}
      className={cn(
        "flex flex-col rounded-xl border bg-card shadow-card",
        current ? "border-foreground/30" : "border-border"
      )}
    >
      <header className="space-y-3 border-b border-border p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id={`plan-${info.id}`} className="text-h2 text-foreground">
            {info.name}
          </h2>
          {current && <Badge variant="secondary">Tu plan actual</Badge>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-stat leading-none text-foreground">
            {info.price}
          </span>
          <span className="text-caption">{info.priceNote}</span>
        </div>
        <p className="text-body-sm text-muted-foreground">{info.summary}</p>
      </header>

      <ul className="flex-1 space-y-2.5 p-5">
        {info.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="p-5 pt-0">
        {current || loading ? (
          <Button variant="outline" className="w-full" disabled>
            {loading ? "Cargando…" : "Tu plan actual"}
          </Button>
        ) : isPro ? (
          <Button
            className="w-full"
            onClick={() =>
              toast.info("Muy pronto podrás mejorar tu plan desde aquí.")
            }
          >
            <Sparkles />
            Mejorar a Pro
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Incluido en Pro
          </Button>
        )}
      </div>
    </section>
  )
}
