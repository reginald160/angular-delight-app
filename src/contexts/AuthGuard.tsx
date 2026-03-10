import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken, isTokenValid } from "@/contexts/auth";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

 if (!user) {
  const redirect = `/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <Navigate
      to={redirect}
      replace
      state={{ from: location }}
    />
  );
}

   return children ? <>{children}</> : <Outlet />;
}
