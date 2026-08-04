import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  clearSession,
  getAccessToken,
  getCurrentUser,
} from "@/storage/authStorage";

import { AuthUser } from "@/types/auth";

interface AuthContextValue {
  isAuthenticated: boolean;

  isLoading: boolean;

  user: AuthUser | null;

  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const token = await getAccessToken();

      if (!token) {
        return;
      }

      const storedUser = await getCurrentUser<AuthUser>();

      if (storedUser) {
        setUser(storedUser);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await clearSession();
    } finally {
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,

      isLoading,

      isAuthenticated: user !== null,

      setUser,

      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
