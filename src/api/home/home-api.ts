//Reference: https://supabase.com/docs/guides/auth/row-level-security#row-level-security-rules
import { supabase } from "@/services/supabase/client";

export async function getBusiness() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
