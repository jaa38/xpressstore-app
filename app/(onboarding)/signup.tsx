import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import {
  signupSchema,
  SignupSchema,
} from "@/schemas/signup-schema";

import { useRegister } from "@/hooks/auth/useRegister";

import { getApiErrorMessage } from "@/api/errors";

/**
 * ============================================================================
 * SIGNUP SCREEN
 * ============================================================================
 *
 * Step 1 of the merchant onboarding flow.
 *
 * The Xpress SSO API requires:
 *
 * - email
 * - firstName
 * - lastName
 * - phoneNumber
 *
 * Password is NOT collected at this stage.
 * Password creation is handled separately through the
 * UpdateUserPassword endpoint after email verification.
 * ============================================================================
 */

const SIGNUP_PROGRESS = 16.67;

export default function SignupScreen() {
  /**
   * --------------------------------------------------------------------------
   * FORM
   * --------------------------------------------------------------------------
   */

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isValid,
    },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),

    mode: "onChange",

    defaultValues: {
      firstName: "",

      lastName: "",

      email: "",

      phoneNumber: "",
    },
  });

  /**
   * --------------------------------------------------------------------------
   * REGISTER MUTATION
   * --------------------------------------------------------------------------
   */

  const register = useRegister();

  /**
   * --------------------------------------------------------------------------
   * SUBMIT
   * --------------------------------------------------------------------------
   */

  async function onSubmit(data: SignupSchema) {
    try {
      await register.mutateAsync({
        email: data.email.trim(),

        firstName: data.firstName.trim(),

        lastName: data.lastName.trim(),

        phoneNumber: data.phoneNumber.trim(),
      });

      Alert.alert(
        "Check Your Email",
        "We've sent a verification code to your email address."
      );

      router.push({
        pathname: ROUTES.EMAIL_VERIFICATION,

        params: {
          email: data.email.trim(),
        },
      });
    } catch (error) {
      Alert.alert(
        "Sign Up Failed",
        getApiErrorMessage(error)
      );
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
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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

                <Link
                  href={ROUTES.WELCOME}
                  asChild
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    accessibilityHint="Returns to the welcome screen"
                    accessibilityState={{
                      disabled: register.isPending,
                    }}
                    disabled={register.isPending}
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
                  accessibilityLabel="Signup progress"
                  accessibilityValue={{
                    min: 0,
                    max: 100,
                    now: SIGNUP_PROGRESS,
                  }}
                  style={{
                    flex: 1,
                    height: 8,
                    backgroundColor:
                      theme.divider.default,
                    borderRadius: 999,
                    overflow: "hidden",
                    marginHorizontal: spacing.sm,
                  }}
                >
                  <ProgressBar
                    progress={SIGNUP_PROGRESS}
                  />
                </View>

                {/* STEP */}

                <AppText
                  variant="bodySmall"
                  color="muted"
                >
                  Step 1 of 6
                </AppText>
              </View>

              {/* ==============================================================
                  CONTENT
              =============================================================== */}

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
                    Create your Account
                  </AppText>

                  <AppText
                    variant="body"
                    color="secondary"
                  >
                    Enter your details to get started.
                  </AppText>
                </View>

                {/* ============================================================
                    FIRST NAME
                ============================================================ */}

                <Controller
                  control={control}
                  name="firstName"
                  render={({
                    field: {
                      onChange,
                      value,
                    },
                  }) => (
                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      error={
                        errors.firstName?.message
                      }
                    />
                  )}
                />

                {/* ============================================================
                    LAST NAME
                ============================================================ */}

                <Controller
                  control={control}
                  name="lastName"
                  render={({
                    field: {
                      onChange,
                      value,
                    },
                  }) => (
                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      error={
                        errors.lastName?.message
                      }
                    />
                  )}
                />

                {/* ============================================================
                    EMAIL
                ============================================================ */}

                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: {
                      onChange,
                      value,
                    },
                  }) => (
                    <Input
                      label="Email Address"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      error={
                        errors.email?.message
                      }
                    />
                  )}
                />

                {/* ============================================================
                    PHONE NUMBER
                ============================================================ */}

                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({
                    field: {
                      onChange,
                      value,
                    },
                  }) => (
                    <Input
                      label="Phone Number"
                      placeholder="+234 801 234 5678"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      error={
                        errors.phoneNumber?.message
                      }
                    />
                  )}
                />
              </View>
            </View>

            {/* ================================================================
                BOTTOM SECTION
            ================================================================= */}

            <View
              style={{
                paddingTop: spacing.xl,
              }}
            >
              {/* ============================================================
                  CONTINUE
              ============================================================ */}

              <Button
                title={
                  register.isPending
                    ? "Creating Account..."
                    : "Get Started"
                }
                variant="primary"
                size="large"
                disabled={
                  !isValid ||
                  register.isPending
                }
                onPress={handleSubmit(onSubmit)}
              />

              {/* ============================================================
                  LOGIN
              ============================================================ */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: spacing.xs,
                  marginTop: spacing.lg,
                }}
              >
                <AppText
                  variant="bodySmall"
                  color="muted"
                >
                  Already have an account?
                </AppText>

                <Link
                  href={ROUTES.LOGIN}
                  asChild
                >
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Login"
                    accessibilityHint="Go to login screen"
                    disabled={register.isPending}
                  >
                    <AppText
                      variant="label"
                      color={
                        register.isPending
                          ? "muted"
                          : "link"
                      }
                    >
                      Login
                    </AppText>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}