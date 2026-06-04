import { useState } from "react";

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

import { authenticateWithBiometrics } from "@/services/biometrics";
import { enableBiometrics } from "@/services/biometrics/storage";
import { completeOnboarding } from "@/services/auth/storage";

import { supabase } from "@/services/supabase/client";

import { saveBiometricEmail } from "@/services/biometrics/user";



export default function BiometricVerificationScreen() {
  const [loading, setLoading] = useState(false);

  async function handleVerification() {
    await completeOnboarding();

    router.replace(ROUTES.TABS);
  }

  async function handleEnableFaceId() {
    try {
      setLoading(true);

      const result = await authenticateWithBiometrics();

      if (!result.success) {
        Alert.alert(
          "Face ID Unavailable",
          "Authentication failed. Please ensure Face ID or Fingerprint is configured on your device."
        );

        return;
      }

      await enableBiometrics();

      const {
        data: { user },
      } = await supabase.auth.getUser();

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
            Step 4 of 4
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
                Use Face ID to quickly and securely access your account and
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
                <AppText variant="body">Fast sign - no password needed</AppText>
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
              title={loading ? "Verifying..." : "Enable Face ID"}
              variant="primary"
              size="large"
              disabled={loading}
              onPress={handleEnableFaceId}
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
