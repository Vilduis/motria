import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import authService from "@/services/authService"

const VERIFIED_KEY = "sessionVerified"

interface SessionGateProps {
  children: React.ReactNode
}

/**
 * Verifica la sesión contra GET /auth/me en el primer render protegido del
 * tab. Sincroniza authorities/workshopName/mustChangePassword desde el server
 * para que cambios de admin no queden bloqueados por localStorage stale.
 * Solo verifica una vez por sesión del tab (sessionStorage).
 */
export function SessionGate({ children }: SessionGateProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const alreadyVerified = sessionStorage.getItem(VERIFIED_KEY) === "true"
  const [verifying, setVerifying] = useState(!alreadyVerified)

  useEffect(() => {
    if (alreadyVerified) return

    let cancelled = false
    ;(async () => {
      try {
        const me = await authService.me()
        if (cancelled) return
        sessionStorage.setItem(VERIFIED_KEY, "true")
        if (me.mustChangePassword && location.pathname !== "/change-password") {
          navigate("/change-password", { replace: true })
          return
        }
        setVerifying(false)
      } catch (error: unknown) {
        if (cancelled) return
        // 401 ya redirige automáticamente vía api.ts.
        // 404 = cuenta deshabilitada → forzar logout.
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("Tu cuenta ha sido deshabilitada. Contacta al admin.")
          authService.logout()
          sessionStorage.removeItem(VERIFIED_KEY)
          navigate("/login", { replace: true })
          return
        }
        // Cualquier otro error: dejamos pasar para no bloquear al usuario
        // si el endpoint /me cae transitoriamente.
        setVerifying(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [alreadyVerified, navigate, location.pathname])

  if (verifying) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Verificando sesión…
        </div>
      </div>
    )
  }

  return <>{children}</>
}
