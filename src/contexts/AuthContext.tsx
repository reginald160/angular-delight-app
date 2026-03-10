import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi, LoginUser } from "@/services/AuthService";

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
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<LoginUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async (email?: string) => {
    try {
      const userEmail = email || sessionStorage.getItem("email") || "";

      if (!userEmail) {
        setUser(null);
        sessionStorage.removeItem("authUser");
        return;
      }

      const { data, error } = await authApi.getCurrentUser(userEmail);

      if (error || !data) {
        setUser(null);
        sessionStorage.removeItem("authUser");
        return;
      }

      setUser(data);
      sessionStorage.setItem("authUser", JSON.stringify(data));
    } catch {
      setUser(null);
      sessionStorage.removeItem("authUser");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await loadCurrentUser();
  }, [loadCurrentUser]);

  const updateUser = useCallback((updates: Partial<LoginUser>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = { ...prev, ...updates };
      sessionStorage.setItem("authUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const cachedUser = sessionStorage.getItem("authUser");

        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        if (!token) {
          setLoading(false);
          return;
        }

        await loadCurrentUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [loadCurrentUser]);

  const signUp: AuthContextType["signUp"] = async (
    email,
    password,
    firstName,
    lastName
  ) => {
    const { error } = await authApi.register(
      email,
      password,
      firstName,
      lastName
    );

    if (error) {
      return { error: new Error(error.message ?? String(error)) };
    }

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

    await loadCurrentUser(email);

    return { error: null };
  };

  const signOut: AuthContextType["signOut"] = async () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("email");
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
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};