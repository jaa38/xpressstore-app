import * as FileSystem from "expo-file-system/legacy";

import { decode } from "base64-arraybuffer";

import { supabase } from "@/services/supabase/client";

export async function uploadProductImage(uri: string) {
  // No image selected
  if (!uri) {
    return "";
  }

  // Already uploaded
  if (uri.startsWith("http")) {
    return uri;
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fileName = `${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, decode(base64), {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
