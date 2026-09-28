import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import * as Notifications from "expo-notifications";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useRegisterPushNotification } from "@/hooks/merchant/useRegisterPushNotification";

/**
 * ============================================================================
 * NOTIFICATIONS SCREEN
 * ============================================================================
 */

export default function NotificationsScreen() {
  /**
   * ==========================================================================
   * PUSH NOTIFICATION REGISTRATION
   * ==========================================================================
   */

  const registerPushNotification = useRegisterPushNotification();

  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [isEnabled, setIsEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * ==========================================================================
   * REFRESH
   * ==========================================================================
   *
   * Notification permission is managed by the operating system.
   * We check the current permission state when the screen is refreshed.
   */

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      const permissions = await Notifications.getPermissionsAsync();

      setIsEnabled(permissions.granted);
    } catch {
      // Keep the existing state if permission status cannot be read.
    } finally {
      setIsRefreshing(false);
    }
  }

  /**
   * ==========================================================================
   * ENABLE PUSH NOTIFICATIONS
   * ==========================================================================
   */

  async function handleEnableNotifications() {
    if (registerPushNotification.isPending) {
      return;
    }

    try {
      /**
       * --------------------------------------------------------------
       * CHECK CURRENT PERMISSION
       * --------------------------------------------------------------
       */

      let permissions = await Notifications.getPermissionsAsync();

      /**
       * --------------------------------------------------------------
       * REQUEST PERMISSION IF NECESSARY
       * --------------------------------------------------------------
       */

      if (!permissions.granted) {
        permissions = await Notifications.requestPermissionsAsync();
      }

      /**
       * --------------------------------------------------------------
       * PERMISSION DENIED
       * --------------------------------------------------------------
       */

      if (!permissions.granted) {
        setIsEnabled(false);

        Alert.alert(
          "Notifications Disabled",
          "Notifications are currently disabled for XpressStore. Please enable notifications in your device settings."
        );

        return;
      }

      /**
       * --------------------------------------------------------------
       * GET DEVICE PUSH TOKEN
       * --------------------------------------------------------------
       */

      const tokenResponse = await Notifications.getDevicePushTokenAsync();

      const deviceToken = tokenResponse.data;

      if (!deviceToken) {
        Alert.alert(
          "Unable to Enable Notifications",
          "We couldn't retrieve a notification token for this device. Please try again."
        );

        return;
      }

      /**
       * --------------------------------------------------------------
       * DETERMINE PLATFORM
       * --------------------------------------------------------------
       */

      const platform = tokenResponse.type === "ios" ? "ios" : "android";

      /**
       * --------------------------------------------------------------
       * REGISTER DEVICE WITH BACKEND
       * --------------------------------------------------------------
       */

      await registerPushNotification.mutateAsync({
        deviceToken,
        platform,
      });

      setIsEnabled(true);

      Alert.alert(
        "Notifications Enabled",
        "You will now receive important XpressStore notifications on this device."
      );
    } catch (error) {
      Alert.alert(
        "Unable to Enable Notifications",
        "We couldn't enable notifications on this device. Please try again."
      );
    }
  }

  /**
   * ==========================================================================
   * OPEN DEVICE NOTIFICATION SETTINGS
   * ==========================================================================
   */

  async function handleOpenDeviceSettings() {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        "Unable to Open Settings",
        "Please open your device settings and enable notifications for XpressStore."
      );
    }
  }

  /**
   * ==========================================================================
   * DISABLE PUSH NOTIFICATIONS
   * ==========================================================================
   *
   * There is currently no backend endpoint for unregistering a device or
   * disabling push notifications.
   *
   * Therefore, we don't present a fake disable action here.
   * The operating system controls whether notifications are allowed.
   */

  /**
   * ==========================================================================
   * INITIAL PERMISSION CHECK
   * ==========================================================================
   */

  useEffect(() => {
    handleRefresh();
  }, []);

  /**
   * ==========================================================================
   * UI
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();

                return;
              }

              router.replace(ROUTES.MORE);
            }}
            style={{
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
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
            <AppText variant="h1">Notifications</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage your notification preferences.
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
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || registerPushNotification.isPending}
              onRefresh={handleRefresh}
              tintColor={theme.icon.branding.icon}
            />
          }
        >
          {/* ================================================================
              PUSH NOTIFICATIONS
          ================================================================ */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyLargeBold">Push Notifications</AppText>

            <Card>
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                {/* ========================================================
                    STATUS
                ======================================================== */}

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
                      backgroundColor: isEnabled
                        ? theme.background.brand
                        : theme.icon.default.background,
                    }}
                  >
                    <Ionicons
                      name={
                        isEnabled
                          ? "notifications"
                          : "notifications-off-outline"
                      }
                      size={24}
                      color={
                        isEnabled
                          ? theme.icon.branding.icon
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
                    <AppText variant="bodyBold">
                      {isEnabled
                        ? "Notifications are enabled"
                        : "Notifications are disabled"}
                    </AppText>

                    <AppText variant="bodySmall" color="secondary">
                      {isEnabled
                        ? "This device can receive important XpressStore updates."
                        : "Enable notifications to receive important XpressStore updates."}
                    </AppText>
                  </View>

                  {isEnabled && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        borderRadius: radius.full,
                        backgroundColor: theme.background.brand,
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.icon.success.icon}
                      />

                      <AppText variant="bodySmallBold" color="success">
                        On
                      </AppText>
                    </View>
                  )}
                </View>

                <Divider variant="subtle" />

                {/* ========================================================
                    DESCRIPTION
                ======================================================== */}

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    What you'll receive
                  </AppText>

                  <View
                    style={{
                      gap: spacing.sm,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: spacing.sm,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.icon.success.icon}
                      />

                      <AppText
                        variant="bodySmall"
                        color="secondary"
                        style={{
                          flex: 1,
                        }}
                      >
                        Important transaction and payment updates
                      </AppText>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: spacing.sm,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.icon.success.icon}
                      />

                      <AppText
                        variant="bodySmall"
                        color="secondary"
                        style={{
                          flex: 1,
                        }}
                      >
                        Important account and business updates
                      </AppText>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: spacing.sm,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.icon.success.icon}
                      />

                      <AppText
                        variant="bodySmall"
                        color="secondary"
                        style={{
                          flex: 1,
                        }}
                      >
                        Other important XpressStore notifications
                      </AppText>
                    </View>
                  </View>
                </View>

                {/* ========================================================
                    ENABLE
                ======================================================== */}

                {!isEnabled && (
                  <View
                    style={{
                      paddingTop: spacing.xs,
                    }}
                  >
                    <Button
                      title={
                        registerPushNotification.isPending
                          ? "Enabling..."
                          : "Enable Notifications"
                      }
                      variant="primary"
                      disabled={registerPushNotification.isPending}
                      leftIcon={
                        registerPushNotification.isPending ? (
                          <ActivityIndicator
                            size="small"
                            color={theme.action.primary.text}
                          />
                        ) : (
                          <Ionicons
                            name="notifications-outline"
                            size={20}
                            color={theme.action.primary.text}
                          />
                        )
                      }
                      onPress={handleEnableNotifications}
                    />
                  </View>
                )}
              </View>
            </Card>
          </View>

          {/* ================================================================
              DEVICE SETTINGS
          ================================================================ */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyLargeBold">Notification Settings</AppText>

            <Card>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Manage device notification settings"
                onPress={handleOpenDeviceSettings}
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
                    backgroundColor: theme.icon.default.background,
                  }}
                >
                  <Ionicons
                    name="settings-outline"
                    size={24}
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
                    Device Notification Settings
                  </AppText>

                  <AppText variant="bodySmall" color="muted">
                    Manage notification permissions from your device.
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>
          </View>

          {/* ================================================================
              INFORMATION
          ================================================================ */}

          <Card
            style={{
              backgroundColor: theme.background.subtle,
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
                <AppText variant="bodyBold">About notifications</AppText>

                <AppText variant="bodySmall" color="secondary">
                  Notifications help keep you informed about important activity
                  on your XpressStore account.
                </AppText>
              </View>
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
