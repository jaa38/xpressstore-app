// import { supabase } from "@/services/supabase/client";

// export async function getBusinessCategories() {
//   const { data, error } = await supabase
//     .from("business_categories")
//     .select("*")
//     .order("name");

//   if (error) {
//     throw error;
//   }

//   return data;
// }

import { supabase } from "@/services/supabase/client";

export async function getBusinessCategories() {
  const { data, error } = await supabase
    .from("business_categories")
    .select("*")
    .order("name");

  console.log("Supabase Categories:", data);
  console.log("Supabase Error:", error);

  if (error) {
    throw error;
  }

  return data;
}
