import { PropsWithChildren, useEffect } from "react";

import { supabase } from "@/services/supabase/client";

import { useAuthStore } from "@/features/auth/store/auth-store";

export function AuthProvider({ children }: PropsWithChildren) {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setUser = useAuthStore((state) => state.setUser);

  const setLoading = useAuthStore((state) => state.setLoading);

  

  useEffect(() => {
    async function restoreSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Restored Session:", session);

        if (session?.user) {
          setAuthenticated(true);

          setUser(session.user);
        }
      } catch (error) {
        console.log("Session Restore Error:", error);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthenticated(true);

        setUser(session.user);
      } else {
        setAuthenticated(false);

        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
