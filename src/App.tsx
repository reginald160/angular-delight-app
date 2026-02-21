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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminChats from "./pages/admin/AdminChats";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminApplications from "./pages/admin/AdminApplications";
import MyInterviews from "./pages/MyInterviews";
import MyApplications from "./pages/MyApplications";
import EmailConfirmation from "./pages/EmailConfirmation";
import SignupSuccess from "./pages/SignupSuccess";
import VerifyOtp from "./pages/VerifyOtp";
import CompleteProfile from "./pages/CompleteProfile";
import { PricingSection } from "./pages/PricingSection";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

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
               <Route path="/Confirm" element={<EmailConfirmation />} />
             <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/dashboard/visa" element={<AuthGuard><VisaDashboard /></AuthGuard>} />
            <Route path="/dashboard/housing" element={<AuthGuard><HousingDashboard /></AuthGuard>} />
            <Route path="/dashboard/jobs" element={<AuthGuard><JobsDashboard /></AuthGuard>} />
            <Route path="/dashboard/driving" element={<AuthGuard><DrivingDashboard /></AuthGuard>} />
            <Route path="/price" element={<AuthGuard><PricingSection /></AuthGuard>} />
            <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
            <Route path="/admin/jobs" element={<AuthGuard><AdminJobs /></AuthGuard>} />
            <Route path="/admin/users" element={<AuthGuard><AdminUsers /></AuthGuard>} />
            <Route path="/admin/user-details" element={<AuthGuard><AdminUserDetails /></AuthGuard>} />
            <Route path="/admin/notifications" element={<AuthGuard><AdminNotifications /></AuthGuard>} />
            <Route path="/admin/chats" element={<AuthGuard><AdminChats /></AuthGuard>} />
            <Route path="/admin/interviews" element={<AuthGuard><AdminInterviews /></AuthGuard>} />
            <Route path="/admin/applications" element={<AuthGuard><AdminApplications /></AuthGuard>} />
            <Route path="/dashboard/my-interviews" element={<AuthGuard><MyInterviews /></AuthGuard>} />
            <Route path="/dashboard/my-applications" element={<AuthGuard><MyApplications /></AuthGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
