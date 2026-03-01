import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import PlansPage from "./pages/PlansPage";
import DepositsPage from "./pages/DepositsPage";
import WithdrawalsPage from "./pages/WithdrawalsPage";
import GatewaysPage from "./pages/GatewaysPage";
import ReferralsPage from "./pages/ReferralsPage";
import RanksPage from "./pages/RanksPage";
import SettingsPage from "./pages/SettingsPage";
import SeoPage from "./pages/SeoPage";
import SecurityPage from "./pages/SecurityPage";
import LoginPage from "./pages/LoginPage";
import InstructionsPage from "./pages/InstructionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppContent() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/investments" element={<Dashboard />} />
            <Route path="/deposits" element={<DepositsPage />} />
            <Route path="/gateways" element={<GatewaysPage />} />
            <Route path="/withdrawals" element={<WithdrawalsPage />} />
            <Route path="/withdraw-methods" element={<WithdrawalsPage />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/ranks" element={<RanksPage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/seo" element={<SeoPage />} />
            <Route path="/security" element={<SecurityPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
