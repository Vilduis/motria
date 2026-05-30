import { useMemo } from "react"
import { cn } from "@/lib/utils"

const STRENGTH_LABELS = [
  "Muy débil",
  "Débil",
  "Aceptable",
  "Fuerte",
  "Excelente",
] as const

const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-status-pending",
  "bg-status-done",
  "bg-status-done",
] as const

function scorePassword(pw: string): number {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

interface PasswordStrengthProps {
  password: string
  id?: string
  className?: string
}

export function PasswordStrength({
  password,
  id,
  className,
}: PasswordStrengthProps) {
  const score = useMemo(() => scorePassword(password), [password])

  if (!password) return null

  return (
    <div className={cn("space-y-1", className)} id={id}>
      <div
        className="flex gap-1"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={score}
        aria-label="Fortaleza de la contraseña"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? STRENGTH_COLORS[score] : "bg-border/70",
            )}
          />
        ))}
      </div>
      <p className="text-[11.5px] text-muted-foreground">
        Fortaleza:{" "}
        <span className="font-medium text-foreground">
          {STRENGTH_LABELS[score]}
        </span>
      </p>
    </div>
  )
}
