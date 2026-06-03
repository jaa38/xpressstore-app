import * as LocalAuthentication from "expo-local-authentication";

export async function authenticateWithBiometrics() {
  const hasHardware =
    await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    return {
      success: false,
      message:
        "Biometric authentication is not available on this device.",
    };
  }

  const isEnrolled =
    await LocalAuthentication.isEnrolledAsync();

  if (!isEnrolled) {
    return {
      success: false,
      message:
        "No Face ID or Fingerprint is configured on this device.",
    };
  }

  const result =
    await LocalAuthentication.authenticateAsync({
      promptMessage: "Enable Face ID",
      cancelLabel: "Cancel",
      fallbackLabel: "Use Passcode",
    });

  return {
    success: result.success,
    message: result.success
      ? "Success"
      : "Authentication failed",
  };
}