import * as SecureStore from "expo-secure-store";

export async function setItem(
  key: string,
  value: string
) {
  await SecureStore.setItemAsync(
    key,
    value
  );
}

export async function getItem(
  key: string
) {
  return SecureStore.getItemAsync(key);
}

export async function removeItem(
  key: string
) {
  return SecureStore.deleteItemAsync(
    key
  );
}