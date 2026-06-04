import { supabase } from "@/services/supabase/client";

export async function sendPasswordResetOtp(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export async function verifyPasswordResetOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  });
}
