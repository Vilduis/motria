import React, { lazy, Suspense } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { Loader2 } from "lucide-react"
import { DashboardView } from "./components/dashboard-view"
import { Toaster } from "./components/ui/sonner"
import authService from "./services/authService"
import { ThemeProvider } from "./components/theme-provider"
import { SessionGate } from "./components/auth/session-gate"

const LandingPage = lazy(() => import("./pages/landing"))
const LoginPage = lazy(() => import("./pages/login"))
const SignupPage = lazy(() => import("./pages/signup"))
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password"))
const ResetPasswordPage = lazy(() => import("./pages/reset-password"))
const ChangePasswordPage = lazy(() => import("./pages/change-password"))
const NotFoundPage = lazy(() => import("./pages/not-found"))

const DashboardHome = lazy(() => import("./pages/dashboard/home"))
const AccountPage = lazy(() => import("./pages/dashboard/account"))
const PlansPage = lazy(() => import("./pages/dashboard/plans"))
const UsersPage = lazy(() => import("./pages/dashboard/users"))
const TechnicalsPage = lazy(() => import("./pages/dashboard/technicians"))
const CustomersPage = lazy(() => import("./pages/dashboard/customers"))
const VehiclesPage = lazy(() => import("./pages/dashboard/vehicles"))
const ServiceOrdersPage = lazy(() => import("./pages/dashboard/orders"))

const FullScreenFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="size-6 animate-spin text-muted-foreground" />
  </div>
)

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: string[]
}) => {
  const location = useLocation()

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (
    authService.mustChangePassword() &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />
  }

  return (
    <SessionGate>
      <RoleGate roles={roles}>{children}</RoleGate>
    </SessionGate>
  )
}

const RoleGate = ({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: string[]
}) => {
  const currentUser = authService.getCurrentUser()
  if (roles && !roles.some((role) => currentUser.roles.includes(role))) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

const DashboardWrapper = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate("/login", { replace: true })
  }

  return <DashboardView onLogout={handleLogout} />
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Suspense fallback={<FullScreenFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardWrapper />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="technicians"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <TechnicalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <ProtectedRoute roles={["ADMIN", "TECHNICAL"]}>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="vehicles"
                element={
                  <ProtectedRoute roles={["ADMIN", "TECHNICAL"]}>
                    <VehiclesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="orders" element={<ServiceOrdersPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route
                path="plan"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <PlansPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors closeButton />
      </Router>
    </ThemeProvider>
  )
}

export default App
