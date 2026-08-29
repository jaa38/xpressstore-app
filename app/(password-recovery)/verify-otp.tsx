import { useEffect, useState } from "react";

import { View, Pressable } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { OTPInput } from "@/components/ui/OTPInput";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useVerifyPasswordResetOtp } from "@/hooks/auth/useVerifyPasswordResetOtp";

import { useToast } from "@/hooks/useToast";

import { getApiErrorMessage } from "@/api/errors";

/**
 * ============================================================================
 * VERIFY PASSWORD RESET OTP
 * ============================================================================
 *
 * Step in the password recovery flow.
 *
 * Flow:
 *
 * Forgot Password
 *      ↓
 * Email
 *      ↓
 * Verify 6-digit OTP
 *      ↓
 * Create New Password
 *
 * Mock OTP:
 *
 * 654321
 * ============================================================================
 */

/**
 * ---------------------------------------------------------------------------
 * VALIDATION
 * ---------------------------------------------------------------------------
 */

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtpScreen() {
  /**
   * --------------------------------------------------------------------------
   * MUTATION
   * --------------------------------------------------------------------------
   */

  const verifyOtpMutation = useVerifyPasswordResetOtp();

  /**
   * --------------------------------------------------------------------------
   * TOAST
   * --------------------------------------------------------------------------
   */

  const { showToast } = useToast();

  /**
   * --------------------------------------------------------------------------
   * TIMER
   * --------------------------------------------------------------------------
   */

  const [secondsRemaining, setSecondsRemaining] = useState(600);

  const [canResend, setCanResend] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMS
   * --------------------------------------------------------------------------
   */

  const { email } = useLocalSearchParams<{
    email: string;
  }>();

  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   */

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),

    mode: "onChange",

    defaultValues: {
      otp: "",
    },
  });

  /**
   * --------------------------------------------------------------------------
   * COUNTDOWN
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setCanResend(true);

      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  /**
   * --------------------------------------------------------------------------
   * FORMAT TIMER
   * --------------------------------------------------------------------------
   */

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  /**
   * --------------------------------------------------------------------------
   * VERIFY OTP
   * --------------------------------------------------------------------------
   */

  async function onSubmit(data: VerifyOtpSchema) {
    try {
      await verifyOtpMutation.mutateAsync({
        email,
        otp: data.otp,
      });

      showToast({
        type: "success",

        title: "Code Verified",

        message: "Create your new password.",
      });

      router.replace({
        pathname: ROUTES.NEW_PASSWORD,

        params: {
          email,
        },
      });
    } catch (error) {
      showToast({
        type: "error",

        title: "Verification Failed",

        message: getApiErrorMessage(error),
      });
    }
  }

  /**
   * --------------------------------------------------------------------------
   * RESEND CODE
   * --------------------------------------------------------------------------
   *
   * Resets the local countdown.
   *
   * API/mock resend can be connected here when required.
   * --------------------------------------------------------------------------
   */

  async function handleResendCode() {
    try {
      console.log("Resend OTP");

      /**
       * TODO:
       *
       * Call resend password reset OTP API.
       */

      setSecondsRemaining(600);

      setCanResend(false);
    } catch (error) {
      console.log("Resend OTP Error:", error);
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
          {/* ==================================================================
              TOP
          ================================================================== */}

          <View
            style={{
              marginTop: spacing.lg,

              gap: spacing.lg,
            }}
          >
            {/* ==================================================================
                BACK
            ================================================================== */}

            <Pressable
              onPress={() => router.back()}
              style={{
                width: 44,

                height: 44,

                justifyContent: "center",
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.navigation.active}
              />
            </Pressable>

            {/* ==================================================================
                ICON
            ================================================================== */}

            <View
              style={{
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 72,

                  height: 72,

                  borderRadius: 36,

                  backgroundColor: theme.icon.branding.background,

                  justifyContent: "center",

                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={32}
                  color={theme.icon.branding.icon}
                />
              </View>
            </View>

            {/* ==================================================================
                HEADER
            ================================================================== */}

            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1" color="heading" align="center">
                Verify Code
              </AppText>

              <AppText variant="body" color="secondary" align="center">
                We sent a 6-digit verification code to:
              </AppText>

              <AppText variant="label" color="link" align="center">
                {email ?? "your email address"}
              </AppText>
            </View>

            {/* ==================================================================
                OTP
            ================================================================== */}

            <Controller
              control={control}
              name="otp"
              render={({ field: { value, onChange } }) => (
                <View
                  style={{
                    gap: spacing.sm,
                  }}
                >
                  <OTPInput
                    length={6}
                    value={value}
                    onComplete={(code) => {
                      onChange(code);
                    }}
                  />

                  {errors.otp && (
                    <AppText variant="caption" color="error" align="center">
                      {errors.otp.message}
                    </AppText>
                  )}
                </View>
              )}
            />

            {/* ==================================================================
                TIMER
            ================================================================== */}

            <AppText
              variant="label"
              color={secondsRemaining > 60 ? "secondary" : "warning"}
              align="center"
            >
              Code expires in {formatTime(secondsRemaining)}
            </AppText>

            {/* ==================================================================
                RESEND
            ================================================================== */}

            <View
              style={{
                flexDirection: "row",

                justifyContent: "center",

                alignItems: "center",

                gap: spacing.xs,
              }}
            >
              <AppText variant="bodySmall" color="muted">
                Didn't receive the code?
              </AppText>

              <Pressable disabled={!canResend} onPress={handleResendCode}>
                <AppText variant="label" color={canResend ? "link" : "muted"}>
                  Resend
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* ==================================================================
              BOTTOM
          ================================================================== */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title={
                verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"
              }
              variant="primary"
              size="large"
              disabled={!isValid || verifyOtpMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
