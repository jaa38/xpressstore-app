import { useEffect, useState } from "react";

import { View, Pressable } from "react-native";

import { router } from "expo-router";

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

import { useLocalSearchParams } from "expo-router";

import { verifyPasswordResetOtp } from "@/features/auth/api/password-recovery-api";

const verifyOtpSchema = z.object({
  otp: z.string().length(8, "Verification code must be 8 digits"),
});

type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtpScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const [secondsRemaining, setSecondsRemaining] = useState(600);

  const [canResend, setCanResend] = useState(false);

  const { email } = useLocalSearchParams<{
    email: string;
  }>();

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

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  async function onSubmit(data: VerifyOtpSchema) {
    try {
      setIsLoading(true);

      const response = await verifyPasswordResetOtp(email, data.otp);

      if (response.error) {
        throw response.error;
      }

      /**
       * TODO:
       * Verify OTP API
       */

      router.replace({
        pathname: ROUTES.NEW_PASSWORD,

        params: {
          email,
        },
      });
    } catch (error) {
      console.log("Verify OTP Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    try {
      console.log("Resend OTP");

      /**
       * TODO:
       * Call resend OTP API
       */

      setSecondsRemaining(600);

      setCanResend(false);
    } catch (error) {
      console.log("Resend OTP Error:", error);
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
          {/* TOP */}

          <View
            style={{
              marginTop: spacing.lg,
              gap: spacing.lg,
            }}
          >
            {/* BACK */}

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

            {/* ICON */}

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

            {/* HEADER */}

            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1" color="heading" align="center">
                Verify Code
              </AppText>

              <AppText variant="body" color="secondary" align="center">
                We sent an 8-digit verification code to:
              </AppText>

              <AppText variant="label" color="link" align="center">
                {email ?? "your email address"}
              </AppText>
            </View>

            {/* OTP */}

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
                    length={8}
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

            {/* TIMER */}

            <AppText
              variant="label"
              color={secondsRemaining > 60 ? "secondary" : "warning"}
              align="center"
            >
              Code expires in {formatTime(secondsRemaining)}
            </AppText>

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
                Didn't receive the code?
              </AppText>

              <Pressable disabled={!canResend} onPress={handleResendCode}>
                <AppText variant="label" color={canResend ? "link" : "muted"}>
                  Resend
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* BOTTOM */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title={isLoading ? "Verifying..." : "Verify Code"}
              variant="primary"
              size="large"
              disabled={!isValid || isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
