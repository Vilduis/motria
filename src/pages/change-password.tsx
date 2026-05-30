import { useNavigate } from "react-router-dom"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import { AuthShell } from "@/components/layout/auth-shell"

export default function ChangePasswordPage() {
  const navigate = useNavigate()

  const handleChangeSuccess = () => {
    navigate("/dashboard", { replace: true })
  }

  return (
    <AuthShell maxWidth="max-w-sm" showBrand>
      <ChangePasswordForm onChangeSuccess={handleChangeSuccess} />
    </AuthShell>
  )
}
