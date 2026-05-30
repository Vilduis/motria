import { useNavigate } from "react-router-dom"
import { Command } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { AuthShell } from "@/components/layout/auth-shell"
import { ProductPreview } from "@/components/brand/product-preview"

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = (mustChangePassword: boolean) => {
    navigate(mustChangePassword ? "/change-password" : "/dashboard", {
      replace: true,
    })
  }

  const aside = (
    <div className="space-y-6">
      <ProductPreview compact />
      <div className="space-y-2 border-t border-border/40 pt-5">
        <p className="text-eyebrow">Hecho para ir rápido</p>
        <div className="flex items-start gap-3">
          <kbd className="mt-0.5 inline-flex h-7 items-center gap-1 rounded-md border border-border/80 bg-card px-2 text-[12px] font-medium text-foreground shadow-card">
            <Command className="size-3" />K
          </kbd>
          <p className="text-body-sm text-muted-foreground">
            Busca, navega y crea desde cualquier página. Tu equipo trabaja sin
            tocar el ratón.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <AuthShell showBrand aside={aside}>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthShell>
  )
}
