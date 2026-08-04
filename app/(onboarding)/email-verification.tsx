import { useState } from "react";

import { Alert, Pressable, View } from "react-native";

import { Link, router, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OTPInput } from "@/components/ui/OTPInput";

import { useVerifyEmailOtp } from "@/hooks/auth/useVerifyEmailOtp";

import { useResendOtp } from "@/hooks/auth/useResendOtp";

import { getApiErrorMessage } from "@/api/errors";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

export default function EmailVerificationScreen() {
  const { email } = useLocalSearchParams<{
    email: string;
  }>();

  const [verificationCode, setVerificationCode] = useState("");

  const verifyEmailOtp = useVerifyEmailOtp();

  const resendOtp = useResendOtp();

  function handleVerify(code: string) {
    setVerificationCode(code);
  }

  async function handleSubmitOTP() {
    try {
      await verifyEmailOtp.mutateAsync({
        email,
        otp: verificationCode,
      });

      Alert.alert(
        "Email Verified",
        "Your account has been verified successfully."
      );

      router.replace(ROUTES.BUSINESS_DETAILS);
    } catch (error) {
      Alert.alert("Verification Failed", getApiErrorMessage(error));
    }
  }

  async function handleResendOTP() {
    try {
      await resendOtp.mutateAsync(email);

      Alert.alert("Success", "Verification code sent.");
    } catch (error) {
      Alert.alert("Unable to Resend", getApiErrorMessage(error));
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
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            {/* HEADER */}

            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                gap: spacing.sm,

                justifyContent: "space-between",
              }}
            >
              <Link href={ROUTES.SIGNUP} asChild>
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
                <ProgressBar progress={25} />
              </View>

              <AppText variant="bodySmall" color="muted">
                Step 1 of 4
              </AppText>
            </View>

            {/* CONTENT */}

            <View
              style={{
                marginTop: spacing.xl,

                gap: spacing.xl,
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h1" color="heading">
                  Email Verification
                </AppText>

                <AppText variant="body" color="secondary">
                  We've sent a 8-digit verification code to:
                  {"\n\n"}
                  <AppText variant="bodyBold" color="primary">
                    {email}
                  </AppText>
                </AppText>
              </View>

              <OTPInput length={8} onComplete={handleVerify} />

              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  justifyContent: "space-between",

                  backgroundColor: theme.background.brand,

                  paddingVertical: spacing.rg,

                  paddingHorizontal: spacing.md,

                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color={theme.icon.success.icon}
                  />

                  <AppText variant="body" color="primary">
                    Didn't receive OTP?
                  </AppText>
                </View>

                <Pressable
                  disabled={resendOtp.isPending}
                  onPress={handleResendOTP}
                >
                  <AppText variant="bodyBold" color="link">
                    {resendOtp.isPending ? "Sending..." : "Resend OTP"}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* FOOTER */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title={verifyEmailOtp.isPending ? "Verifying..." : "Verify Email"}
              variant="primary"
              size="large"
              disabled={
                verificationCode.length !== 8 || verifyEmailOtp.isPending
              }
              onPress={handleSubmitOTP}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
