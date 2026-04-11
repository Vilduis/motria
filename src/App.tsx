import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { DashboardView } from "./components/dashboard-view";
import { DashboardHome } from "./components/dashboard-home";
import { UsersPage } from "./components/users-page";
import { TechnicalsPage } from "./components/technicals-page";
import { CustomersPage } from "./components/customers-page";
import { VehiclesPage } from "./components/vehicles-page";
import { ServiceOrdersPage } from "./components/service-orders-page";
import { LoginPage } from "./components/login-page";
import { AccountPage } from "./components/account-page";
import { Toaster } from "./components/ui/sonner";
import authService from "./services/authService";

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const currentUser = authService.getCurrentUser();
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some(role => currentUser.roles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Componente para manejar la lógica de logout y proveer el layout
const DashboardWrapper = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return <DashboardView onLogout={handleLogout} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
              <ProtectedRoute roles={["ADMIN"]}>
                <CustomersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="vehicles" 
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <VehiclesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="orders" element={<ServiceOrdersPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
