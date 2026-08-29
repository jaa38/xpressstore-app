import { useState } from "react";

import { View, Pressable, Alert } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

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

import { useResetPassword } from "@/hooks/auth/useResetPassword";

import { getApiErrorMessage } from "@/api/errors";

/**
 * ============================================================================
 * CREATE NEW PASSWORD
 * ============================================================================
 *
 * Password recovery flow:
 *
 * Forgot Password
 *       ↓
 * Verify OTP
 *       ↓
 * Create New Password
 *       ↓
 * Login
 * ============================================================================
 */

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export default function NewPasswordScreen() {
  /**
   * --------------------------------------------------------------------------
   * PASSWORD VISIBILITY
   * --------------------------------------------------------------------------
   */

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMS
   * --------------------------------------------------------------------------
   *
   * The email was passed from verify-otp.tsx.
   */

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  /**
   * --------------------------------------------------------------------------
   * RESET PASSWORD MUTATION
   * --------------------------------------------------------------------------
   */

  const resetPassword = useResetPassword();

  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   */

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),

    mode: "onChange",

    defaultValues: {
      password: "",

      confirmPassword: "",
    },
  });

  /**
   * --------------------------------------------------------------------------
   * SUBMIT
   * --------------------------------------------------------------------------
   */

  async function onSubmit(data: NewPasswordSchema) {
    const normalizedEmail = email?.trim();

    /**
     * ------------------------------------------------------------------------
     * EMAIL VALIDATION
     * ------------------------------------------------------------------------
     */

    if (!normalizedEmail) {
      Alert.alert(
        "Reset Password Failed",
        "Your email address is missing. Please restart the password recovery process."
      );

      return;
    }

    try {
      /**
       * ----------------------------------------------------------------------
       * RESET PASSWORD
       * ----------------------------------------------------------------------
       */

      await resetPassword.mutateAsync({
        email: normalizedEmail,

        password: data.password,

        confirmPassword: data.confirmPassword,
      });

      /**
       * ----------------------------------------------------------------------
       * SUCCESS
       * ----------------------------------------------------------------------
       */

      Alert.alert(
        "Password Updated",
        "Your password has been reset successfully.",
        [
          {
            text: "OK",

            onPress: () => {
              router.replace(ROUTES.LOGIN);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Reset Password Failed", getApiErrorMessage(error));
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
                  name="lock-closed-outline"
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
                Create New Password
              </AppText>

              <AppText variant="body" color="secondary" align="center">
                Create a strong password to secure your account.
              </AppText>
            </View>

            {/* ==================================================================
                PASSWORD
            ================================================================== */}

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={theme.icon.default.icon}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            {/* ==================================================================
                CONFIRM PASSWORD
            ================================================================== */}

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  rightIcon={
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color={theme.icon.default.icon}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            {/* ==================================================================
                PASSWORD RULES
            ================================================================== */}

            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodySmall" color="muted">
                • At least 8 characters
              </AppText>

              <AppText variant="bodySmall" color="muted">
                • One uppercase letter
              </AppText>

              <AppText variant="bodySmall" color="muted">
                • One lowercase letter
              </AppText>

              <AppText variant="bodySmall" color="muted">
                • One number
              </AppText>

              <AppText variant="bodySmall" color="muted">
                • One special character
              </AppText>
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
              title={resetPassword.isPending ? "Updating..." : "Reset Password"}
              variant="primary"
              size="large"
              disabled={!isValid || resetPassword.isPending}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
