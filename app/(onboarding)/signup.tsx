import { Pressable, View } from "react-native";

import { useState } from "react";

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
} from "@/features/auth/schemas/signup-schema";

import { signupUser } from "@/features/auth/api/auth-api";
import { Alert } from "react-native";

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

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),

    mode: "onChange",

    defaultValues: {
      email: "",

      password: "",

      confirmPassword: "",
    },
  });

  const password = watch("password") || "";

  const passwordRules = {
    minLength: password.length >= 8,

    uppercase: /[A-Z]/.test(password),

    lowercase: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[^A-Za-z0-9]/.test(password),
  };

  async function onSubmit(data: SignupSchema) {
    try {
      setLoading(true);

      const response = await signupUser(data.email, data.password);

      if (response.error) {
        console.log("Signup Error:", response.error);

        Alert.alert("Sign Up Failed", response.error.message);

        return;
      }

      console.log("User:", response.data.user);

      console.log("Session:", response.data.session);

      Alert.alert(
        "Check Your Email",
        "We've sent a verification code to your email address."
      );

      router.push({
        pathname: ROUTES.EMAIL_VERIFICATION,
        params: {
          email: data.email,
        },
      });
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
                flexDirection: "row",

                alignItems: "center",

                gap: spacing.sm,

                justifyContent: "space-between",
              }}
            >
              <Link href={ROUTES.WELCOME} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  accessibilityHint="Returns to the welcome screen"
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
                accessibilityLabel="Signup progress"
                accessibilityValue={{
                  min: 0,
                  max: 100,
                  now: 25,
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
                <ProgressBar progress={25} />
              </View>

              <AppText variant="bodySmall" color="muted">
                Step 1 of 4
              </AppText>
            </View>

            {/* CONTENT */}

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
                <AppText
                  accessibilityRole="header"
                  variant="h1"
                  color="heading"
                >
                  Create your Account
                </AppText>

                <AppText variant="body" color="secondary">
                  Sign up with your email to get started.
                </AppText>
              </View>

              {/* EMAIL */}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
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
                        accessibilityState={{
                          selected: showPassword,
                        }}
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

          {/* BOTTOM SECTION */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          >
            <Button
              title={loading ? "Creating Account..." : "Get Started"}
              variant="primary"
              size="large"
              disabled={!isValid || loading}
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
                Already have an account?
              </AppText>

              <Link href={ROUTES.LOGIN} asChild>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="Login"
                  accessibilityHint="Go to login screen"
                >
                  <AppText variant="label" color="link">
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
