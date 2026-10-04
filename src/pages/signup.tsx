import { useNavigate } from "react-router-dom"
import { SignupForm } from "@/components/auth/signup-form"
import { MotriaAuthShell } from "@/components/layout/motria-auth-shell"

export default function SignupPage() {
  const navigate = useNavigate()

  const handleSignupSuccess = (mustChangePassword: boolean) => {
    navigate(mustChangePassword ? "/change-password" : "/dashboard", {
      replace: true,
    })
  }

  return (
    <MotriaAuthShell variant="signup">
      <SignupForm onSignupSuccess={handleSignupSuccess} />
    </MotriaAuthShell>
  )
}
