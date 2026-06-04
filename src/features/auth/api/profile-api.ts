import { supabase } from "@/services/supabase/client";

export async function createUserProfile(data: {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  idType: string;
  idNumber: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("user_profiles").insert({
    user_id: user?.id,

    full_name: data.fullName,

    phone_number: data.phoneNumber,

    date_of_birth: data.dateOfBirth,

    id_type: data.idType,

    id_number: data.idNumber,
  });
}
