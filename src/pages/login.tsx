import { useNavigate } from "react-router-dom"
import { LoginForm } from "@/components/auth/login-form"
import { MotriaAuthShell } from "@/components/layout/motria-auth-shell"

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = (mustChangePassword: boolean) => {
    navigate(mustChangePassword ? "/change-password" : "/dashboard", {
      replace: true,
    })
  }

  return (
    <MotriaAuthShell variant="login">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </MotriaAuthShell>
  )
}
