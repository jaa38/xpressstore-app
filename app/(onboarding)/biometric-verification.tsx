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
  getBiometricAvailability,
} from "@/services/biometrics";

import { enableBiometrics } from "@/services/biometrics/storage";
import { saveBiometricEmail } from "@/services/biometrics/user";

import { completeOnboarding } from "@/services/auth/storage";

export default function BiometricVerificationScreen() {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [biometricType, setBiometricType] = useState<
    "face" | "fingerprint" | "iris" | "biometric" | "none"
  >("none");

  const biometricLabel =
    biometricType === "face"
      ? "Face ID"
      : biometricType === "fingerprint"
        ? "Fingerprint"
        : "Biometrics";

  useEffect(() => {
    async function loadBiometricType() {
      const availability = await getBiometricAvailability();

      setBiometricType(availability.type);
    }

    loadBiometricType();
  }, []);

  async function handleVerification() {
    await completeOnboarding();

    router.replace(ROUTES.TABS);
  }

  async function handleEnableBiometrics() {
    try {
      setLoading(true);

      const result = await authenticateWithBiometrics();

      if (!result.success) {
        Alert.alert("Biometric Authentication", result.message);

        return;
      }

      await enableBiometrics();

      if (user?.email) {
        await saveBiometricEmail(user.email);
      }

      await completeOnboarding();

      router.replace(ROUTES.TABS);
    } catch (error) {
      console.log("Biometric authentication failed:", error);

      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
            <Pressable>
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

        <View
          style={{
            flex: 1,

            justifyContent: "space-between",
          }}
        >
          <View>
            {/* TITLE */}
            <Ionicons
              name="scan-circle-outline"
              size={156}
              color={theme.icon.branding.icon}
              style={{
                marginTop: spacing.xl,
                alignSelf: "center",
              }}
            />
            <View
              style={{
                marginTop: spacing.lg,

                gap: spacing.xs,
              }}
            >
              <AppText
                variant="displayLarge"
                color="heading"
                style={{ textAlign: "center" }}
              >
                Secure your account with biometrics
              </AppText>

              <AppText
                variant="bodyLarge"
                color="secondary"
                style={{ textAlign: "center" }}
              >
                Use biometrics to quickly and securely access your account and
                confirm payments.
              </AppText>
            </View>

            {/* INFO CARD */}

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
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  alignContent: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.icon.success.icon}
                />
                <AppText variant="body">Fast sign-in with biometrics</AppText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  alignContent: "center",
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
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  alignContent: "center",
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

          {/* FOOTER */}

          <View
            style={{
              paddingBottom: spacing.lg,
              gap: spacing.rg,
            }}
          >
            <Button
              title={loading ? "Verifying..." : `Enable ${biometricLabel}`}
              variant="primary"
              size="large"
              disabled={loading}
              onPress={handleEnableBiometrics}
            />
            <Button
              title="Skip for now"
              variant="tertiary"
              size="large"
              onPress={handleVerification}
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
