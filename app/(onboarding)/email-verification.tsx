import { Alert, Pressable, View } from "react-native";

import { useLocalSearchParams, Link, router } from "expo-router";

import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { Button } from "@/components/ui/Button";

import { OTPInput } from "@/components/ui/OTPInput";

import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useVerifyEmailOtp } from "@/hooks/auth/useVerifyEmailOtp";

import { useResendOtp } from "@/hooks/auth/useResendOtp";

import { getApiErrorMessage } from "@/api/errors";

export default function EmailVerificationScreen() {
  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMETERS
   * --------------------------------------------------------------------------
   */

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  /**
   * --------------------------------------------------------------------------
   * STATE
   * --------------------------------------------------------------------------
   */

  const [verificationCode, setVerificationCode] = useState("");

  /**
   * --------------------------------------------------------------------------
   * MUTATIONS
   * --------------------------------------------------------------------------
   */

  const verifyEmailOtp = useVerifyEmailOtp();

  const resendOtp = useResendOtp();

  /**
   * --------------------------------------------------------------------------
   * OTP
   * --------------------------------------------------------------------------
   */

  function handleVerify(code: string) {
    setVerificationCode(code);
  }

  /**
   * --------------------------------------------------------------------------
   * VERIFY EMAIL
   * --------------------------------------------------------------------------
   */

  async function handleSubmitOTP() {
    const normalizedEmail = email?.trim();

    if (!normalizedEmail) {
      Alert.alert(
        "Verification Failed",
        "Your email address is missing. Please return to signup and try again."
      );

      return;
    }

    if (!verificationCode.trim()) {
      Alert.alert(
        "Verification Code Required",
        "Please enter the verification code sent to your email."
      );

      return;
    }

    try {
      await verifyEmailOtp.mutateAsync({
        email: normalizedEmail,

        otp: verificationCode.trim(),
      });

      /**
       * -----------------------------------------------------------------------
       * EMAIL VERIFIED
       * -----------------------------------------------------------------------
       *
       * The VerifyUserEmail endpoint returns an authenticated session.
       * The hook persists the JWT, refresh token and user before we continue.
       */

      router.replace({
        pathname: ROUTES.PASSWORD,
        params: {
          email: normalizedEmail,
        },
      });
    } catch (error) {
      Alert.alert("Verification Failed", getApiErrorMessage(error));
    }
  }

  /**
   * --------------------------------------------------------------------------
   * RESEND OTP
   * --------------------------------------------------------------------------
   */

  async function handleResendOTP() {
    const normalizedEmail = email?.trim();

    if (!normalizedEmail) {
      Alert.alert(
        "Unable to Resend",
        "Your email address is missing. Please return to signup and try again."
      );

      return;
    }

    try {
      await resendOtp.mutateAsync(normalizedEmail);

      Alert.alert(
        "OTP Sent",
        "A new verification code has been sent to your email address."
      );
    } catch (error) {
      Alert.alert("Resend Failed", getApiErrorMessage(error));
    }
  }

  /**
   * --------------------------------------------------------------------------
   * SCREEN
   * --------------------------------------------------------------------------
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
        <View
          style={{
            flex: 1,

            justifyContent: "space-between",
          }}
        >
          {/* ================================================================
              TOP SECTION
          ================================================================= */}

          <View>
            {/* ==============================================================
                HEADER
            =============================================================== */}

            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                gap: spacing.sm,

                justifyContent: "space-between",
              }}
            >
              {/* BACK */}

              <Link href={ROUTES.SIGNUP} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  accessibilityHint="Returns to the signup screen"
                  hitSlop={8}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={theme.icon.default.icon}
                  />
                </Pressable>
              </Link>

              {/* PROGRESS */}

              <View
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel="Email verification progress"
                accessibilityValue={{
                  min: 0,
                  max: 100,
                  now: 33.33,
                }}
                style={{
                  flex: 1,

                  height: 8,

                  backgroundColor: theme.divider.default,

                  borderRadius: 999,

                  overflow: "hidden",

                  marginHorizontal: spacing.sm,
                }}
              >
                <ProgressBar progress={16.67} />
              </View>

              {/* STEP */}

              <AppText variant="bodySmall" color="muted">
                Step 1 of 6
              </AppText>
            </View>

            {/* ==============================================================
                CONTENT
            =============================================================== */}

            <View
              style={{
                marginTop: spacing.xl,

                gap: spacing.xl,
              }}
            >
              {/* TITLE */}

              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText
                  accessibilityRole="header"
                  variant="h1"
                  color="heading"
                >
                  Verify your email
                </AppText>

                <AppText variant="body" color="secondary">
                  Enter the verification code we sent to your email address.
                </AppText>
              </View>

              {/* EMAIL */}

              <View
                style={{
                  padding: spacing.md,

                  borderRadius: 12,

                  backgroundColor: theme.background.subtle,

                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={theme.icon.branding.icon}
                />

                <AppText
                  variant="bodyBold"
                  style={{
                    marginTop: spacing.xs,

                    textAlign: "center",
                  }}
                >
                  {email || "your email address"}
                </AppText>
              </View>

              {/* OTP */}

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <OTPInput onComplete={handleVerify} />
              </View>

              {/* RESEND */}

              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "center",

                  alignItems: "center",

                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodySmall" color="muted">
                  Didn't receive OTP?
                </AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Resend OTP"
                  disabled={resendOtp.isPending}
                  onPress={handleResendOTP}
                >
                  <AppText
                    variant="label"
                    color={resendOtp.isPending ? "muted" : "link"}
                  >
                    {resendOtp.isPending ? "Sending..." : "Resend OTP"}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ================================================================
              BOTTOM SECTION
          ================================================================= */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title={verifyEmailOtp.isPending ? "Verifying..." : "Verify Email"}
              variant="primary"
              size="large"
              disabled={!verificationCode.trim() || verifyEmailOtp.isPending}
              onPress={handleSubmitOTP}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
