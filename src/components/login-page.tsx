import { useNavigate } from "react-router-dom";
import { LoginForm } from "./login-form";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
