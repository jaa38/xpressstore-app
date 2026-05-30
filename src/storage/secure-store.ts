import * as SecureStore from "expo-secure-store";

/**
 * Save secure value
 */
export async function saveSecureItem(
  key: string,
  value: string
) {
  await SecureStore.setItemAsync(
    key,
    value
  );
}

/**
 * Get secure value
 */
export async function getSecureItem(
  key: string
) {
  return SecureStore.getItemAsync(key);
}

/**
 * Remove secure value
 */
export async function removeSecureItem(
  key: string
) {
  await SecureStore.deleteItemAsync(
    key
  );
}