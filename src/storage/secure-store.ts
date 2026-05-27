import * as SecureStore from "expo-secure-store";

export async function saveSecureItem(
  key: string,
  value: string
) {
  await SecureStore.setItemAsync(
    key,
    value
  );
}

export async function getSecureItem(
  key: string
) {
  return SecureStore.getItemAsync(key);
}

export async function removeSecureItem(
  key: string
) {
  await SecureStore.deleteItemAsync(key);
}