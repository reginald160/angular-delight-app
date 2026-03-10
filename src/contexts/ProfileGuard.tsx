import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

type Props = {
  children?: JSX.Element;
};

export default function ProfileGuard({ children }: Props) {
  const { user, loading, refreshUser } = useAuth();
  const location = useLocation();

  // useEffect(() => {
  //   const loadUserData = async () => {
  //     if (!user) return;
  //     await refreshUser();
  //   };

  //   loadUserData();
  // }, [user, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const redirect = `/auth?redirect=${encodeURIComponent(
    location.pathname + location.search
  )}`;

  if (!user) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  const isCompleteProfilePage = location.pathname === "/completeProfile";
  const isPricePage = location.pathname === "/price";

  if (!user.profileCompleted && !isCompleteProfilePage) {
    return <Navigate to="/completeProfile" replace />;
  }

  if (!user.hasSubscription && !isCompleteProfilePage && !isPricePage) {
    return <Navigate to="/price" replace />;
  }
  
  if (user.hasSubscription && isPricePage) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}