import * as SecureStore from "expo-secure-store";

const BIOMETRIC_EMAIL_KEY = "biometric_email";

export async function saveBiometricEmail(email: string) {
  await SecureStore.setItemAsync(BIOMETRIC_EMAIL_KEY, email);
}

export async function getBiometricEmail() {
  return SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
}

export async function clearBiometricEmail() {
  await SecureStore.deleteItemAsync(BIOMETRIC_EMAIL_KEY);
}
