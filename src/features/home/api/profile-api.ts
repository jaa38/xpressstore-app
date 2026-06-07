import { supabase } from "@/services/supabase/client";

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Profile User:", user);

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
