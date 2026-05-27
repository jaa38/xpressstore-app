import {
  getSecureItem,
  removeSecureItem,
  saveSecureItem,
} from "@/storage/secure-store";

const ACCESS_TOKEN_KEY =
  "access_token";

export async function saveAccessToken(
  token: string
) {
  await saveSecureItem(
    ACCESS_TOKEN_KEY,
    token
  );
}

export async function getAccessToken() {
  return getSecureItem(
    ACCESS_TOKEN_KEY
  );
}

export async function clearAccessToken() {
  await removeSecureItem(
    ACCESS_TOKEN_KEY
  );
}