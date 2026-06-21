// services/biometrics/storage.ts

import { StorageKeys, saveSecureItem, getSecureItem, removeSecureItem } from "@/services/storage/secure-storage";

export async function enableBiometrics() {
  await saveSecureItem(StorageKeys.BIOMETRICS_ENABLED, "true");
}

export async function disableBiometrics() {
  await removeSecureItem(StorageKeys.BIOMETRICS_ENABLED);
}

export async function isBiometricsEnabled() {
  const value = await getSecureItem(StorageKeys.BIOMETRICS_ENABLED);
  return value === "true";
}