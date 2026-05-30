import { useNavigate } from "react-router-dom"
import { Zap, ShieldCheck, Users } from "lucide-react"
import { SignupForm } from "@/components/auth/signup-form"
import { AuthShell } from "@/components/layout/auth-shell"
import { ProductPreview } from "@/components/brand/product-preview"

const SIGNUP_HIGHLIGHTS = [
  {
    icon: Zap,
    label: "Configuración en menos de 5 minutos",
  },
  {
    icon: ShieldCheck,
    label: "Tus datos seguros, separados por taller",
  },
  {
    icon: Users,
    label: "Invita a tu equipo en cualquier momento",
  },
]

export default function SignupPage() {
  const navigate = useNavigate()

  const handleSignupSuccess = (mustChangePassword: boolean) => {
    navigate(mustChangePassword ? "/change-password" : "/dashboard", {
      replace: true,
    })
  }

  const aside = (
    <div className="space-y-6">
      <ProductPreview compact />
      <div className="space-y-3 border-t border-border/40 pt-5">
        <p className="text-eyebrow">Lo que obtienes</p>
        <ul className="space-y-2.5">
          {SIGNUP_HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-body-sm text-muted-foreground"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-border/70 bg-secondary/40">
                <Icon className="size-3 text-muted-foreground/85" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <AuthShell showBrand aside={aside}>
      <SignupForm onSignupSuccess={handleSignupSuccess} />
    </AuthShell>
  )
}
