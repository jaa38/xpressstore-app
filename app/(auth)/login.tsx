import { useEffect, useState } from "react";

import { Alert, Pressable, View } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/providers/AuthProvider";

import { LoginSchema, loginSchema } from "@/schemas/login-schema";

import {
  authenticateWithBiometrics,
  BiometricAvailability,
  BiometricType,
  getBiometricAvailability,
} from "@/services/biometrics";

import {
  disableBiometrics,
  isBiometricsEnabled,
} from "@/services/biometrics/storage";

import {
  clearBiometricEmail,
  getBiometricEmail,
  saveBiometricEmail,
} from "@/services/biometrics/user";

import { AppText } from "@/components/ui/AppText";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { getAccessToken, getCurrentUser } from "@/storage/authStorage";

import { useLogin } from "@/hooks/auth/useLogin";

import { getApiErrorMessage } from "@/api/errors";

import { AuthUser } from "@/types/auth";

/**
 * ============================================================================
 * LOGIN SCREEN
 * ============================================================================
 */

export default function LoginScreen() {
  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [showPassword, setShowPassword] = useState(false);

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const [biometricAvailability, setBiometricAvailability] =
    useState<BiometricAvailability | null>(null);

  const [loadingBiometric, setLoadingBiometric] = useState(false);

  const [biometricEmail, setBiometricEmail] = useState("");

  /**
   * ==========================================================================
   * AUTH
   * ==========================================================================
   */

  const { login: loginUser } = useAuth();

  const loginMutation = useLogin();

  /**
   * ==========================================================================
   * LOAD BIOMETRIC SETTINGS
   * ==========================================================================
   */

  useEffect(() => {
    void checkBiometrics();
  }, []);

  async function checkBiometrics() {
    try {
      const [enabled, availability, email, token, user] = await Promise.all([
        isBiometricsEnabled(),

        getBiometricAvailability(),

        getBiometricEmail(),

        getAccessToken(),

        getCurrentUser<AuthUser>(),
      ]);

      setBiometricAvailability(availability);

      /**
       * Biometrics should only be shown when:
       *
       * 1. The user enabled biometrics.
       * 2. Biometrics are available on the device.
       * 3. A biometric email exists.
       * 4. A valid stored authentication session exists.
       */

      const hasValidSession = !!token && !!user;

      const shouldShowBiometrics =
        enabled && availability.available && !!email && hasValidSession;

      /**
       * If biometric settings exist but the
       * authentication session no longer exists,
       * remove the stale biometric configuration.
       */

      if (enabled && email && !hasValidSession) {
        console.log("LOGIN → STALE BIOMETRIC SESSION DETECTED");

        await Promise.all([disableBiometrics(), clearBiometricEmail()]);
      }

      setBiometricsEnabled(shouldShowBiometrics);

      if (shouldShowBiometrics && email) {
        setBiometricEmail(email);
      } else {
        setBiometricEmail("");
      }
    } catch (error) {
      console.error("Unable to check biometric settings:", error);

      setBiometricsEnabled(false);

      setBiometricEmail("");
    }
  }

  /**
   * ==========================================================================
   * BIOMETRIC TYPE
   * ==========================================================================
   */

  const biometricType: BiometricType | "none" =
    biometricAvailability?.type ?? "none";

  /**
   * ==========================================================================
   * BIOMETRIC NAME
   * ==========================================================================
   */

  function getBiometricName() {
    switch (biometricType) {
      case "face":
        return "Face ID";

      case "fingerprint":
        return "Fingerprint";

      case "iris":
        return "Iris Recognition";

      case "biometric":
        return "Biometrics";

      default:
        return "Biometrics";
    }
  }

  /**
   * ==========================================================================
   * BIOMETRIC ICON
   * ==========================================================================
   */

  function getBiometricIcon() {
    switch (biometricType) {
      case "face":
        return "scan-circle-outline";

      case "iris":
        return "eye-outline";

      case "fingerprint":
      case "biometric":
      default:
        return "finger-print-outline";
    }
  }

  /**
   * ==========================================================================
   * BIOMETRIC UNLOCK
   * ==========================================================================
   *
   * Biometrics do not create a new authentication session.
   *
   * They unlock the existing securely stored session:
   *
   * 1. Authenticate the device owner.
   * 2. Read the stored access token and user.
   * 3. Restore the user into AuthProvider.
   * 4. Navigate into the authenticated application.
   */

  async function handleBiometricUnlock() {
    if (loadingBiometric) {
      return;
    }

    try {
      setLoadingBiometric(true);

      /**
       * ----------------------------------------------------------------------
       * AUTHENTICATE WITH DEVICE BIOMETRICS
       * ----------------------------------------------------------------------
       */

      const result = await authenticateWithBiometrics({
        promptMessage: "Sign in to XpressStore",
      });

      /**
       * ----------------------------------------------------------------------
       * AUTHENTICATION FAILED / CANCELLED
       * ----------------------------------------------------------------------
       */

      if (!result.success) {
        if (result.message !== "Authentication cancelled.") {
          Alert.alert("Authentication Failed", result.message);
        }

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * RESTORE STORED SESSION
       * ----------------------------------------------------------------------
       *
       * Biometrics only unlock the existing session.
       * No API login or refresh-token request is made here.
       */

      const [token, user] = await Promise.all([
        getAccessToken(),

        getCurrentUser<AuthUser>(),
      ]);

      /**
       * ----------------------------------------------------------------------
       * SESSION NOT AVAILABLE
       * ----------------------------------------------------------------------
       *
       * The biometric configuration can remain after
       * the stored authentication session has been cleared.
       *
       * In that situation biometrics are no longer valid
       * for this account and must be disabled.
       */

      if (!token || !user) {
        console.log("BIOMETRIC UNLOCK → SESSION NOT AVAILABLE");

        await Promise.all([disableBiometrics(), clearBiometricEmail()]);

        setBiometricsEnabled(false);

        setBiometricEmail("");

        Alert.alert(
          "Session Expired",
          "Your previous session is no longer available. Please sign in with your email and password."
        );

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * RESTORE AUTH USER
       * ----------------------------------------------------------------------
       *
       * AuthProvider deliberately keeps a stored session locked
       * until the user explicitly authenticates.
       *
       * Successful biometric authentication unlocks that
       * existing stored session.
       */

      await loginUser(user);

      /**
       * ----------------------------------------------------------------------
       * NAVIGATE INTO APP
       * ----------------------------------------------------------------------
       */

      router.replace(ROUTES.TABS);
    } catch (error) {
      console.error("Biometric unlock failed:", error);

      Alert.alert(
        "Unable to Sign In",
        "Please sign in with your email and password."
      );
    } finally {
      setLoadingBiometric(false);
    }
  }

  /**
   * ==========================================================================
   * FORM
   * ==========================================================================
   */

  const {
    control,

    handleSubmit,

    formState: { errors, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),

    mode: "onChange",

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * ==========================================================================
   * PASSWORD LOGIN
   * ==========================================================================
   */

  async function onSubmit(data: LoginSchema) {
    try {
      const session = await loginMutation.mutateAsync({
        email: data.email,

        password: data.password,
      });

      /**
       * ----------------------------------------------------------------------
       * SAVE BIOMETRIC DISPLAY EMAIL
       * ----------------------------------------------------------------------
       */

      await saveBiometricEmail(data.email);

      /**
       * ----------------------------------------------------------------------
       * UPDATE AUTH CONTEXT
       * ----------------------------------------------------------------------
       */

      await loginUser(session.user);

      /**
       * ----------------------------------------------------------------------
       * NAVIGATE INTO APP
       * ----------------------------------------------------------------------
       */

      router.replace(ROUTES.TABS);
    } catch (error) {
      Alert.alert("Login Failed", getApiErrorMessage(error));
    }
  }

  /**
   * ==========================================================================
   * SCREEN
   * ==========================================================================
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
          <View>
            <View
              style={{
                marginTop: spacing.lg,

                gap: spacing.lg,
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h1" color="heading">
                  Welcome Back
                </AppText>

                <AppText variant="body" color="secondary">
                  Sign in to manage your store.
                </AppText>
              </View>

              {biometricsEnabled && (
                <>
                  <View
                    style={{
                      padding: spacing.lg,

                      borderRadius: 16,

                      backgroundColor: theme.background.brand,

                      gap: spacing.md,

                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name={getBiometricIcon()}
                      size={72}
                      color={theme.icon.success.icon}
                    />

                    <AppText variant="body" color="strong" align="center">
                      Continue securely with {getBiometricName()}
                    </AppText>

                    {biometricEmail && (
                      <AppText
                        variant="caption"
                        color="secondary"
                        align="center"
                      >
                        {biometricEmail}
                      </AppText>
                    )}

                    <Button
                      title={
                        loadingBiometric
                          ? "Verifying..."
                          : `Continue with ${getBiometricName()}`
                      }
                      variant="primary"
                      size="large"
                      disabled={loadingBiometric}
                      onPress={handleBiometricUnlock}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",

                      alignItems: "center",

                      gap: spacing.md,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,

                        height: 1,

                        backgroundColor: theme.divider.default,
                      }}
                    />

                    <AppText variant="caption" color="muted">
                      OR
                    </AppText>

                    <View
                      style={{
                        flex: 1,

                        height: 1,

                        backgroundColor: theme.divider.default,
                      }}
                    />
                  </View>
                </>
              )}

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

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <View>
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
                          onPress={() => setShowPassword((current) => !current)}
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

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Forgot password"
                      onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
                      style={{
                        alignSelf: "flex-end",

                        marginTop: spacing.xs,
                      }}
                    >
                      <AppText
                        variant="label"
                        color="link"
                        style={{
                          marginTop: spacing.xs,
                        }}
                      >
                        Forgot Password?
                      </AppText>
                    </Pressable>
                  </View>
                )}
              />
            </View>
          </View>

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title={loginMutation.isPending ? "Signing In..." : "Log In"}
              variant="primary"
              size="large"
              disabled={!isValid || loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            />

            <View
              style={{
                flexDirection: "row",

                justifyContent: "center",

                alignItems: "center",

                gap: spacing.xs,

                marginTop: spacing.lg,
              }}
            >
              <AppText variant="bodySmall" color="muted">
                Don't have an account?
              </AppText>

              <Link href={ROUTES.SIGNUP} asChild>
                <Pressable>
                  <AppText variant="label" color="link">
                    Sign Up
                  </AppText>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
