import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  clearSession,
  getAccessToken,
  getCurrentUser,
  saveAccessToken
} from "@/storage/authStorage";

import { AuthUser } from "@/types/auth";

import { authenticateWithBiometrics } from "@/services/biometrics";

import { isBiometricsEnabled } from "@/services/biometrics/storage";

import { DEV_SESSION } from "@/config/dev-session.local";

interface AuthContextValue {
  isAuthenticated: boolean;

  isLoading: boolean;

  user: AuthUser | null;

  /**
   * Authenticate the current user.
   */
  login: (user: AuthUser) => Promise<void>;

  /**
   * Reload the stored user.
   */
  refreshUser: () => Promise<void>;

  /**
   * Logout the current user.
   */
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
      /**
       * -----------------------------------------------------------------------
       * Development API Session
       * -----------------------------------------------------------------------
       *
       * The backend team has supplied a temporary JWT for API integration
       * testing while the StoreFront login credentials are unavailable.
       *
       * This token is stored locally and is never committed to Git.
       */
      if (__DEV__ && DEV_SESSION.accessToken) {
        await saveAccessToken(DEV_SESSION.accessToken);
      }

      const token = await getAccessToken();

      if (!token) {
        return;
      }

      const biometricsEnabled = await isBiometricsEnabled();

      if (biometricsEnabled) {
        const result = await authenticateWithBiometrics();

        if (!result.success) {
          await clearSession();

          return;
        }
      }

      const storedUser = await getCurrentUser<AuthUser>();

      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(user: AuthUser) {
    setUser(user);
  }

  async function refreshUser() {
    const storedUser = await getCurrentUser<AuthUser>();

    setUser(storedUser);
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

      login,

      refreshUser,

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
