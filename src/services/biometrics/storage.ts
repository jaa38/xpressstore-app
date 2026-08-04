import {
  getItem,
  removeItem,
  setItem,
} from "@/storage/storage";

import { STORAGE_KEYS } from "@/constants/storageKeys";

export async function enableBiometrics() {
  await setItem(
    STORAGE_KEYS.BIOMETRICS_ENABLED,
    "true"
  );
}

export async function disableBiometrics() {
  await removeItem(
    STORAGE_KEYS.BIOMETRICS_ENABLED
  );
}

export async function isBiometricsEnabled() {
  const value = await getItem(
    STORAGE_KEYS.BIOMETRICS_ENABLED
  );

  return value === "true";
}