import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, AuthUser } from "@/services/AuthService";

interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    try {
      const { data, error } = await authApi.getCurrentUser(); // GET /users/me
      if (error || !data) {
        setUser(null);
        return;
      }
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    // run once on app mount
    (async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      await loadCurrentUser();
      setLoading(false);
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

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // IMPORTANT: hydrate user immediately so ProtectedRoute passes
    await loadCurrentUser();

    return { error: null };
  };

  const signOut: AuthContextType["signOut"] = async () => {
    // optional: call backend logout if you have it
    // await authApi.logout(localStorage.getItem("refreshToken") ?? "");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
