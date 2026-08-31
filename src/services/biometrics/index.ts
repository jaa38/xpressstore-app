import * as LocalAuthentication from "expo-local-authentication";

export type BiometricType =
  | "face"
  | "fingerprint"
  | "iris"
  | "biometric"
  | "none";

export interface BiometricAvailability {
  available: boolean;
  type: BiometricType;
  message?: string;
}

export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    return {
      available: false,
      type: "none",
      message: "Biometric authentication is not available on this device.",
    };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!isEnrolled) {
    return {
      available: false,
      type: "none",
      message: "No biometric authentication is configured on this device.",
    };
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

  if (
    types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
  ) {
    return {
      available: true,
      type: "face",
    };
  }

  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return {
      available: true,
      type: "fingerprint",
    };
  }

  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return {
      available: true,
      type: "iris",
    };
  }

  return {
    available: true,
    type: "biometric",
  };
}

export async function authenticateWithBiometrics() {
  const availability = await getBiometricAvailability();

  if (!availability.available) {
    return {
      success: false,
      type: availability.type,
      message:
        availability.message ?? "Biometric authentication is unavailable.",
    };
  }

  const promptMessage =
    availability.type === "face"
      ? "Enable Face ID"
      : availability.type === "fingerprint"
        ? "Enable Fingerprint"
        : "Enable Biometrics";

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: "Cancel",
    fallbackLabel: "Use Passcode",
  });

  return {
    success: result.success,
    type: availability.type,
    message: result.success
      ? "Success"
      : result.error === "user_cancel"
        ? "Authentication cancelled."
        : result.error === "not_enrolled"
          ? "No biometric authentication is configured."
          : result.error === "lockout"
            ? "Biometric authentication is temporarily locked."
            : result.error === "authentication_failed"
              ? "Biometric authentication failed."
              : "Authentication failed.",
  };
}
