import { supabase } from "@/services/supabase/client";

export async function verifyEmailOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });
}

export async function resendEmailOtp(email: string) {
  return supabase.auth.resend({
    type: "signup",
    email,
  });
}
