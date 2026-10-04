import { useNavigate } from "react-router-dom"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import { MotriaAuthShell } from "@/components/layout/motria-auth-shell"

export default function ChangePasswordPage() {
  const navigate = useNavigate()

  const handleChangeSuccess = () => {
    navigate("/dashboard", { replace: true })
  }

  return (
    <MotriaAuthShell variant="change-password">
      <ChangePasswordForm onChangeSuccess={handleChangeSuccess} />
    </MotriaAuthShell>
  )
}
