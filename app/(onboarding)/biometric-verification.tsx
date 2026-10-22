import { useEffect, useState } from "react";

import { Alert, Pressable, ScrollView, View } from "react-native";

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

export default function BiometricVerificationScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);

  const [availability, setAvailability] =
    useState<BiometricAvailability | null>(null);

  const biometricLabel =
    availability?.type === "face"
      ? "Face ID"
      : availability?.type === "fingerprint"
        ? "Fingerprint"
        : availability?.type === "iris"
          ? "Iris Recognition"
          : "Biometrics";

  /**
   * LOAD BIOMETRIC AVAILABILITY
   */

  useEffect(() => {
    void loadBiometricAvailability();
  }, []);

  async function loadBiometricAvailability() {
    try {
      setIsCheckingBiometrics(true);

      const biometricAvailability = await getBiometricAvailability();

      setAvailability(biometricAvailability);
    } catch (error) {
      console.error("Unable to determine biometric availability:", error);

      setAvailability({
        available: false,
        hasHardware: false,
        isEnrolled: false,
        type: "none",
        message: "Unable to determine biometric availability on this device.",
      });
    } finally {
      setIsCheckingBiometrics(false);
    }
  }

  /**
   * COMPLETE ONBOARDING
   */

  async function completeUserOnboarding() {
    await completeOnboarding();

    router.replace(ROUTES.TABS);
  }

  /**
   * SKIP BIOMETRICS
   */

  async function handleSkipBiometrics() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await completeUserOnboarding();
    } catch (error) {
      console.error("Unable to complete onboarding:", error);

      Alert.alert(
        "Unable to Complete Onboarding",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * ENABLE BIOMETRICS
   */

  async function handleEnableBiometrics() {
    if (loading || isCheckingBiometrics) {
      return;
    }

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
       * AUTHENTICATE
       */

      const result = await authenticateWithBiometrics({
        promptMessage: `Confirm to enable ${biometricLabel}`,
      });

      /**
       * HANDLE UNSUCCESSFUL AUTHENTICATION
       */

      if (!result.success) {
        if (!result.cancelled) {
          Alert.alert("Biometric Authentication", result.message);
        }

        return;
      }

      /**
       * ENABLE BIOMETRICS
       */

      await enableBiometrics();

      /**
       * SAVE ACCOUNT EMAIL
       */

      if (user?.email) {
        await saveBiometricEmail(user.email);
      }

      /**
       * COMPLETE ONBOARDING
       */

      await completeUserOnboarding();
    } catch (error) {
      console.error("Biometric authentication failed:", error);

      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * SCREEN
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
        {/* HEADER */}

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

        {/* TITLE AND DESCRIPTION */}

        <View
          style={{
            gap: spacing.xs,
            paddingTop: spacing.lg,
          }}
        >
          <AppText variant="h1" color="heading">
            Secure your account
          </AppText>

          <AppText variant="body" color="secondary">
            Set up biometric authentication for faster sign-in and an additional
            layer of security.
          </AppText>
        </View>

        {/* SCROLLABLE CONTENT */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.lg,
            gap: spacing.md,
          }}
          style={{
            flex: 1,
          }}
        >
          {/* BIOMETRIC ICON */}

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.lg,
            }}
          >
            <View
              style={{
                width: 112,
                height: 112,
                borderRadius: 56,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.background.surface,
                borderWidth: 1,
                borderColor: theme.border.default,
              }}
            >
              <Ionicons
                name="scan-circle-outline"
                size={76}
                color={theme.icon.branding.icon}
              />
            </View>
          </View>

          {/* BIOMETRIC INTRODUCTION */}

          <View
            style={{
              gap: spacing.xs,
            }}
          >
            <AppText
              variant="h1"
              color="heading"
              style={{
                textAlign: "center",
              }}
            >
              {availability?.available
                ? `Enable ${biometricLabel}`
                : "Protect your account"}
            </AppText>

            <AppText
              variant="body"
              color="secondary"
              style={{
                textAlign: "center",
              }}
            >
              Use your device's built-in biometrics to access your account
              conveniently. Your biometric data stays on your device.
            </AppText>
          </View>

          {/* BIOMETRIC AVAILABILITY NOTICE */}

          {!isCheckingBiometrics && !availability?.available && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: radius.lg,
                backgroundColor: theme.background.surface,
                borderWidth: 1,
                borderColor: theme.border.default,
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
                <AppText variant="bodyBold">Biometrics unavailable</AppText>

                <AppText variant="bodySmall" color="muted">
                  {availability?.message ??
                    "Biometric authentication is not available on this device. You can continue and configure it later in Settings."}
                </AppText>
              </View>
            </View>
          )}

          {/* BENEFITS CARD */}

          <View
            style={{
              padding: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.default,
              gap: spacing.md,
            }}
          >
            <AppText variant="bodyBold" color="heading">
              Why enable biometrics?
            </AppText>

            {/* FAST SIGN-IN */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.icon.success.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="body">Faster sign-in</AppText>

                <AppText variant="bodySmall" color="muted">
                  Access your account without repeatedly entering your
                  credentials.
                </AppText>
              </View>
            </View>

            {/* ADDITIONAL SECURITY */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={theme.icon.success.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="body">
                  An additional layer of security
                </AppText>

                <AppText variant="bodySmall" color="muted">
                  Use your device's biometric authentication to unlock locally
                  stored credentials.
                </AppText>
              </View>
            </View>

            {/* SETTINGS */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={theme.icon.success.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="body">You're in control</AppText>

                <AppText variant="bodySmall" color="muted">
                  Manage biometric sign-in later in Settings.
                </AppText>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}

          <View
            style={{
              paddingTop: spacing.sm,
              gap: spacing.sm,
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
              disabled={loading}
              onPress={handleSkipBiometrics}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
