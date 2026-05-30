import { supabase } from "@/services/supabase/client";

export async function loginUser(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signupUser(
  email: string,
  password: string
) {
  return supabase.auth.signUp({
    email,
    password,
  });
}