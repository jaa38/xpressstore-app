import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { useCallback, useMemo, useState } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { getMockNotifications } from "@/mocks";

import { Notification } from "@/types/notification";

export default function NotificationInboxScreen() {
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>(
    getMockNotifications()
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const mockNotifications = getMockNotifications();

      setNotifications(mockNotifications);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleNotificationPress = useCallback((notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );
  }, []);

  const getNotificationIcon = (
    type: Notification["type"]
  ): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "payment":
        return "card-outline";

      case "order":
        return "receipt-outline";

      case "product":
        return "cube-outline";

      case "settlement":
        return "wallet-outline";

      case "system":
      default:
        return "information-circle-outline";
    }
  };

  const formatNotificationDate = (date: string) => {
    const notificationDate = new Date(date);

    return notificationDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* Header */}
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

              router.replace(ROUTES.HOME);
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
              size={28}
              color={theme.text.primary}
            />
          </Pressable>

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <AppText variant="h1">Notifications</AppText>

              {unreadCount > 0 && (
                <View
                  style={{
                    minWidth: 24,
                    height: 24,
                    paddingHorizontal: spacing.xs,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.icon.branding.background,
                  }}
                >
                  <AppText
                    variant="caption"
                    color="inverse"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {unreadCount}
                  </AppText>
                </View>
              )}
            </View>

            <AppText variant="bodySmall" color="secondary">
              Stay up to date with activity on your account
            </AppText>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.icon.branding.icon}
              colors={[theme.icon.branding.icon]}
              progressBackgroundColor={theme.background.surface}
            />
          }
        >
          {notifications.length === 0 ? (
            <Card
              style={{
                alignItems: "center",
                paddingVertical: spacing.xl,
                paddingHorizontal: spacing.lg,
              }}
            >
              <Image
                source={require("../../assets/images/default-notifications.png")}
                style={{
                  width: 160,
                  height: 160,
                  resizeMode: "contain",
                }}
                accessibilityLabel="No notifications"
              />

              <AppText
                variant="bodyLargeBold"
                style={{
                  marginTop: spacing.lg,
                  textAlign: "center",
                }}
              >
                No notifications yet
              </AppText>

              <AppText
                variant="body"
                color="secondary"
                style={{
                  marginTop: spacing.sm,
                  textAlign: "center",
                  maxWidth: 340,
                  lineHeight: 28,
                }}
              >
                Notifications about your XpressStore account will appear here
                when there&apos;s something important to see.
              </AppText>
            </Card>
          ) : (
            <View
              style={{
                gap: spacing.sm,
              }}
            >
              {notifications.map((notification) => {
                const iconName = getNotificationIcon(notification.type);

                return (
                  <Pressable
                    key={notification.id}
                    accessibilityRole="button"
                    accessibilityLabel={notification.title}
                    onPress={() => handleNotificationPress(notification.id)}
                  >
                    <Card
                      style={{
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.md,
                        borderWidth: notification.isRead ? 0 : 1,
                        borderColor: notification.isRead
                          ? "transparent"
                          : theme.icon.branding.icon,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: spacing.md,
                        }}
                      >
                        {/* Notification icon */}
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.icon.default.background,
                          }}
                        >
                          <Ionicons
                            name={iconName}
                            size={24}
                            color={theme.icon.default.icon}
                          />
                        </View>

                        {/* Notification content */}
                        <View
                          style={{
                            flex: 1,
                            gap: spacing.xs,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-start",
                              gap: spacing.sm,
                            }}
                          >
                            <AppText
                              variant="bodyLargeBold"
                              style={{
                                flex: 1,
                              }}
                            >
                              {notification.title}
                            </AppText>

                            {!notification.isRead && (
                              <View
                                style={{
                                  width: 8,
                                  height: 8,
                                  marginTop: 6,
                                  borderRadius: 4,
                                  backgroundColor: theme.icon.branding.icon,
                                }}
                              />
                            )}
                          </View>

                          <AppText
                            variant="body"
                            color="secondary"
                            style={{
                              lineHeight: 22,
                            }}
                          >
                            {notification.message}
                          </AppText>

                          <AppText
                            variant="caption"
                            color="secondary"
                            style={{
                              marginTop: spacing.xs,
                            }}
                          >
                            {formatNotificationDate(notification.createdAt)}
                          </AppText>
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
