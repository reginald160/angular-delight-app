import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, AuthUser, LoginUser } from "@/services/AuthService";

interface AuthContextType {
  user: LoginUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async (email: string) => {
    try {
      const { data, error } = await authApi.getCurrentUser(email); // GET /users/me
      if (error || !data) {
        setUser(null);
        return;
      }
      setUser(data);
      sessionStorage.setItem("authUser", JSON.stringify(data));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    // run once on app mount
    (async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      await loadCurrentUser(sessionStorage.getItem("email") || "");
      setLoading(false);
       const cached = sessionStorage.getItem("authUser");
      if (cached) setUser(JSON.parse(cached));
    })();
  }, []);

  const signUp: AuthContextType["signUp"] = async (
    email,
    password,
    firstName,
    lastName
  ) => {
    const { error } = await authApi.register(email, password, firstName, lastName);
    if (error) return { error: new Error(error.message ?? String(error)) };

    // Signup doesn't log in by default; user should verify email then login
    return { error: null };
  };

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const { data, error } = await authApi.login(email, password);

    if (error || !data?.accessToken) {
      return { error: new Error(error?.message ?? "Login failed") };
    }

    sessionStorage.setItem("accessToken", data.accessToken);
    sessionStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("email", email);

    // IMPORTANT: hydrate user immediately so ProtectedRoute passes
    await loadCurrentUser(email);

    return { error: null };
  };

  const signOut: AuthContextType["signOut"] = async () => {
    // optional: call backend logout if you have it
    // await authApi.logout(sessionStorage.getItem("refreshToken") ?? "");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
