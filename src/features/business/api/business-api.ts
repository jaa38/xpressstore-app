import { supabase } from "@/services/supabase/client";

export async function getBusinessCategories() {
  const { data, error } = await supabase
    .from("business_categories")
    .select("*")
    .order("name");

  console.log("Categories Data:", data);
  console.log("Categories Error:", error);

  if (error) {
    throw error;
  }

  return data;
}

type CreateBusinessPayload = {
  businessName: string;

  businessAddress: string;

  businessType: string;

  businessCategory: string;
};

export async function createBusiness(payload: CreateBusinessPayload) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Current User:", user);

  if (!user) {
    throw new Error("User not found");
  }

  console.log("Payload:", payload);

  const payloadToInsert = {
    user_id: user.id,

    business_name: payload.businessName,

    business_address: payload.businessAddress,

    business_type: payload.businessType,

    category_id: payload.businessCategory,
  };

  console.log("Insert Payload:", payloadToInsert);

  const { data, error } = await supabase
    .from("businesses")
    .insert(payloadToInsert)
    .select()
    .single();

  console.log("Insert Error:", error);
  console.log("Insert Data:", data);

  if (error) {
    throw error;
  }

  return data;
}
