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

import { DEV_SESSION, DEV_SESSION_ENABLED } from "@/config/dev-session.local";

/**
 * ============================================================================
 * AUTH CONTEXT
 * ============================================================================
 */

interface AuthContextValue {
  /**
   * Whether an authenticated user is currently available.
   */
  isAuthenticated: boolean;

  /**
   * Whether the initial SecureStore session check
   * is still running.
   */
  isLoading: boolean;

  /**
   * Whether a previously authenticated session exists locally.
   *
   * This does NOT mean the user is currently authenticated.
   */
  hasStoredSession: boolean;

  /**
   * Current authenticated user.
   */
  user: AuthUser | null;

  /**
   * Authenticate the current user in application state.
   */
  login: (user: AuthUser) => Promise<void>;

  /**
   * Reload the locally persisted authenticated user.
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

/**
 * ============================================================================
 * AUTH PROVIDER
 * ============================================================================
 */

export function AuthProvider({ children }: Props) {
  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Indicates that a valid session exists in SecureStore.
   *
   * The session is intentionally NOT restored into
   * authenticated React state automatically.
   */
  const [hasStoredSession, setHasStoredSession] = useState(false);

  /**
   * ==========================================================================
   * INITIAL BOOTSTRAP
   * ==========================================================================
   */

  useEffect(() => {
    void bootstrap();
  }, []);

  /**
   * ==========================================================================
   * BOOTSTRAP
   * ==========================================================================
   *
   * Checks whether a session exists locally.
   *
   * IMPORTANT:
   *
   * A stored token does NOT automatically authenticate
   * the user into the application.
   *
   * This allows biometric authentication to act as the
   * unlock mechanism for an existing session.
   */

  async function bootstrap() {
    try {
      console.log("=================================");

      console.log("AUTH PROVIDER");

      console.log("BOOTSTRAP START");

      console.log("=================================");

      /**
       * ----------------------------------------------------------------------
       * GET EXISTING ACCESS TOKEN
       * ----------------------------------------------------------------------
       */

      let token = await getAccessToken();

      console.log("AUTH PROVIDER → ACCESS TOKEN EXISTS:", !!token);

      /**
       * ----------------------------------------------------------------------
       * DEVELOPMENT SESSION
       * ----------------------------------------------------------------------
       */

      if (__DEV__ && DEV_SESSION_ENABLED && !token && DEV_SESSION.accessToken) {
        console.log("=================================");

        console.log("AUTH PROVIDER");

        console.log("DEV SESSION → RESTORING SESSION");

        console.log("=================================");

        /**
         * Save development access token.
         */

        await saveAccessToken(DEV_SESSION.accessToken);

        /**
         * Save development user.
         */

        await saveCurrentUser(DEV_SESSION.user);

        /**
         * Reload token.
         */

        token = await getAccessToken();

        console.log("AUTH PROVIDER → DEV SESSION RESTORED:", !!token);
      }

      /**
       * ----------------------------------------------------------------------
       * NO ACCESS TOKEN
       * ----------------------------------------------------------------------
       */

      if (!token) {
        console.log("=================================");

        console.log("AUTH PROVIDER");

        console.log("BOOTSTRAP → NO ACCESS TOKEN");

        console.log("=================================");

        setUser(null);

        setHasStoredSession(false);

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * RESTORE STORED USER
       * ----------------------------------------------------------------------
       */

      const storedUser = await getCurrentUser<AuthUser>();

      console.log("AUTH PROVIDER → STORED USER EXISTS:", !!storedUser);

      /**
       * ----------------------------------------------------------------------
       * INCOMPLETE SESSION
       * ----------------------------------------------------------------------
       */

      if (!storedUser) {
        console.log("=================================");

        console.log("AUTH PROVIDER");

        console.log("BOOTSTRAP → TOKEN EXISTS BUT USER IS MISSING");

        console.log("=================================");

        await clearSession("INCOMPLETE_SESSION");

        setUser(null);

        setHasStoredSession(false);

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * STORED SESSION FOUND
       * ----------------------------------------------------------------------
       *
       * IMPORTANT:
       *
       * Do NOT automatically call:
       *
       * setUser(storedUser);
       *
       * The stored session must be explicitly unlocked by:
       *
       * - Biometric authentication
       * - Normal email/password login
       */

      setHasStoredSession(true);

      setUser(null);

      console.log("=================================");

      console.log("AUTH PROVIDER");

      console.log("BOOTSTRAP → STORED SESSION FOUND");

      console.log("AUTHENTICATION → LOCKED");

      console.log("=================================");
    } catch (error) {
      /**
       * ----------------------------------------------------------------------
       * BOOTSTRAP FAILURE
       * ----------------------------------------------------------------------
       */

      console.error("=================================");

      console.error("AUTH PROVIDER → BOOTSTRAP FAILED");

      console.error(error);

      console.error("=================================");

      setUser(null);

      setHasStoredSession(false);
    } finally {
      /**
       * ----------------------------------------------------------------------
       * BOOTSTRAP COMPLETE
       * ----------------------------------------------------------------------
       */

      setIsLoading(false);

      console.log("=================================");

      console.log("AUTH PROVIDER");

      console.log("BOOTSTRAP COMPLETE");

      console.log("=================================");
    }
  }

  /**
   * ==========================================================================
   * LOGIN
   * ==========================================================================
   */

  async function login(authenticatedUser: AuthUser) {
    console.log("=================================");

    console.log("AUTH PROVIDER");

    console.log("LOGIN");

    console.log("EMAIL:", authenticatedUser.email);

    console.log("=================================");

    /**
     * Unlock authenticated application state.
     */

    setUser(authenticatedUser);

    /**
     * A valid stored session now exists.
     */

    setHasStoredSession(true);
  }

  /**
   * ==========================================================================
   * REFRESH USER
   * ==========================================================================
   */

  async function refreshUser() {
    console.log("=================================");

    console.log("AUTH PROVIDER");

    console.log("REFRESH USER");

    console.log("=================================");

    const storedUser = await getCurrentUser<AuthUser>();

    setUser(storedUser);

    setHasStoredSession(storedUser !== null);
  }

  /**
   * ==========================================================================
   * LOGOUT
   * ==========================================================================
   */

  async function logout() {
    try {
      console.log("=================================");

      console.log("AUTH PROVIDER");

      console.log("LOGOUT START");

      console.log("=================================");

      /**
       * ----------------------------------------------------------------------
       * CLEAR ONBOARDING STATE
       * ----------------------------------------------------------------------
       */

      useOnboardingStore.getState().reset();

      /**
       * ----------------------------------------------------------------------
       * CLEAR AUTHENTICATION SESSION
       * ----------------------------------------------------------------------
       */

      await clearSession("LOGOUT");

      console.log("AUTH PROVIDER → SESSION CLEARED");
    } catch (error) {
      console.error("=================================");

      console.error("AUTH PROVIDER → LOGOUT FAILED");

      console.error(error);

      console.error("=================================");
    } finally {
      /**
       * Always lock the application state.
       */

      setUser(null);

      setHasStoredSession(false);

      console.log("=================================");

      console.log("AUTH PROVIDER");

      console.log("LOGOUT COMPLETE");

      console.log("=================================");
    }
  }

  /**
   * ==========================================================================
   * CONTEXT VALUE
   * ==========================================================================
   */

  const value = useMemo(
    () => ({
      user,

      isLoading,

      hasStoredSession,

      isAuthenticated: user !== null,

      login,

      refreshUser,

      logout,
    }),
    [user, isLoading, hasStoredSession]
  );

  /**
   * ==========================================================================
   * PROVIDER
   * ==========================================================================
   */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * ============================================================================
 * USE AUTH
 * ============================================================================
 */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
