import { useEffect, useState } from "react";

import { Pressable, View, Alert } from "react-native";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/providers/AuthProvider";

import { LoginSchema, loginSchema } from "@/features/auth/schemas/login-schema";

import { authenticateWithBiometrics } from "@/services/biometrics";

import { isBiometricsEnabled } from "@/services/biometrics/storage";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { getAccessToken } from "@/storage/authStorage";

import { getBiometricEmail } from "@/services/biometrics/user";

import { saveBiometricEmail } from "@/services/biometrics/user";

import { useLogin } from "@/hooks/auth/useLogin";

import { getApiErrorMessage } from "@/api/errors";

import { AuthUser } from "@/types/auth";

import { getCurrentUser } from "@/storage/authStorage";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const [loadingBiometric, setLoadingBiometric] = useState(false);

  const { setUser } = useAuth();

  const [biometricEmail, setBiometricEmail] = useState("");

  const login = useLogin();

  useEffect(() => {
    checkBiometrics();
  }, []);

  async function checkBiometrics() {
    const enabled = await isBiometricsEnabled();

    setBiometricsEnabled(enabled);

    const email = await getBiometricEmail();

    if (email) {
      setBiometricEmail(email);
    }
  }

  // ─── UPDATED handleBiometricLogin ────────────────────────────────────────
  async function handleBiometricLogin() {
    try {
      setLoadingBiometric(true);

      const result = await authenticateWithBiometrics();

      if (!result.success) {
        return;
      }

      const email = await getBiometricEmail();
      console.log("Biometric User:", email);

      // ✅ Ask Supabase directly — never a stale, separately-stored copy.
      // If autoRefreshToken silently rotated the token in the background,
      // this always reflects the current, valid state.
      const token = await getAccessToken();

      if (!token) {
        Alert.alert(
          "Session Expired",
          "Please sign in with your email and password."
        );

        return;
      }

      const user = await getCurrentUser<AuthUser>();

      if (!user) {
        Alert.alert("Unable to restore session", "Please sign in again.");

        return;
      }

      setUser(user);

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

  // ─── UPDATED onSubmit — remove manual token saving ───────────────────────
  async function onSubmit(data: LoginSchema) {
    try {
      const session = await login.mutateAsync({
        email: data.email,
        password: data.password,
      });

      await saveBiometricEmail(data.email);

      setUser(session.user);

      router.replace(ROUTES.TABS);
    } catch (error) {
      Alert.alert("Login Failed", getApiErrorMessage(error));
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
                  Sign in to manage your store.
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

                    <Pressable
                      onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
                      style={{
                        alignSelf: "flex-end",
                        marginTop: spacing.xs,
                      }}
                    >
                      <AppText
                        variant="label"
                        color="link"
                        style={{ marginTop: spacing.xs }}
                      >
                        Forgot Password?
                      </AppText>
                    </Pressable>
                  </View>
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
              title={login.isPending ? "Signing In..." : "Log In"}
              variant="primary"
              size="large"
              disabled={!isValid || login.isPending}
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
