import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import {
  authenticateWithBiometrics,
  BiometricAvailability,
  BiometricType,
  getBiometricAvailability,
} from "@/services/biometrics";

import {
  disableBiometrics,
  enableBiometrics,
  isBiometricsEnabled,
} from "@/services/biometrics/storage";

import { saveBiometricEmail } from "@/services/biometrics/user";

import { getAccessToken, getCurrentUser } from "@/storage/authStorage";

import { useAuth } from "@/providers/AuthProvider";

import { AuthUser } from "@/types/auth";

import { AppText } from "@/components/ui/AppText";

import { Card } from "@/components/ui/Card";

import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

/**
 * ============================================================================
 * BIOMETRIC AUTHENTICATION SCREEN
 * ============================================================================
 */

export default function BiometricAuthenticationScreen() {
  /**
   * ==========================================================================
   * AUTH
   * ==========================================================================
   */

  const { user } = useAuth();

  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [availability, setAvailability] =
    useState<BiometricAvailability | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  /**
   * ==========================================================================
   * LOAD SETTINGS
   * ==========================================================================
   */

  useEffect(() => {
    void loadBiometricSettings();
  }, []);

  async function loadBiometricSettings() {
    try {
      setIsLoading(true);

      const [biometricAvailability, enabled] = await Promise.all([
        getBiometricAvailability(),

        isBiometricsEnabled(),
      ]);

      /**
       * ----------------------------------------------------------------------
       * SAVE DEVICE AVAILABILITY
       * ----------------------------------------------------------------------
       */

      setAvailability(biometricAvailability);

      /**
       * ----------------------------------------------------------------------
       * BIOMETRIC STATUS
       * ----------------------------------------------------------------------
       *
       * Do not display biometrics as enabled when the
       * device no longer supports biometrics or no
       * biometric method is enrolled.
       */

      setBiometricEnabled(biometricAvailability.available && enabled);
    } catch (error) {
      console.error("Unable to load biometric settings:", error);

      setBiometricEnabled(false);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * ==========================================================================
   * BIOMETRIC NAME
   * ==========================================================================
   */

  function getBiometricName(type: BiometricType) {
    switch (type) {
      case "face":
        return "Face ID";

      case "fingerprint":
        return "Fingerprint";

      case "iris":
        return "Iris Recognition";

      case "biometric":
        return "Biometrics";

      default:
        return "Biometric Authentication";
    }
  }

  /**
   * ==========================================================================
   * BIOMETRIC ICON
   * ==========================================================================
   */

  function getBiometricIcon() {
    switch (availability?.type) {
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
   * CURRENT BIOMETRIC NAME
   * ==========================================================================
   */

  const biometricName = getBiometricName(availability?.type ?? "none");

  /**
   * ==========================================================================
   * BIOMETRIC TOGGLE
   * ==========================================================================
   */

  async function handleBiometricToggle(value: boolean) {
    /**
     * ------------------------------------------------------------------------
     * PREVENT MULTIPLE REQUESTS
     * ------------------------------------------------------------------------
     */

    if (isAuthenticating || isLoading) {
      return;
    }

    /**
     * ========================================================================
     * ENABLE BIOMETRICS
     * ========================================================================
     */

    if (value) {
      /**
       * ----------------------------------------------------------------------
       * BIOMETRICS UNAVAILABLE
       * ----------------------------------------------------------------------
       */

      if (!availability?.available) {
        Alert.alert(
          "Biometrics Unavailable",
          availability?.message ??
            "Biometric authentication is not available on this device."
        );

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * CONFIRM ENABLE
       * ----------------------------------------------------------------------
       */

      Alert.alert(
        `Enable ${biometricName}`,
        `You will be able to use ${biometricName} to securely access your XpressStore account.`,
        [
          {
            text: "Cancel",

            style: "cancel",
          },

          {
            text: "Enable",

            onPress: async () => {
              try {
                setIsAuthenticating(true);

                /**
                 * ============================================================
                 * VERIFY STORED SESSION
                 * ============================================================
                 */

                const [token, storedUser] = await Promise.all([
                  getAccessToken(),

                  getCurrentUser<AuthUser>(),
                ]);

                /**
                 * ------------------------------------------------------------
                 * SESSION UNAVAILABLE
                 * ------------------------------------------------------------
                 */

                if (!token || !storedUser) {
                  Alert.alert(
                    "Session Unavailable",
                    "Please sign in again before enabling biometric authentication."
                  );

                  return;
                }

                /**
                 * ============================================================
                 * VERIFY BIOMETRIC IDENTITY
                 * ============================================================
                 */

                const result = await authenticateWithBiometrics({
                  promptMessage: `Confirm to enable ${biometricName}`,
                });

                /**
                 * ------------------------------------------------------------
                 * AUTHENTICATION FAILED
                 * ------------------------------------------------------------
                 */

                if (!result.success) {
                  if (result.message !== "Authentication cancelled.") {
                    Alert.alert("Authentication Failed", result.message);
                  }

                  return;
                }

                /**
                 * ============================================================
                 * SAVE BIOMETRIC PREFERENCE
                 * ============================================================
                 */

                await enableBiometrics();

                /**
                 * ============================================================
                 * SAVE BIOMETRIC ACCOUNT EMAIL
                 * ============================================================
                 */

                await saveBiometricEmail(user?.email ?? storedUser.email);

                /**
                 * ============================================================
                 * UPDATE UI
                 * ============================================================
                 */

                setBiometricEnabled(true);

                /**
                 * ============================================================
                 * SUCCESS
                 * ============================================================
                 */

                Alert.alert(
                  `${biometricName} Enabled`,
                  `You can now use ${biometricName} to sign in to XpressStore.`
                );
              } catch (error) {
                console.error("Unable to enable biometrics:", error);

                Alert.alert("Unable to Enable Biometrics", "Please try again.");
              } finally {
                setIsAuthenticating(false);
              }
            },
          },
        ]
      );

      return;
    }

    /**
     * ========================================================================
     * DISABLE BIOMETRICS
     * ========================================================================
     */

    Alert.alert(
      "Disable Biometric Authentication",
      "You will need to use your email and password to sign in to XpressStore.",
      [
        {
          text: "Cancel",

          style: "cancel",
        },

        {
          text: "Disable",

          style: "destructive",

          onPress: async () => {
            try {
              setIsAuthenticating(true);

              await disableBiometrics();

              setBiometricEnabled(false);

              Alert.alert(
                "Biometric Authentication Disabled",
                "You will now use your email and password to sign in."
              );
            } catch (error) {
              console.error("Unable to disable biometrics:", error);

              Alert.alert("Unable to Disable Biometrics", "Please try again.");
            } finally {
              setIsAuthenticating(false);
            }
          },
        },
      ]
    );
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
        {/* ================================================================
            HEADER
        ================================================================ */}

        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            gap: spacing.md,
          }}
        >
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

        {/* ================================================================
            CONTENT
        ================================================================ */}

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
          {/* ============================================================
              BIOMETRIC STATUS
          ============================================================ */}

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
                      : getBiometricIcon()
                  }
                  size={26}
                  color={
                    biometricEnabled
                      ? theme.icon.success.icon
                      : theme.icon.default.icon
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,

                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyLargeBold">
                  {isLoading
                    ? "Checking biometric availability..."
                    : biometricEnabled
                      ? `${biometricName} is enabled`
                      : availability?.available
                        ? `${biometricName} is available`
                        : "Biometric authentication is unavailable"}
                </AppText>

                <AppText
                  variant="bodySmall"
                  color={biometricEnabled ? "success" : "muted"}
                >
                  {isLoading
                    ? "Checking your device security settings."
                    : biometricEnabled
                      ? `You can use ${biometricName} to securely access your account.`
                      : availability?.available
                        ? `Enable ${biometricName} for faster and more secure access.`
                        : (availability?.message ??
                          "Biometric authentication is not available on this device.")}
                </AppText>
              </View>
            </View>
          </Card>

          {/* ============================================================
              BIOMETRIC AUTHENTICATION
          ============================================================ */}

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

          {/* ============================================================
              ENABLE BIOMETRICS
          ============================================================ */}

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
                  name={getBiometricIcon()}
                  size={24}
                  color={theme.icon.branding.icon}
                />
              </View>

              {/* TEXT */}

              <View
                style={{
                  flex: 1,

                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Use {biometricName}</AppText>

                <AppText variant="bodySmall" color="muted">
                  {availability?.available
                    ? `Use ${biometricName} to securely access your account.`
                    : (availability?.message ??
                      "Biometric authentication is not available on this device.")}
                </AppText>
              </View>

              {/* SWITCH */}

              <View
                style={{
                  justifyContent: "center",

                  alignItems: "center",

                  alignSelf: "stretch",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.action.primary.background}
                  />
                ) : (
                  <Switch
                    accessibilityRole="switch"
                    accessibilityLabel={`Use ${biometricName}`}
                    accessibilityState={{
                      checked: biometricEnabled,

                      disabled: !availability?.available || isAuthenticating,
                    }}
                    value={biometricEnabled}
                    disabled={!availability?.available || isAuthenticating}
                    onValueChange={handleBiometricToggle}
                  />
                )}
              </View>
            </View>
          </Card>

          {/* ============================================================
              DEVICE SUPPORT NOTICE
          ============================================================ */}

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
