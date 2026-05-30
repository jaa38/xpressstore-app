import {
  getSecureItem,
  removeSecureItem,
  saveSecureItem,
} from "@/storage/secure-store";

const ACCESS_TOKEN_KEY =
  "access_token";

/**
 * Save access token securely
 */
export async function saveAccessToken(
  token: string
) {
  await saveSecureItem(
    ACCESS_TOKEN_KEY,
    token
  );
}

/**
 * Get access token
 */
export async function getAccessToken() {
  return getSecureItem(
    ACCESS_TOKEN_KEY
  );
}

/**
 * Remove access token
 */
export async function clearAccessToken() {
  await removeSecureItem(
    ACCESS_TOKEN_KEY
  );
}