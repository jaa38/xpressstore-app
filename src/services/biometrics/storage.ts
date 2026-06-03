import * as SecureStore from "expo-secure-store";

const BIOMETRIC_KEY =
  "biometric_enabled";

export async function enableBiometrics() {
  await SecureStore.setItemAsync(
    BIOMETRIC_KEY,
    "true"
  );
}

export async function disableBiometrics() {
  await SecureStore.deleteItemAsync(
    BIOMETRIC_KEY
  );
}

export async function isBiometricsEnabled() {
  const value =
    await SecureStore.getItemAsync(
      BIOMETRIC_KEY
    );

  return value === "true";
}