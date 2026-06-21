// services/auth/storage.ts

import { StorageKeys, saveSecureItem, getSecureItem } from "@/services/storage/secure-storage";

export async function completeOnboarding() {
  await saveSecureItem(StorageKeys.ONBOARDING_COMPLETE, "true");
}

export async function isOnboardingComplete() {
  const value = await getSecureItem(StorageKeys.ONBOARDING_COMPLETE);
  return value === "true";
}