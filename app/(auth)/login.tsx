import { useEffect, useState } from "react";

import { Pressable, View } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { loginUser } from "@/features/auth/api/auth-api";

import { useAuthStore } from "@/features/auth/store/auth-store";

import { LoginSchema, loginSchema } from "@/features/auth/schemas/login-schema";

import { authenticateWithBiometrics } from "@/services/biometrics";

import { isBiometricsEnabled } from "@/services/biometrics/storage";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import {
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/features/auth/services/session";

import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const [loadingBiometric, setLoadingBiometric] = useState(false);

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    checkBiometrics();
  }, []);

  async function checkBiometrics() {
    const enabled = await isBiometricsEnabled();

    setBiometricsEnabled(enabled);
  }

  async function handleBiometricLogin() {
    try {
      setLoadingBiometric(true);

      const result = await authenticateWithBiometrics();

      if (!result.success) {
        return;
      }

      const token = await getAccessToken();

      if (!token) {
        console.log("No active session found");

        return;
      }

      setAuthenticated(true);

      router.replace(ROUTES.TABS);
    } catch (error) {
      console.log("Biometric login failed:", error);
    } finally {
      setLoadingBiometric(false);
    }
  }

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

  async function onSubmit(data: LoginSchema) {
    try {
      const response = await loginUser(data.email, data.password);

      if (response.error) {
        console.log(response.error.message);

        return;
      }

      if (response.data.user && response.data.session) {
        await saveAccessToken(response.data.session.access_token);

        await saveRefreshToken(response.data.session.refresh_token);

        await SecureStore.setItemAsync("biometric_email", data.email);

        setAuthenticated(true);

        setUser(response.data.user);

        router.replace(ROUTES.TABS);
      }
    } catch (error) {
      console.log("Login Error:", error);
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

          <View>
            {/* HEADER */}

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
                  Sign in to access your store, manage orders, and receive
                  payments securely.
                </AppText>
              </View>

              {/* FACE ID */}

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
                      name="scan-circle-outline"
                      size={72}
                      color={theme.icon.success.icon}
                    />

                    <AppText variant="body" color="strong" align="center">
                      Continue securely with Face ID
                    </AppText>

                    <Button
                      title={
                        loadingBiometric
                          ? "Verifying..."
                          : "Continue with Face ID"
                      }
                      variant="primary"
                      size="large"
                      disabled={loadingBiometric}
                      onPress={handleBiometricLogin}
                    />
                  </View>

                  {/* DIVIDER */}

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

              {/* PASSWORD */}

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    rightIcon={
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
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
            </View>
          </View>

          {/* BOTTOM */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title="Log In"
              variant="primary"
              size="large"
              disabled={!isValid}
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
