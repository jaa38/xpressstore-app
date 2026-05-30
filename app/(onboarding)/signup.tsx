import { useState } from "react";

import {
  Pressable,
  View,
} from "react-native";

import {
  Link,
  router,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  StatusBar,
} from "expo-status-bar";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";

import {
  spacing,
  theme,
} from "@/theme";

import { ROUTES } from "@/navigation/routes";

import {
  signupSchema,
  SignupSchema,
} from "@/features/auth/schemas/signup-schema";

export default function SignupScreen() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isValid,
    },
  } = useForm<SignupSchema>({
    resolver:
      zodResolver(
        signupSchema
      ),

    mode: "onChange",

    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(
    data: SignupSchema
  ) {
    console.log(data);

    router.push(
      ROUTES.EMAIL_VERIFICATION
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,

          paddingHorizontal:
            spacing.lg,
        }}
      >
        <View
          style={{
            flex: 1,

            justifyContent:
              "space-between",
          }}
        >
          {/* TOP SECTION */}

          <View>
            {/* HEADER */}

            <View
              style={{
                flexDirection: "row",

                alignItems: "center",

                gap: spacing.sm,

                justifyContent:
                  "space-between",
              }}
            >
              <Link
                href={ROUTES.WELCOME}
                asChild
              >
                <Pressable>
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={
                      theme.icon.default
                        .icon
                    }
                  />
                </Pressable>
              </Link>

              <View
                style={{
                  flex: 1,

                  height: 8,

                  backgroundColor:
                    theme.divider.default,

                  borderRadius: 999,

                  overflow: "hidden",

                  marginHorizontal:
                    spacing.sm,
                }}
              >
                <ProgressBar
                  progress={25}
                />
              </View>

              <AppText
                variant="bodySmall"
                color="muted"
              >
                Step 1 of 4
              </AppText>
            </View>

            {/* FORM */}

            <View
              style={{
                marginTop:
                  spacing.lg,

                gap:
                  spacing.lg,
              }}
            >
              <View
                style={{
                  gap:
                    spacing.xs,
                }}
              >
                <AppText
                  variant="h1"
                  color="heading"
                >
                  Create your Account
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                >
                  Sign up with your email to
                  get started.
                </AppText>
              </View>

              <View
                style={{
                  gap:
                    spacing.md,
                }}
              >
                {/* EMAIL */}

                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: {
                      value,
                      onChange,
                    },
                  }) => (
                    <Input
                      label="Email Address"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={
                        onChange
                      }
                      error={
                        errors.email
                          ?.message
                      }
                    />
                  )}
                />

                {/* PASSWORD */}

                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: {
                      value,
                      onChange,
                    },
                  }) => (
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      keyboardType="default"
                      autoCapitalize="none"
                      secureTextEntry={
                        !showPassword
                      }
                      value={value}
                      onChangeText={
                        onChange
                      }
                      error={
                        errors.password
                          ?.message
                      }
                      rightIcon={
                        <Pressable
                          onPress={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                        >
                          <Ionicons
                            name={
                              showPassword
                                ? "eye-off-outline"
                                : "eye-outline"
                            }
                            size={20}
                            color={
                              theme.icon
                                .default
                                .icon
                            }
                          />
                        </Pressable>
                      }
                    />
                  )}
                />

                {/* PASSWORD RULES */}

                <View
                  style={{
                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="caption"
                    color="muted"
                  >
                    Password must contain:
                  </AppText>

                  <AppText
                    variant="caption"
                    color="muted"
                  >
                    • At least 8 characters
                  </AppText>

                  <AppText
                    variant="caption"
                    color="muted"
                  >
                    • One uppercase letter
                  </AppText>

                  <AppText
                    variant="caption"
                    color="muted"
                  >
                    • One lowercase letter
                  </AppText>

                  <AppText
                    variant="caption"
                    color="muted"
                  >
                    • One number
                  </AppText>

                  <AppText
                    variant="caption"
                    color="muted"
                  >
                    • One special character
                  </AppText>
                </View>

                {/* CONFIRM PASSWORD */}

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({
                    field: {
                      value,
                      onChange,
                    },
                  }) => (
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      keyboardType="default"
                      autoCapitalize="none"
                      secureTextEntry={
                        !showConfirmPassword
                      }
                      value={value}
                      onChangeText={
                        onChange
                      }
                      error={
                        errors
                          .confirmPassword
                          ?.message
                      }
                      rightIcon={
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                        >
                          <Ionicons
                            name={
                              showConfirmPassword
                                ? "eye-off-outline"
                                : "eye-outline"
                            }
                            size={20}
                            color={
                              theme.icon
                                .default
                                .icon
                            }
                          />
                        </Pressable>
                      }
                    />
                  )}
                />
              </View>
            </View>
          </View>

          {/* BOTTOM SECTION */}

          <View
            style={{
              paddingBottom:
                spacing.lg,
            }}
          >
            <Button
              title="Get Started"
              variant="primary"
              size="large"
              onPress={handleSubmit(
                onSubmit
              )}
              disabled={!isValid}
            />

            <View
              style={{
                flexDirection: "row",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                gap:
                  spacing.xs,

                marginTop:
                  spacing.lg,
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
                <Pressable>
                  <AppText
                    variant="label"
                    color="link"
                  >
                    Login
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