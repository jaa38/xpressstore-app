import { getItem, removeItem, setItem } from "@/storage/storage";

import { StorageKeys } from "@/services/storage/secure-storage";

export async function saveBiometricEmail(email: string) {
  await setItem(StorageKeys.BIOMETRIC_EMAIL, email);
}

export async function getBiometricEmail() {
  return getItem(StorageKeys.BIOMETRIC_EMAIL);
}

export async function clearBiometricEmail() {
  await removeItem(StorageKeys.BIOMETRIC_EMAIL);
}
