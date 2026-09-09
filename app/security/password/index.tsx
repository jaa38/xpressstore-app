import { useState } from "react";

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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

import { useChangePassword } from "@/hooks/auth/useChangePassword";

import { getApiErrorMessage } from "@/api/errors";

/**
 * ============================================================================
 * CHANGE PASSWORD SCHEMA
 * ============================================================================
 */

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    path: ["newPassword"],

    message: "Your new password must be different from your current password",
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],

    message: "Passwords do not match",
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

/**
 * ============================================================================
 * PASSWORD RULE
 * ============================================================================
 */

function PasswordRule({ passed, text }: { passed: boolean; text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",

        alignItems: "center",

        gap: spacing.xs,
      }}
    >
      <Ionicons
        name={passed ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={passed ? theme.icon.success.icon : theme.text.muted}
      />

      <AppText variant="caption" color={passed ? "success" : "muted"}>
        {text}
      </AppText>
    </View>
  );
}

/**
 * ============================================================================
 * PASSWORD VISIBILITY BUTTON
 * ============================================================================
 */

interface PasswordVisibilityButtonProps {
  visible: boolean;

  onPress: () => void;

  passwordLabel: string;
}

function PasswordVisibilityButton({
  visible,
  onPress,
  passwordLabel,
}: PasswordVisibilityButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        visible ? `Hide ${passwordLabel}` : `Show ${passwordLabel}`
      }
      hitSlop={8}
      onPress={onPress}
    >
      <Ionicons
        name={visible ? "eye-off-outline" : "eye-outline"}
        size={20}
        color={theme.icon.default.icon}
      />
    </Pressable>
  );
}

/**
 * ============================================================================
 * CHANGE PASSWORD SCREEN
 * ============================================================================
 */

export default function ChangePasswordScreen() {
  /**
   * --------------------------------------------------------------------------
   * PASSWORD VISIBILITY
   * --------------------------------------------------------------------------
   */

  const [showOldPassword, setShowOldPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   */

  const {
    control,

    watch,

    handleSubmit,

    reset,

    formState: { errors, isValid },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),

    mode: "onChange",

    defaultValues: {
      oldPassword: "",

      newPassword: "",

      confirmPassword: "",
    },
  });

  /**
   * --------------------------------------------------------------------------
   * MUTATION
   * --------------------------------------------------------------------------
   */

  const changePassword = useChangePassword();

  /**
   * --------------------------------------------------------------------------
   * PASSWORD RULES
   * --------------------------------------------------------------------------
   */

  const newPassword = watch("newPassword") || "";

  const passwordRules = {
    minLength: newPassword.length >= 8,

    uppercase: /[A-Z]/.test(newPassword),

    lowercase: /[a-z]/.test(newPassword),

    number: /[0-9]/.test(newPassword),

    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  /**
   * --------------------------------------------------------------------------
   * SUBMIT
   * --------------------------------------------------------------------------
   */

  async function onSubmit(data: ChangePasswordSchema) {
    try {
      Keyboard.dismiss();

      await changePassword.mutateAsync({
        oldPassword: data.oldPassword,

        newPassword: data.newPassword,
      });

      /**
       * Clear sensitive password values immediately after success.
       */

      reset();

      Alert.alert(
        "Password Updated",
        "Your password has been changed successfully.",
        [
          {
            text: "OK",

            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Change Password Failed", getApiErrorMessage(error));
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

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
            }}
          >
            {/* ================================================================
                SCROLLABLE CONTENT
            ================================================================= */}

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,

                paddingTop: spacing.lg,

                paddingBottom: spacing.xl,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* ==============================================================
                  BACK BUTTON
              ============================================================== */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={8}
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

              {/* ==============================================================
                  SECURITY ICON
              ============================================================== */}

              <View
                style={{
                  alignItems: "center",

                  marginTop: spacing.md,
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

              {/* ==============================================================
                  HEADER
              ============================================================== */}

              <View
                style={{
                  marginTop: spacing.lg,

                  gap: spacing.xs,
                }}
              >
                <AppText
                  accessibilityRole="header"
                  variant="h1"
                  color="heading"
                  align="center"
                >
                  Change Password
                </AppText>

                <AppText variant="body" color="secondary" align="center">
                  Update your password to keep your XpressStore account secure.
                </AppText>
              </View>

              {/* ==============================================================
                  FORM
              ============================================================== */}

              <View
                style={{
                  marginTop: spacing.xl,

                  gap: spacing.lg,
                }}
              >
                {/* ============================================================
                    CURRENT PASSWORD
                ============================================================ */}

                <Controller
                  control={control}
                  name="oldPassword"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      label="Current Password"
                      placeholder="Enter your current password"
                      secureTextEntry={!showOldPassword}
                      value={value}
                      onChangeText={onChange}
                      error={errors.oldPassword?.message}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="current-password"
                      textContentType="password"
                      rightIcon={
                        <PasswordVisibilityButton
                          visible={showOldPassword}
                          passwordLabel="current password"
                          onPress={() =>
                            setShowOldPassword((previous) => !previous)
                          }
                        />
                      }
                    />
                  )}
                />

                {/* ============================================================
                    NEW PASSWORD
                ============================================================ */}

                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      label="New Password"
                      placeholder="Enter your new password"
                      secureTextEntry={!showNewPassword}
                      value={value}
                      onChangeText={onChange}
                      error={errors.newPassword?.message}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      rightIcon={
                        <PasswordVisibilityButton
                          visible={showNewPassword}
                          passwordLabel="new password"
                          onPress={() =>
                            setShowNewPassword((previous) => !previous)
                          }
                        />
                      }
                    />
                  )}
                />

                {/* ============================================================
                    PASSWORD REQUIREMENTS
                ============================================================ */}

                <View
                  accessible
                  accessibilityLabel="New password requirements"
                  style={{
                    gap: spacing.xs,

                    padding: spacing.md,

                    borderRadius: 12,

                    backgroundColor: theme.background.subtle,
                  }}
                >
                  <AppText variant="caption" color="secondary">
                    Your new password must contain:
                  </AppText>

                  <PasswordRule
                    passed={passwordRules.minLength}
                    text="At least 8 characters"
                  />

                  <PasswordRule
                    passed={passwordRules.uppercase}
                    text="One uppercase letter"
                  />

                  <PasswordRule
                    passed={passwordRules.lowercase}
                    text="One lowercase letter"
                  />

                  <PasswordRule
                    passed={passwordRules.number}
                    text="One number"
                  />

                  <PasswordRule
                    passed={passwordRules.special}
                    text="One special character"
                  />
                </View>

                {/* ============================================================
                    CONFIRM NEW PASSWORD
                ============================================================ */}

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      label="Confirm New Password"
                      placeholder="Confirm your new password"
                      secureTextEntry={!showConfirmPassword}
                      value={value}
                      onChangeText={onChange}
                      error={errors.confirmPassword?.message}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      rightIcon={
                        <PasswordVisibilityButton
                          visible={showConfirmPassword}
                          passwordLabel="confirmed password"
                          onPress={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                        />
                      }
                    />
                  )}
                />
              </View>
            </ScrollView>

            {/* ================================================================
                BOTTOM ACTION
            ================================================================= */}

            <View
              style={{
                paddingHorizontal: spacing.lg,

                paddingTop: spacing.md,

                paddingBottom: spacing.lg,

                backgroundColor: theme.background.primary,

                borderTopWidth: 1,

                borderTopColor: theme.divider.subtle,
              }}
            >
              <Button
                title="Update Password"
                variant="primary"
                size="large"
                disabled={!isValid || changePassword.isPending}
                loading={changePassword.isPending}
                onPress={handleSubmit(onSubmit)}
                style={{
                  width: "100%",
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}