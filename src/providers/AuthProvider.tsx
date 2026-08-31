import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  clearSession,
  getAccessToken,
  getCurrentUser,
  saveAccessToken,
  saveCurrentUser,
} from "@/storage/authStorage";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

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

  /**
   * =========================================================================
   * BOOTSTRAP
   * =========================================================================
   *
   * Restores the authenticated session when the application starts.
   *
   * The local SecureStore session contains:
   *
   * - access token
   * - refresh token
   * - authenticated user
   *
   * We intentionally do not call FetchStorefrontUser here.
   *
   * The backend currently returns 401 for the development JWT on that
   * endpoint. The locally persisted AuthUser is already available from the
   * successful login response, so it can safely be used to restore the
   * application session.
   */
  async function bootstrap() {
    try {
      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("BOOTSTRAP START");
      console.log("=================================");

      /**
       * -----------------------------------------------------------------------
       * Read existing access token
       * -----------------------------------------------------------------------
       */
      let token = await getAccessToken();

      console.log("AUTH STORAGE → GET ACCESS TOKEN:", !!token);

      /**
       * -----------------------------------------------------------------------
       * Development API Session
       * -----------------------------------------------------------------------
       *
       * Only inject the development JWT when:
       *
       * 1. The app is running in development.
       * 2. There is no existing access token.
       * 3. A development token has been configured.
       *
       * This prevents the development token from overwriting a real session
       * that has already been saved after login.
       */
      if (__DEV__ && DEV_SESSION.accessToken) {
        console.log("=================================");
        console.log("AUTH PROVIDER");
        console.log("DEV SESSION → RESTORING SESSION");
        console.log("=================================");

        await saveAccessToken(DEV_SESSION.accessToken);

        await saveCurrentUser(DEV_SESSION.user);

        console.log("DEV SESSION → ACCESS TOKEN SAVED");
        console.log("DEV SESSION → USER SAVED");
      }

      /**
       * -----------------------------------------------------------------------
       * Verify access token
       * -----------------------------------------------------------------------
       */
      token = await getAccessToken();

      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("BOOTSTRAP → ACCESS TOKEN");
      console.log("HAS TOKEN:", !!token);
      console.log("=================================");

      if (!token) {
        console.log("=================================");
        console.log("AUTH PROVIDER");
        console.log("BOOTSTRAP → NO ACCESS TOKEN");
        console.log("=================================");

        return;
      }

      /**
       * -----------------------------------------------------------------------
       * Check biometric protection
       * -----------------------------------------------------------------------
       *
       * If the user has enabled biometrics, require biometric authentication
       * before restoring the application session.
       */
      const biometricsEnabled = await isBiometricsEnabled();

      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("BIOMETRICS ENABLED:", biometricsEnabled);
      console.log("=================================");

      if (biometricsEnabled) {
        console.log("=================================");
        console.log("AUTH PROVIDER");
        console.log("BOOTSTRAP → AUTHENTICATING BIOMETRICS");
        console.log("=================================");

        const result = await authenticateWithBiometrics();

        if (!result.success) {
          console.log("=================================");
          console.log("AUTH PROVIDER");
          console.log("BOOTSTRAP → BIOMETRIC AUTH FAILED");
          console.log("MESSAGE:", result.message);
          console.log("=================================");

          // Do NOT clear the authentication session here.
          setIsLoading(false);

          return;
        }
      }

      /**
       * -----------------------------------------------------------------------
       * Restore stored user
       * -----------------------------------------------------------------------
       *
       * The user was persisted when the login completed:
       *
       * await saveCurrentUser(session.user)
       *
       * Therefore there is no need to make a network request here.
       */
      const storedUser = await getCurrentUser<AuthUser>();

      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("BOOTSTRAP → STORED USER");
      console.log("HAS USER:", !!storedUser);
      console.log("=================================");

      if (!storedUser) {
        console.log("=================================");
        console.log("AUTH PROVIDER");
        console.log("BOOTSTRAP → NO STORED USER");
        console.log("=================================");

        /**
         * We have an access token but no user.
         *
         * This means the locally persisted authentication session is
         * incomplete, so don't mark the user as authenticated.
         */
        setUser(null);

        return;
      }

      /**
       * -----------------------------------------------------------------------
       * Restore authenticated user
       * -----------------------------------------------------------------------
       */
      setUser(storedUser);

      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("BOOTSTRAP → USER RESTORED");
      console.log("EMAIL:", storedUser.email);
      console.log("MERCHANT ID:", storedUser.merchantDetails?.merchantId);
      console.log("=================================");
    } catch (error) {
      console.error("=================================");
      console.error("AUTH PROVIDER → BOOTSTRAP FAILED");
      console.error(error);
      console.error("=================================");

      setUser(null);
    } finally {
      setIsLoading(false);

      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("BOOTSTRAP COMPLETE");
      console.log("=================================");
    }
  }

  /**
   * =========================================================================
   * LOGIN
   * =========================================================================
   */
  async function login(user: AuthUser) {
    setUser(user);
  }

  /**
   * =========================================================================
   * REFRESH USER
   * =========================================================================
   *
   * Reloads the locally persisted authenticated user.
   *
   * This does not make a network request.
   */
  async function refreshUser() {
    const storedUser = await getCurrentUser<AuthUser>();

    setUser(storedUser);
  }

  /**
   * =========================================================================
   * LOGOUT
   * =========================================================================
   */
  async function logout() {
    try {
      /**
       * -----------------------------------------------------------------------
       * Clear onboarding state
       * -----------------------------------------------------------------------
       *
       * Onboarding data belongs to the currently authenticated merchant.
       *
       * Clear it before ending the session so another merchant cannot inherit
       * the previous merchant's onboarding state.
       */
      useOnboardingStore.getState().reset();

      /**
       * -----------------------------------------------------------------------
       * Clear authentication session
       * -----------------------------------------------------------------------
       */
      console.log("=================================");
      console.log("AUTH PROVIDER");
      console.log("LOGOUT");
      console.log("=================================");

      await clearSession();
    } finally {
      setUser(null);
    }
  }

  /**
   * =========================================================================
   * CONTEXT VALUE
   * =========================================================================
   */
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

/**
 * ===========================================================================
 * USE AUTH
 * ===========================================================================
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
