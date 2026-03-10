import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';

type Props = {
  children?: JSX.Element;
};

export default function SubscriptionGuard({ children }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { subscriptions, fetchUserSubscription } = useSubscription();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
  }, [user, fetchUserSubscription]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace state={{ from: location }} />;
  }

  if (!subscriptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user.hasSubscription === true) {
    return <Navigate to="/price" replace />;
  }

  return children ? children : <Outlet />;
}