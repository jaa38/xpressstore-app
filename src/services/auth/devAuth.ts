import { saveAccessToken } from "@/storage/authStorage";

import { DEV_ACCESS_TOKEN } from "@/config/devAuth";

/**
 * Stores the backend-provided development JWT.
 *
 * Development/testing only.
 */
export async function bootstrapDevAuth() {
  if (!DEV_ACCESS_TOKEN) {
    return false;
  }

  await saveAccessToken(DEV_ACCESS_TOKEN);

  console.log("=================================");
  console.log("DEV AUTH TOKEN SAVED");
  console.log("=================================");

  return true;
}