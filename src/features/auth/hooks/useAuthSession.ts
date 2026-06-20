import { useEffect } from "react";

import { supabase } from "@/services/supabase/client";

import { useAuthStore } from "../store/auth-store";

export function useAuthSession() {
  const setSession = useAuthStore(
    (state) => state.setSession
  );

  const setLoading = useAuthStore(
    (state) => state.setLoading
  );

  useEffect(() => {
    async function restoreSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session?.user ?? null);
      } catch (error) {
        console.log(
          "Session Restore Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session?.user ?? null);

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setLoading]);
}