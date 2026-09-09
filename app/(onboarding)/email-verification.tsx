import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";

import { useCallback, useState } from "react";

import { Link, router, useLocalSearchParams } from "expo-router";

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

const OTP_LENGTH = 6;

const EMAIL_VERIFICATION_PROGRESS = 16.67;

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
   * VERIFY EMAIL
   * --------------------------------------------------------------------------
   */

  const handleSubmitOTP = useCallback(
    async (code?: string) => {
      /**
       * Prevent duplicate verification requests.
       */

      if (verifyEmailOtp.isPending) {
        return;
      }

      const normalizedEmail = email?.trim();

      const normalizedCode = (code ?? verificationCode)
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);

      /**
       * ----------------------------------------------------------------------
       * VALIDATE EMAIL
       * ----------------------------------------------------------------------
       */

      if (!normalizedEmail) {
        Alert.alert(
          "Verification Failed",
          "Your email address is missing. Please return to signup and try again."
        );

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * VALIDATE OTP
       * ----------------------------------------------------------------------
       */

      if (!normalizedCode) {
        Alert.alert(
          "Verification Code Required",
          "Please enter the verification code sent to your email."
        );

        return;
      }

      if (normalizedCode.length !== OTP_LENGTH) {
        Alert.alert(
          "Invalid Verification Code",
          `Please enter the ${OTP_LENGTH}-digit verification code.`
        );

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * DISMISS KEYBOARD
       * ----------------------------------------------------------------------
       */

      Keyboard.dismiss();

      /**
       * ----------------------------------------------------------------------
       * VERIFY OTP
       * ----------------------------------------------------------------------
       */

      try {
        await verifyEmailOtp.mutateAsync({
          email: normalizedEmail,
          otp: normalizedCode,
        });

        /**
         * --------------------------------------------------------------------
         * EMAIL VERIFIED
         * --------------------------------------------------------------------
         *
         * The VerifyUserEmail endpoint returns an authenticated session.
         * The hook persists the JWT, refresh token and user before continuing.
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
    },
    [email, verificationCode, verifyEmailOtp]
  );

  /**
   * --------------------------------------------------------------------------
   * OTP COMPLETE
   * --------------------------------------------------------------------------
   *
   * Automatically verify once all OTP digits have been entered.
   */

  const handleOTPComplete = useCallback(
    (code: string) => {
      setVerificationCode(code);

      if (code.length === OTP_LENGTH) {
        handleSubmitOTP(code);
      }
    },
    [handleSubmitOTP]
  );

  /**
   * --------------------------------------------------------------------------
   * RESEND OTP
   * --------------------------------------------------------------------------
   */

  const handleResendOTP = useCallback(async () => {
    const normalizedEmail = email?.trim();

    /**
     * Prevent duplicate resend requests.
     */

    if (resendOtp.isPending || verifyEmailOtp.isPending) {
      return;
    }

    /**
     * Validate email.
     */

    if (!normalizedEmail) {
      Alert.alert(
        "Unable to Resend",
        "Your email address is missing. Please return to signup and try again."
      );

      return;
    }

    try {
      await resendOtp.mutateAsync(normalizedEmail);

      /**
       * Clear the previous OTP.
       *
       * OTPInput receives verificationCode through its value prop,
       * so all visible OTP fields will reset.
       */

      setVerificationCode("");

      Alert.alert(
        "OTP Sent",
        "A new verification code has been sent to your email address."
      );
    } catch (error) {
      Alert.alert("Resend Failed", getApiErrorMessage(error));
    }
  }, [email, resendOtp, verifyEmailOtp.isPending]);

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

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
                    disabled={verifyEmailOtp.isPending}
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
                    now: EMAIL_VERIFICATION_PROGRESS,
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
                  <ProgressBar progress={EMAIL_VERIFICATION_PROGRESS} />
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
                  <OTPInput
                    length={OTP_LENGTH}
                    value={verificationCode}
                    onChange={setVerificationCode}
                    onComplete={handleOTPComplete}
                  />
                </View>

                {/* VERIFYING STATUS */}

                {verifyEmailOtp.isPending && (
                  <AppText
                    variant="bodySmall"
                    color="muted"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Verifying your email...
                  </AppText>
                )}

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
                    accessibilityHint="Sends a new verification code to your email"
                    accessibilityState={{
                      disabled: resendOtp.isPending || verifyEmailOtp.isPending,
                    }}
                    disabled={resendOtp.isPending || verifyEmailOtp.isPending}
                    onPress={handleResendOTP}
                  >
                    <AppText
                      variant="label"
                      color={
                        resendOtp.isPending || verifyEmailOtp.isPending
                          ? "muted"
                          : "link"
                      }
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
                paddingTop: spacing.md,
                paddingBottom: spacing.lg,
              }}
            >
              <Button
                title={
                  verifyEmailOtp.isPending ? "Verifying..." : "Verify Email"
                }
                variant="primary"
                size="large"
                disabled={
                  verificationCode.length !== OTP_LENGTH ||
                  verifyEmailOtp.isPending
                }
                onPress={() => handleSubmitOTP()}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
