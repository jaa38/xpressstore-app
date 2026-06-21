// services/storage/secure-storage.ts

import * as SecureStore from "expo-secure-store";

// ─── SINGLE SOURCE OF TRUTH FOR ALL SECURE STORAGE KEYS ─────────────────────
// Previously "onboarding_complete" and "is_onboarded" existed as two
// different keys for the same concept in two different files.
// From now on — one key, defined once, used everywhere.

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
