import { Alert, Pressable, View } from "react-native";

import { useState } from "react";

import { Link, router, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useUpdatePassword } from "@/hooks/auth/useUpdatePassword";

import { getApiErrorMessage } from "@/api/errors";

/**
 * ============================================================================
 * PASSWORD SCHEMA
 * ============================================================================
 */

const passwordSchema = z
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

type PasswordSchema = z.infer<typeof passwordSchema>;

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
 * PASSWORD SCREEN
 * ============================================================================
 */

export default function PasswordScreen() {
  /**
   * --------------------------------------------------------------------------
   * EMAIL
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

  const [showPassword, setShowPassword] = useState(false);

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
    formState: { errors, isValid },
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),

    mode: "onChange",

    defaultValues: {
      password: "",

      confirmPassword: "",
    },
  });

  /**
   * --------------------------------------------------------------------------
   * MUTATION
   * --------------------------------------------------------------------------
   */

  const updatePassword = useUpdatePassword();

  /**
   * --------------------------------------------------------------------------
   * PASSWORD RULES
   * --------------------------------------------------------------------------
   */

  const password = watch("password") || "";

  const passwordRules = {
    minLength: password.length >= 8,

    uppercase: /[A-Z]/.test(password),

    lowercase: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[^A-Za-z0-9]/.test(password),
  };

  /**
   * --------------------------------------------------------------------------
   * SUBMIT
   * --------------------------------------------------------------------------
   */

  async function onSubmit(data: PasswordSchema) {
    const normalizedEmail = email?.trim();

    if (!normalizedEmail) {
      Alert.alert(
        "Missing Email",
        "Your email address is missing. Please return to email verification."
      );

      return;
    }

    try {
      await updatePassword.mutateAsync({
        email: normalizedEmail,

        password: data.password,

        confirmPassword: data.confirmPassword,
      });

      router.replace(ROUTES.BUSINESS_DETAILS);
    } catch (error) {
      Alert.alert("Password Setup Failed", getApiErrorMessage(error));
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
              <Link href={ROUTES.EMAIL_VERIFICATION} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  hitSlop={8}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={theme.icon.default.icon}
                  />
                </Pressable>
              </Link>

              <View
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel="Password setup progress"
                accessibilityValue={{
                  min: 0,

                  max: 100,

                  now: 50,
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
                <ProgressBar progress={50} />
              </View>

              <AppText variant="bodySmall" color="muted">
                Step 3 of 6
              </AppText>
            </View>

            {/* CONTENT */}

            <View
              style={{
                marginTop: spacing.lg,

                gap: spacing.lg,
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
                  Create your password
                </AppText>

                <AppText variant="body" color="secondary">
                  Create a secure password for your XpressStore account.
                </AppText>
              </View>

              {/* EMAIL */}

              {email ? (
                <View
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    gap: spacing.sm,

                    padding: spacing.md,

                    borderRadius: 12,

                    backgroundColor: theme.background.subtle,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.icon.branding.icon}
                  />

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    numberOfLines={1}
                  >
                    {email}
                  </AppText>
                </View>
              ) : null}

              {/* PASSWORD */}

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    rightIcon={
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          showPassword ? "Hide password" : "Show password"
                        }
                        hitSlop={8}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color={theme.icon.default.icon}
                        />
                      </Pressable>
                    }
                  />
                )}
              />

              {/* RULES */}

              <View
                accessible
                accessibilityLabel="Password requirements"
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="caption" color="muted">
                  Password must contain:
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

                <PasswordRule passed={passwordRules.number} text="One number" />

                <PasswordRule
                  passed={passwordRules.special}
                  text="One special character"
                />
              </View>

              {/* CONFIRM PASSWORD */}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                    rightIcon={
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        hitSlop={8}
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
                updatePassword.isPending ? "Creating Password..." : "Continue"
              }
              variant="primary"
              size="large"
              disabled={!isValid || updatePassword.isPending}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
