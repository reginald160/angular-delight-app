import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, AuthUser } from '@/services/authApi';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data, error } = await authApi.getCurrentUser();
      if (!error && data) {
        setUser(data);
      }
      setLoading(false);
    };
    
    checkSession();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { data, error } = await authApi.register(email, password, firstName, lastName);
    
    if (error) {
      return { error: new Error(error.message) };
    }
    
    if (data?.user) {
      setUser(data.user);
    }
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authApi.login(email, password);
    
    if (error) {
      return { error: new Error(error.message) };
    }
    
    if (data?.user) {
      setUser(data.user);
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
