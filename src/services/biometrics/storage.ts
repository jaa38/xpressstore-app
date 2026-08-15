import { getItem, removeItem, setItem } from "@/storage/storage";

import { StorageKeys } from "@/services/storage/secure-storage";

export async function enableBiometrics() {
  await setItem(StorageKeys.BIOMETRICS_ENABLED, "true");
}

export async function disableBiometrics() {
  await removeItem(StorageKeys.BIOMETRICS_ENABLED);
}

export async function isBiometricsEnabled() {
  const value = await getItem(StorageKeys.BIOMETRICS_ENABLED);

  return value === "true";
}
