import { supabase } from "@/services/supabase/client";

export async function signupUser(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,

    options: {
      emailRedirectTo: "xpressstore://auth/callback",
    },
  });
}

export async function loginUser(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}
