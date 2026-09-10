import * as LocalAuthentication from "expo-local-authentication";

/**
 * ============================================================================
 * BIOMETRIC TYPES
 * ============================================================================
 */

export type BiometricType =
  | "face"
  | "fingerprint"
  | "iris"
  | "biometric"
  | "none";

/**
 * ============================================================================
 * BIOMETRIC AVAILABILITY
 * ============================================================================
 */

export interface BiometricAvailability {
  /**
   * Whether biometric authentication can currently be used.
   */
  available: boolean;

  /**
   * Whether the device has biometric hardware.
   */
  hasHardware: boolean;

  /**
   * Whether the user has enrolled biometrics on the device.
   */
  isEnrolled: boolean;

  /**
   * The preferred biometric authentication type.
   */
  type: BiometricType;

  /**
   * Human-readable explanation.
   */
  message?: string;
}

/**
 * ============================================================================
 * BIOMETRIC AUTHENTICATION RESULT
 * ============================================================================
 */

export interface BiometricAuthenticationResult {
  success: boolean;

  /**
   * Indicates whether the authentication request was cancelled.
   */
  cancelled?: boolean;

  message: string;
}

/**
 * ============================================================================
 * GET BIOMETRIC AVAILABILITY
 * ============================================================================
 *
 * Checks:
 *
 * 1. Whether biometric hardware exists.
 * 2. Whether biometric authentication is enrolled.
 * 3. Which biometric authentication method is supported.
 */

export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  try {
    /**
     * ------------------------------------------------------------------------
     * CHECK BIOMETRIC HARDWARE
     * ------------------------------------------------------------------------
     */

    const hasHardware = await LocalAuthentication.hasHardwareAsync();

    if (!hasHardware) {
      return {
        available: false,
        hasHardware: false,
        isEnrolled: false,
        type: "none",
        message: "This device does not support biometric authentication.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * CHECK ENROLLED BIOMETRICS
     * ------------------------------------------------------------------------
     */

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isEnrolled) {
      return {
        available: false,
        hasHardware: true,
        isEnrolled: false,
        type: "none",
        message:
          "No biometric authentication is set up on this device. Add Face ID, a fingerprint, or another biometric method in your device settings.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * DETECT SUPPORTED AUTHENTICATION TYPES
     * ------------------------------------------------------------------------
     */

    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    /**
     * ------------------------------------------------------------------------
     * FACE ID / FACIAL RECOGNITION
     * ------------------------------------------------------------------------
     */

    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      return {
        available: true,
        hasHardware: true,
        isEnrolled: true,
        type: "face",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * FINGERPRINT
     * ------------------------------------------------------------------------
     */

    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      return {
        available: true,
        hasHardware: true,
        isEnrolled: true,
        type: "fingerprint",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * IRIS
     * ------------------------------------------------------------------------
     */

    if (
      LocalAuthentication.AuthenticationType.IRIS !== undefined &&
      supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      return {
        available: true,
        hasHardware: true,
        isEnrolled: true,
        type: "iris",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * GENERIC BIOMETRICS
     * ------------------------------------------------------------------------
     */

    return {
      available: true,
      hasHardware: true,
      isEnrolled: true,
      type: "biometric",
    };
  } catch (error) {
    console.error("Unable to determine biometric availability:", error);

    return {
      available: false,
      hasHardware: false,
      isEnrolled: false,
      type: "none",
      message: "Unable to determine biometric availability on this device.",
    };
  }
}

/**
 * ============================================================================
 * AUTHENTICATION OPTIONS
 * ============================================================================
 */

interface AuthenticateWithBiometricsOptions {
  promptMessage?: string;
}

/**
 * ============================================================================
 * AUTHENTICATE WITH BIOMETRICS
 * ============================================================================
 *
 * Authenticates the current device user using the biometric
 * authentication method configured on the device.
 */

export async function authenticateWithBiometrics(
  options: AuthenticateWithBiometricsOptions = {}
): Promise<BiometricAuthenticationResult> {
  try {
    /**
     * ------------------------------------------------------------------------
     * CHECK AVAILABILITY
     * ------------------------------------------------------------------------
     */

    const availability = await getBiometricAvailability();

    if (!availability.available) {
      return {
        success: false,
        cancelled: false,
        message:
          availability.message ?? "Biometric authentication is not available.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * AUTHENTICATE
     * ------------------------------------------------------------------------
     */

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options.promptMessage ?? "Authenticate to continue",

      /**
       * Require biometrics instead of allowing the device
       * passcode as a fallback.
       */
      disableDeviceFallback: true,

      /**
       * Android cancellation label.
       */
      cancelLabel: "Cancel",

      /**
       * Android biometric confirmation behaviour.
       */
      requireConfirmation: false,
    });

    /**
     * ------------------------------------------------------------------------
     * SUCCESS
     * ------------------------------------------------------------------------
     */

    if (result.success) {
      return {
        success: true,
        cancelled: false,
        message: "Authentication successful.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * CANCELLED
     * ------------------------------------------------------------------------
     */

    if (
      result.error === "user_cancel" ||
      result.error === "system_cancel" ||
      result.error === "app_cancel"
    ) {
      return {
        success: false,
        cancelled: true,
        message: "Authentication cancelled.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * AUTHENTICATION FAILED
     * ------------------------------------------------------------------------
     */

    if (result.error === "authentication_failed") {
      return {
        success: false,
        cancelled: false,
        message: "Biometric authentication failed. Please try again.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * TIMEOUT
     * ------------------------------------------------------------------------
     */

    if (result.error === "timeout") {
      return {
        success: false,
        cancelled: false,
        message: "Biometric authentication timed out. Please try again.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * NOT AVAILABLE
     * ------------------------------------------------------------------------
     */

    if (result.error === "not_available") {
      return {
        success: false,
        cancelled: false,
        message:
          "Biometric authentication is not currently available on this device.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * NOT ENROLLED
     * ------------------------------------------------------------------------
     */

    if (result.error === "not_enrolled") {
      return {
        success: false,
        cancelled: false,
        message:
          "No biometric authentication is set up on this device. Please configure biometrics in your device settings.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * PASSCODE NOT SET
     * ------------------------------------------------------------------------
     */

    if (result.error === "passcode_not_set") {
      return {
        success: false,
        cancelled: false,
        message:
          "Device security is not configured. Please configure Face ID, Touch ID, or a device passcode and try again.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * USER FALLBACK
     * ------------------------------------------------------------------------
     */

    if (result.error === "user_fallback") {
      return {
        success: false,
        cancelled: true,
        message: "Please sign in using your email and password.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * INVALID CONTEXT
     * ------------------------------------------------------------------------
     */

    if (result.error === "invalid_context") {
      return {
        success: false,
        cancelled: false,
        message:
          "Biometric authentication could not be completed. Please try again.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * UNABLE TO PROCESS
     * ------------------------------------------------------------------------
     */

    if (result.error === "unable_to_process") {
      return {
        success: false,
        cancelled: false,
        message:
          "Your biometric information could not be processed. Please try again.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * NO SPACE
     * ------------------------------------------------------------------------
     */

    if (result.error === "no_space") {
      return {
        success: false,
        cancelled: false,
        message:
          "Biometric authentication could not be completed due to a device issue.",
      };
    }

    /**
     * ------------------------------------------------------------------------
     * UNKNOWN
     * ------------------------------------------------------------------------
     */

    return {
      success: false,
      cancelled: false,
      message:
        "Biometric authentication was unsuccessful. Please try again or use your password.",
    };
  } catch (error) {
    console.error("Biometric authentication failed:", error);

    return {
      success: false,
      cancelled: false,
      message: "Unable to complete biometric authentication. Please try again.",
    };
  }
}
