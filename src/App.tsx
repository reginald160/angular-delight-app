import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import VisaDashboard from "./pages/VisaDashboard";
import HousingDashboard from "./pages/HousingDashboard";
import JobsDashboard from "./pages/JobsDashboard";
import DrivingDashboard from "./pages/DrivingDashboard";
import NotFound from "./pages/NotFound";
import AuthGuard from "./contexts/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/dashboard/visa" element={<AuthGuard><VisaDashboard /></AuthGuard>} />
            <Route path="/dashboard/housing" element={<AuthGuard><HousingDashboard /></AuthGuard>} />
            <Route path="/dashboard/jobs" element={<AuthGuard><JobsDashboard /></AuthGuard>} />
            <Route path="/dashboard/driving" element={<AuthGuard><DrivingDashboard /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
