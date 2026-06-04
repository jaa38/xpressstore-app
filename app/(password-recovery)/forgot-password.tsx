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
import { Input } from "@/components/ui/Input";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { sendPasswordResetOtp } from "@/features/auth/api/password-recovery-api";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordSchema) {
    try {
      const response = await sendPasswordResetOtp(data.email);

      if (response.error) {
        throw response.error;
      }

      /**
       * TODO:
       * Call forgot password endpoint
       */

      router.push({
        pathname: ROUTES.VERIFY_OTP,
        params: {
          email: data.email,
        },
      });
    } catch (error) {
      console.log("Reset Password Error:", error);
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
          {/* TOP SECTION */}

          <View
            style={{
              marginTop: spacing.lg,
              gap: spacing.lg,
            }}
          >
            {/* BACK BUTTON */}

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
                color={theme.icon.default.icon}
              />
            </Pressable>

            {/* HEADER */}

            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1" color="heading">
                Forgot Password?
              </AppText>

              <AppText variant="body" color="secondary">
                Enter the email linked to your XpressStore account. We'll send
                you an 8-digit verification code to reset your password.
              </AppText>
            </View>

            {/* EMAIL */}

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* BOTTOM SECTION */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title="Send Reset Code"
              variant="primary"
              size="large"
              disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
            />

            <Pressable
              onPress={() => router.replace(ROUTES.LOGIN)}
              style={{
                alignItems: "center",
                marginTop: spacing.lg,
              }}
            >
              <AppText variant="label" color="link">
                Back to Login
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
