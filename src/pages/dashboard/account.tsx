import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import authService from "@/services/authService"
import workshopService from "@/services/workshopService"
import { toast } from "sonner"
import {
  Shield,
  Lock,
  Loader2,
  Building2,
  Mail,
  Sparkles,
  Phone,
  MapPin,
} from "lucide-react"
import { getErrorMessage } from "@/lib/errorHandler"
import { isValidPhone, normalizePhone, PHONE_ERROR } from "@/lib/validation"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import type { Workshop } from "@/types"

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  TECHNICAL: "Técnico",
}

/** Subtle staggered reveal, consistent with StatCard's entrance. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AccountPage() {
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser.roles.includes("ADMIN")
  const workshopId = currentUser.workshopId
  const canManageWorkshop = isAdmin && !!workshopId

  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loadingWorkshop, setLoadingWorkshop] = useState(canManageWorkshop)

  useEffect(() => {
    if (!canManageWorkshop || !workshopId) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await workshopService.getById(workshopId)
        if (!cancelled) setWorkshop(data)
      } catch (error: unknown) {
        if (!cancelled)
          toast.error(getErrorMessage(error, "No se pudo cargar el taller"))
      } finally {
        if (!cancelled) setLoadingWorkshop(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [canManageWorkshop, workshopId])

  const initials = (currentUser.displayName || currentUser.email)
    .substring(0, 2)
    .toUpperCase()
  const roleLabel = ROLE_LABEL[currentUser.roles[0]] || "Usuario"

  return (
    <PageShell className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Mi Cuenta"
        description="Gestiona tu perfil y la configuración de tu taller."
      />

      <Reveal>
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:gap-5">
          <Avatar className="size-13 rounded-xl">
            <AvatarFallback className="rounded-xl bg-brand-subtle text-base font-semibold text-brand">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-h2 truncate text-foreground">
              {currentUser.displayName || roleLabel}
            </h2>
            <p className="text-body-sm mt-0.5 truncate text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Badge className="gap-1 border-brand/25 bg-brand-subtle text-brand">
              <Shield />
              {roleLabel}
            </Badge>
            {currentUser.workshopName && (
              <Badge variant="secondary" className="gap-1">
                <Building2 />
                {currentUser.workshopName}
              </Badge>
            )}
          </div>
        </section>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal delay={0.05} className="flex min-w-0 flex-col gap-5">
          {canManageWorkshop ? (
            <WorkshopSettingsCard
              workshopId={workshopId}
              workshop={workshop}
              setWorkshop={setWorkshop}
              loading={loadingWorkshop}
            />
          ) : (
            <AccountDetailsCard
              email={currentUser.email}
              roleLabel={roleLabel}
              workshopName={currentUser.workshopName}
            />
          )}
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-5">
          {canManageWorkshop && (
            <PlanCard plan={workshop?.plan} loading={loadingWorkshop} />
          )}
          <SecurityCard />
        </Reveal>
      </div>
    </PageShell>
  )
}

/* ── Account details (read-only, non-admin fallback) ────────────────────── */

function AccountDetailsCard({
  email,
  roleLabel,
  workshopName,
}: {
  email: string
  roleLabel: string
  workshopName?: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <header className="border-b border-border px-5 py-4">
        <h3 className="text-h3 text-foreground">Información del perfil</h3>
        <p className="text-caption mt-0.5">
          Detalles básicos de tu cuenta en el sistema.
        </p>
      </header>
      <dl className="divide-y divide-border/50">
        <DetailRow icon={<Mail />} label="Correo electrónico" value={email} />
        <DetailRow
          icon={<Shield />}
          label="Rol del sistema"
          value={roleLabel}
        />
        {workshopName && (
          <DetailRow icon={<Building2 />} label="Taller" value={workshopName} />
        )}
      </dl>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
      {icon}
      <div className="min-w-0">
        <dt className="text-eyebrow">{label}</dt>
        <dd className="mt-1 truncate font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

/* ── Plan card ──────────────────────────────────────────────────────────── */

function PlanCard({ plan, loading }: { plan?: string; loading: boolean }) {
  const planName = (plan || "FREE").toUpperCase()
  const isFree = planName === "FREE"

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-4">
        <p className="text-eyebrow">Plan actual</p>
        <div className="mt-2 flex items-baseline gap-2">
          {loading ? (
            <span className="inline-block h-7 w-20 animate-pulse rounded-md bg-muted" />
          ) : (
            <>
              <span className="text-h1 leading-none text-foreground">
                {planName}
              </span>
              {isFree && <span className="text-caption">para siempre</span>}
            </>
          )}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-caption">
          {isFree
            ? "Estás en el plan gratuito. Mejora para desbloquear más técnicos, órdenes y reportes."
            : "Tu taller tiene acceso a todas las funciones premium."}
        </p>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/dashboard/plan">
            {isFree && <Sparkles />}
            {isFree ? "Mejorar plan" : "Ver planes"}
          </Link>
        </Button>
      </div>
    </div>
  )
}

/* ── Security ───────────────────────────────────────────────────────────── */

function SecurityCard() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const update =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (formData.newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }
    if (formData.newPassword === formData.currentPassword) {
      toast.error("La nueva contraseña debe ser diferente a la actual")
      return
    }
    setLoading(true)
    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      toast.success("Contraseña actualizada correctamente")
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error al actualizar la contraseña"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-muted-foreground" />
          <h3 className="text-h3 text-foreground">Seguridad</h3>
        </div>
        <p className="text-caption mt-0.5">Cambia tu contraseña de acceso.</p>
      </header>
      <form onSubmit={handleUpdatePassword} className="space-y-4 p-5">
        <div className="space-y-1.5">
          <Label htmlFor="current-password">Contraseña actual</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            value={formData.currentPassword}
            onChange={update("currentPassword")}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">Nueva contraseña</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Mín. 8 caracteres"
            value={formData.newPassword}
            onChange={update("newPassword")}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={update("confirmPassword")}
            required
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Actualizando...
            </span>
          ) : (
            "Actualizar contraseña"
          )}
        </Button>
      </form>
    </div>
  )
}

/* ── Workshop settings (admin) ──────────────────────────────────────────── */

function WorkshopSettingsCard({
  workshopId,
  workshop,
  setWorkshop,
  loading,
}: {
  workshopId: number
  workshop: Workshop | null
  setWorkshop: (w: Workshop) => void
  loading: boolean
}) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    workshopName: "",
    ownerName: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (!workshop) return
    setForm({
      workshopName: workshop.workshopName ?? "",
      ownerName: workshop.ownerName ?? "",
      phone: workshop.phone ?? "",
      address: workshop.address ?? "",
    })
  }, [workshop])

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const dirty =
    !!workshop &&
    (form.workshopName.trim() !== (workshop.workshopName ?? "") ||
      form.ownerName.trim() !== (workshop.ownerName ?? "") ||
      form.phone.trim() !== (workshop.phone ?? "") ||
      form.address.trim() !== (workshop.address ?? ""))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.workshopName.trim() || !form.ownerName.trim()) {
      toast.error("Nombre del taller y propietario son obligatorios")
      return
    }
    if (form.phone.trim() && !isValidPhone(form.phone)) {
      toast.error(PHONE_ERROR)
      return
    }
    setSaving(true)
    try {
      const updated = await workshopService.update(workshopId, {
        workshopName: form.workshopName.trim(),
        ownerName: form.ownerName.trim(),
        phone: normalizePhone(form.phone) || undefined,
        address: form.address.trim() || undefined,
      })
      setWorkshop(updated)
      localStorage.setItem("workshopName", updated.workshopName)
      toast.success("Información del taller actualizada")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "No se pudo actualizar el taller"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-muted-foreground" />
          <h3 className="text-h3 text-foreground">Información del taller</h3>
        </div>
        <p className="text-caption mt-0.5">
          Datos visibles en facturas y comunicaciones del taller.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 px-5 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ws-name">Nombre del taller</Label>
              <Input
                id="ws-name"
                type="text"
                value={form.workshopName}
                onChange={update("workshopName")}
                required
                disabled={saving}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ws-owner">Propietario</Label>
              <Input
                id="ws-owner"
                type="text"
                value={form.ownerName}
                onChange={update("ownerName")}
                required
                disabled={saving}
              />
            </div>
          </div>

          {workshop?.email && (
            <div className="space-y-1.5">
              <Label htmlFor="ws-email" className="text-muted-foreground">
                Correo del taller
              </Label>
              <Input
                id="ws-email"
                value={workshop.email}
                disabled
                className="text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground">
                Para cambiar el correo, contacta a soporte.
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="ws-phone"
                className="flex items-center gap-1.5 text-muted-foreground"
              >
                <Phone className="size-3.5" />
                Teléfono
                <span className="text-[11px] font-normal text-muted-foreground">
                  opcional
                </span>
              </Label>
              <Input
                id="ws-phone"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="999 999 999"
                value={form.phone}
                onChange={update("phone")}
                disabled={saving}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="ws-address"
                className="flex items-center gap-1.5 text-muted-foreground"
              >
                <MapPin className="size-3.5" />
                Dirección
                <span className="text-[11px] font-normal text-muted-foreground">
                  opcional
                </span>
              </Label>
              <Input
                id="ws-address"
                type="text"
                placeholder="Av. Principal 123"
                value={form.address}
                onChange={update("address")}
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
            {dirty && (
              <span className="text-caption">Tienes cambios sin guardar</span>
            )}
            <Button type="submit" disabled={saving || !dirty}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Guardando...
                </span>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
