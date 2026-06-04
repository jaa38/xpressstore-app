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

import { verifyEmailOtp, resendEmailOtp } from "@/features/auth/api/otp-api";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

export default function EmailVerificationScreen() {
  const { email } = useLocalSearchParams<{
    email: string;
  }>();

  const [verificationCode, setVerificationCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  function handleVerify(code: string) {
    setVerificationCode(code);
  }

  async function handleSubmitOTP() {
    try {
      setLoading(true);

      console.log("Email:", email);

      console.log("Verification Code:", verificationCode);

      const response = await verifyEmailOtp(email, verificationCode);

      console.log("Verify Response:", JSON.stringify(response, null, 2));

      if (response.error) {
        Alert.alert("Verification Failed", response.error.message);

        return;
      }

      Alert.alert(
        "Email Verified",
        "Your account has been verified successfully."
      );

      router.replace(ROUTES.BUSINESS_DETAILS);
    } catch (error) {
      console.log("OTP Verification Error:", error);

      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    try {
      setResending(true);

      const response = await resendEmailOtp(email);

      if (response.error) {
        Alert.alert("Failed", response.error.message);

        return;
      }

      Alert.alert("Success", "Verification code sent.");
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Unable to resend code.");
    } finally {
      setResending(false);
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

                <Pressable disabled={resending} onPress={handleResendOTP}>
                  <AppText variant="bodyBold" color="link">
                    {resending ? "Sending..." : "Resend OTP"}
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
              title={loading ? "Verifying..." : "Verify Email"}
              variant="primary"
              size="large"
              disabled={verificationCode.length !== 8 || loading}
              onPress={handleSubmitOTP}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
