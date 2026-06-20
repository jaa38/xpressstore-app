// services/storage/secure-storage.ts
import * as SecureStore from "expo-secure-store";

export const StorageKeys = {
  ONBOARDING_COMPLETE: "onboarding_complete",
  BIOMETRICS_ENABLED: "biometric_enabled",
  BIOMETRIC_EMAIL: "biometric_email",
} as const;

export async function saveSecureItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}
export async function getSecureItem(key: string) {
  return SecureStore.getItemAsync(key);
}
export async function removeSecureItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}