// services/biometrics/user.ts

import { StorageKeys, saveSecureItem, getSecureItem, removeSecureItem } from "@/services/storage/secure-storage";

export async function saveBiometricEmail(email: string) {
  await saveSecureItem(StorageKeys.BIOMETRIC_EMAIL, email);
}

export async function getBiometricEmail() {
  return getSecureItem(StorageKeys.BIOMETRIC_EMAIL);
}

export async function clearBiometricEmail() {
  await removeSecureItem(StorageKeys.BIOMETRIC_EMAIL);
}