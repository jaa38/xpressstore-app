import { useState } from "react";

import { Alert, Pressable, ScrollView, Switch, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";

/**
 * ============================================================================
 * BIOMETRIC AUTHENTICATION SCREEN
 * ============================================================================
 */

export default function BiometricAuthenticationScreen() {
  /**
   * --------------------------------------------------------------------------
   * STATE
   * --------------------------------------------------------------------------
   *
   * This is currently local UI state.
   *
   * When biometric authentication is connected to the application security
   * service, replace this with persisted user settings.
   */

  const [biometricEnabled, setBiometricEnabled] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * BIOMETRIC TOGGLE
   * --------------------------------------------------------------------------
   */

  function handleBiometricToggle(value: boolean) {
    /**
     * In production:
     *
     * 1. Check whether biometric authentication is supported.
     * 2. Check whether biometrics are enrolled on the device.
     * 3. Request biometric authentication.
     * 4. Persist the user's biometric preference.
     *
     * For now, this controls the UI state.
     */

    if (value) {
      Alert.alert(
        "Enable Biometric Authentication",
        "You will be able to use Face ID, Touch ID, or fingerprint authentication to access your XpressStore account.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enable",
            onPress: () => {
              setBiometricEnabled(true);
            },
          },
        ]
      );

      return;
    }

    Alert.alert(
      "Disable Biometric Authentication",
      "You will need to use your password to access your XpressStore account.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disable",
          style: "destructive",
          onPress: () => {
            setBiometricEnabled(false);
          },
        },
      ]
    );
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
        {/* ==================================================================
            HEADER
        ================================================================== */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {/* ================================================================
              BACK BUTTON
          ================================================================ */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>

          {/* ================================================================
              TITLE
          ================================================================ */}

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Biometric Authentication</AppText>

            <AppText variant="bodySmall" color="secondary">
              Use your device's biometric security to access your account.
            </AppText>
          </View>
        </View>

        {/* ==================================================================
            CONTENT
        ================================================================== */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* ================================================================
              BIOMETRIC STATUS
          ================================================================ */}

          <Card
            style={{
              padding: spacing.lg,

              backgroundColor: biometricEnabled
                ? theme.state.success.background
                : theme.background.surface,

              borderColor: biometricEnabled
                ? theme.state.success.border
                : theme.border.default,

              borderWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              {/* ICON */}

              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.full,

                  justifyContent: "center",
                  alignItems: "center",

                  backgroundColor: biometricEnabled
                    ? theme.icon.success.background
                    : theme.icon.default.background,
                }}
              >
                <Ionicons
                  name={
                    biometricEnabled
                      ? "shield-checkmark-outline"
                      : "finger-print-outline"
                  }
                  size={26}
                  color={
                    biometricEnabled
                      ? theme.icon.success.icon
                      : theme.icon.default.icon
                  }
                />
              </View>

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyLargeBold">
                  {biometricEnabled
                    ? "Biometric authentication is enabled"
                    : "Biometric authentication is not enabled"}
                </AppText>

                <AppText
                  variant="bodySmall"
                  color={biometricEnabled ? "success" : "muted"}
                >
                  {biometricEnabled
                    ? "You can use your device's biometric security to access your account."
                    : "Use Face ID, Touch ID, or fingerprint authentication for faster and more secure access."}
                </AppText>
              </View>
            </View>
          </Card>

          {/* ================================================================
              BIOMETRIC AUTHENTICATION
          ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyLargeBold">Biometric Authentication</AppText>

            <AppText variant="bodySmall" color="muted">
              Choose whether to use your device's biometric security when
              accessing XpressStore.
            </AppText>
          </View>

          {/* ================================================================
              ENABLE BIOMETRICS
          ================================================================ */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              {/* ICON */}

              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,

                  justifyContent: "center",
                  alignItems: "center",

                  backgroundColor: theme.icon.branding.background,
                }}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={24}
                  color={theme.icon.branding.icon}
                />
              </View>

              {/* CONTENT */}

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Use Biometrics</AppText>

                <AppText variant="bodySmall" color="muted">
                  Use Face ID, Touch ID, or fingerprint authentication.
                </AppText>
              </View>

              {/* SWITCH */}

              <Switch
                accessibilityRole="switch"
                accessibilityLabel="Use biometric authentication"
                accessibilityState={{
                  checked: biometricEnabled,
                }}
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
              />
            </View>
          </Card>

          {/* ================================================================
              HOW IT WORKS
          ================================================================ */}

          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyLargeBold">How it works</AppText>

            <AppText variant="bodySmall" color="muted">
              Biometric authentication uses the security features already
              configured on your device.
            </AppText>
          </View>

          {/* ================================================================
              SECURITY INFORMATION
          ================================================================ */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <View
              style={{
                gap: spacing.lg,
              }}
            >
              {/* ------------------------------------------------------------
                  ITEM 1
              ------------------------------------------------------------ */}

              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.full,

                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: theme.icon.default.background,
                  }}
                >
                  <Ionicons
                    name="phone-portrait-outline"
                    size={18}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">Uses your device</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Your biometric information is managed securely by your
                    device and operating system.
                  </AppText>
                </View>
              </View>

              {/* ------------------------------------------------------------
                  ITEM 2
              ------------------------------------------------------------ */}

              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.full,

                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: theme.icon.default.background,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">
                    Your biometric data stays private
                  </AppText>

                  <AppText variant="bodySmall" color="muted">
                    XpressStore does not store your fingerprint or facial
                    biometric information.
                  </AppText>
                </View>
              </View>

              {/* ------------------------------------------------------------
                  ITEM 3
              ------------------------------------------------------------ */}

              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.full,

                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: theme.icon.default.background,
                  }}
                >
                  <Ionicons
                    name="key-outline"
                    size={18}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">
                    Your password is still required
                  </AppText>

                  <AppText variant="bodySmall" color="muted">
                    You may still be asked to enter your password for important
                    security actions.
                  </AppText>
                </View>
              </View>
            </View>
          </Card>

          {/* ================================================================
              DEVICE SUPPORT NOTICE
          ================================================================ */}

          <Card
            style={{
              marginTop: spacing.xl,

              padding: spacing.lg,

              backgroundColor: theme.background.surface,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.icon.default.icon}
              />

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Device availability</AppText>

                <AppText variant="bodySmall" color="muted">
                  Biometric authentication is only available on devices that
                  support Face ID, Touch ID, fingerprint authentication, or
                  another supported biometric method.
                </AppText>
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
