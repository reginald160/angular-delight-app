import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, isTokenValid } from "@/contexts/auth";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const location = useLocation();

  const token = getAccessToken();
  const ok = isTokenValid(token);

  if (!ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return <Navigate to="/auth?mode=login" replace state={{ from: location }} />;
  }

  return children;
}
