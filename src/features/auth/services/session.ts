import {
  getSecureItem,
  removeSecureItem,
  saveSecureItem,
} from "@/storage/secure-store";

const ACCESS_TOKEN_KEY = "access_token";

const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Access Token
 */

export async function saveAccessToken(token: string) {
  await saveSecureItem(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
  return getSecureItem(ACCESS_TOKEN_KEY);
}

export async function clearAccessToken() {
  await removeSecureItem(ACCESS_TOKEN_KEY);
}

/**
 * Refresh Token
 */

export async function saveRefreshToken(token: string) {
  await saveSecureItem(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return getSecureItem(REFRESH_TOKEN_KEY);
}

export async function clearRefreshToken() {
  await removeSecureItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear Everything
 */

export async function clearSession() {
  await Promise.all([clearAccessToken(), clearRefreshToken()]);
}
