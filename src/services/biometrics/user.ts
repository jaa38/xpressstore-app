import {
  getItem,
  removeItem,
  setItem,
} from "@/storage/storage";

import { STORAGE_KEYS } from "@/constants/storageKeys";

export async function saveBiometricEmail(
  email: string
) {
  await setItem(
    STORAGE_KEYS.BIOMETRIC_EMAIL,
    email
  );
}

export async function getBiometricEmail() {
  return getItem(
    STORAGE_KEYS.BIOMETRIC_EMAIL
  );
}

export async function clearBiometricEmail() {
  await removeItem(
    STORAGE_KEYS.BIOMETRIC_EMAIL
  );
}