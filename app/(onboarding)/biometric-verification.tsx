import { useEffect, useState } from "react";

import { Alert, Pressable, View } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { Button } from "@/components/ui/Button";

import { ProgressBar } from "@/components/ui/ProgressBar";

import { radius, spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useAuth } from "@/providers/AuthProvider";

import {
  authenticateWithBiometrics,
  BiometricAvailability,
  getBiometricAvailability,
} from "@/services/biometrics";

import { enableBiometrics } from "@/services/biometrics/storage";

import { saveBiometricEmail } from "@/services/biometrics/user";

import { completeOnboarding } from "@/services/auth/storage";

/**
 * ============================================================================
 * BIOMETRIC VERIFICATION SCREEN
 * ============================================================================
 */

export default function BiometricVerificationScreen() {
  /**
   * ==========================================================================
   * AUTH
   * ==========================================================================
   */

  const { user } = useAuth();

  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [loading, setLoading] = useState(false);

  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);

  const [availability, setAvailability] =
    useState<BiometricAvailability | null>(null);

  /**
   * ==========================================================================
   * BIOMETRIC LABEL
   * ==========================================================================
   */

  const biometricLabel =
    availability?.type === "face"
      ? "Face ID"
      : availability?.type === "fingerprint"
        ? "Fingerprint"
        : availability?.type === "iris"
          ? "Iris Recognition"
          : availability?.type === "biometric"
            ? "Biometrics"
            : "Biometrics";

  /**
   * ==========================================================================
   * LOAD BIOMETRIC AVAILABILITY
   * ==========================================================================
   */

  useEffect(() => {
    void loadBiometricAvailability();
  }, []);

  async function loadBiometricAvailability() {
    try {
      setIsCheckingBiometrics(true);

      const biometricAvailability =
        await getBiometricAvailability();

      setAvailability(biometricAvailability);
    } catch (error) {
      console.error(
        "Unable to determine biometric availability:",
        error
      );

      setAvailability({
        available: false,
        hasHardware: false,
        isEnrolled: false,
        type: "none",
        message:
          "Unable to determine biometric availability on this device.",
      });
    } finally {
      setIsCheckingBiometrics(false);
    }
  }

  /**
   * ==========================================================================
   * COMPLETE ONBOARDING
   * ==========================================================================
   */

  async function completeUserOnboarding() {
    await completeOnboarding();

    router.replace(ROUTES.TABS);
  }

  /**
   * ==========================================================================
   * SKIP BIOMETRICS
   * ==========================================================================
   */

  async function handleSkipBiometrics() {
    try {
      setLoading(true);

      await completeUserOnboarding();
    } catch (error) {
      console.error(
        "Unable to complete onboarding:",
        error
      );

      Alert.alert(
        "Unable to Complete Onboarding",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * ==========================================================================
   * ENABLE BIOMETRICS
   * ==========================================================================
   */

  async function handleEnableBiometrics() {
    /**
     * ------------------------------------------------------------------------
     * PREVENT MULTIPLE REQUESTS
     * ------------------------------------------------------------------------
     */

    if (loading || isCheckingBiometrics) {
      return;
    }

    /**
     * ------------------------------------------------------------------------
     * CHECK BIOMETRIC AVAILABILITY
     * ------------------------------------------------------------------------
     */

    if (!availability?.available) {
      Alert.alert(
        "Biometrics Unavailable",
        availability?.message ??
          "Biometric authentication is not available on this device."
      );

      return;
    }

    try {
      setLoading(true);

      /**
       * ----------------------------------------------------------------------
       * AUTHENTICATE
       * ----------------------------------------------------------------------
       */

      const result = await authenticateWithBiometrics({
        promptMessage: `Confirm to enable ${biometricLabel}`,
      });

      /**
       * ----------------------------------------------------------------------
       * AUTHENTICATION UNSUCCESSFUL
       * ----------------------------------------------------------------------
       */

      if (!result.success) {
        /**
         * Cancelling the biometric prompt is an expected
         * user action and should not display an error.
         */

        if (!result.cancelled) {
          Alert.alert(
            "Biometric Authentication",
            result.message
          );
        }

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * ENABLE BIOMETRICS
       * ----------------------------------------------------------------------
       */

      await enableBiometrics();

      /**
       * ----------------------------------------------------------------------
       * SAVE ACCOUNT EMAIL
       * ----------------------------------------------------------------------
       *
       * The email is only used to identify the account
       * associated with biometric sign-in.
       */

      if (user?.email) {
        await saveBiometricEmail(user.email);
      }

      /**
       * ----------------------------------------------------------------------
       * COMPLETE ONBOARDING
       * ----------------------------------------------------------------------
       */

      await completeUserOnboarding();
    } catch (error) {
      console.error(
        "Biometric authentication failed:",
        error
      );

      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * ==========================================================================
   * SCREEN
   * ==========================================================================
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,

          paddingHorizontal: spacing.lg,
        }}
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            gap: spacing.sm,

            justifyContent: "space-between",
          }}
        >
          <Link href={ROUTES.ID_VERIFICATION} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              disabled={loading}
              style={({ pressed }) => ({
                opacity: pressed || loading ? 0.6 : 1,
              })}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>
          </Link>

          <View
            style={{
              flex: 1,

              height: 8,

              backgroundColor: theme.divider.default,

              borderRadius: 999,

              overflow: "hidden",

              marginHorizontal: spacing.sm,
            }}
          >
            <ProgressBar progress={100} />
          </View>

          <AppText variant="bodySmall" color="muted">
            Step 6 of 6
          </AppText>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <View
          style={{
            flex: 1,

            justifyContent: "space-between",
          }}
        >
          {/* ============================================================
              MAIN CONTENT
          ============================================================ */}

          <View>
            {/* ICON */}

            <Ionicons
              name="scan-circle-outline"
              size={156}
              color={theme.icon.branding.icon}
              style={{
                marginTop: spacing.xl,

                alignSelf: "center",
              }}
            />

            {/* TITLE */}

            <View
              style={{
                marginTop: spacing.lg,

                gap: spacing.xs,
              }}
            >
              <AppText
                variant="displayLarge"
                color="heading"
                style={{
                  textAlign: "center",
                }}
              >
                Secure your account with biometrics
              </AppText>

              <AppText
                variant="bodyLarge"
                color="secondary"
                style={{
                  textAlign: "center",
                }}
              >
                Use biometrics to quickly and securely access your account and
                confirm payments.
              </AppText>
            </View>

            {/* ============================================================
                BIOMETRIC AVAILABILITY NOTICE
            ============================================================ */}

            {!isCheckingBiometrics && !availability?.available ? (
              <View
                style={{
                  marginTop: spacing.md,

                  paddingVertical: spacing.md,

                  paddingHorizontal: spacing.md,

                  borderRadius: radius.lg,

                  backgroundColor: theme.background.surface,

                  borderWidth: 1,

                  borderColor: theme.border.default,

                  flexDirection: "row",

                  alignItems: "flex-start",

                  gap: spacing.sm,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={theme.icon.default.icon}
                />

                <View
                  style={{
                    flex: 1,

                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">
                    Biometrics unavailable
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="muted"
                  >
                    {availability?.message ??
                      "Biometric authentication is not available on this device. You can continue and enable it later from Settings."}
                  </AppText>
                </View>
              </View>
            ) : null}

            {/* ============================================================
                INFO CARD
            ============================================================ */}

            <View
              style={{
                marginTop: spacing.md,

                paddingVertical: spacing.lg,

                paddingHorizontal: spacing.md,

                borderRadius: radius.lg,

                backgroundColor: theme.background.surface,

                borderWidth: 1,

                borderColor: theme.border.default,

                gap: spacing.md,
              }}
            >
              {/* FAST SIGN-IN */}

              <View
                style={{
                  flexDirection: "row",

                  gap: spacing.sm,

                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.icon.success.icon}
                />

                <AppText variant="body">
                  Fast sign-in with biometrics
                </AppText>
              </View>

              {/* PAYOUT CONFIRMATION */}

              <View
                style={{
                  flexDirection: "row",

                  gap: spacing.sm,

                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.icon.success.icon}
                />

                <AppText variant="body">
                  Confirm payouts and large transactions
                </AppText>
              </View>

              {/* SETTINGS */}

              <View
                style={{
                  flexDirection: "row",

                  gap: spacing.sm,

                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.icon.success.icon}
                />

                <AppText variant="body">
                  You can change this anytime in Settings
                </AppText>
              </View>
            </View>
          </View>

          {/* ============================================================
              FOOTER
          ============================================================ */}

          <View
            style={{
              paddingBottom: spacing.lg,

              gap: spacing.md,
            }}
          >
            {/* ENABLE BIOMETRICS */}

            <Button
              title={
                isCheckingBiometrics
                  ? "Checking biometrics..."
                  : loading
                    ? "Verifying..."
                    : availability?.available
                      ? `Enable ${biometricLabel}`
                      : "Enable biometrics"
              }
              variant="primary"
              size="large"
              disabled={loading || isCheckingBiometrics}
              onPress={handleEnableBiometrics}
            />

            {/* SKIP */}

            <Button
              title="Skip for now"
              variant="tertiary"
              size="large"
              disabled={loading || isCheckingBiometrics}
              onPress={handleSkipBiometrics}
              style={{
                marginTop: spacing.sm,
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}