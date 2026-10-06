import {
  Alert,
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

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { Notification } from "@/types/notification";

import { useNotificationStore } from "@/store/notifications/notificationStore";

/**
 * ============================================================================
 * NOTIFICATION SCREEN
 * ============================================================================
 */

export default function NotificationInboxScreen() {
  const insets = useSafeAreaInsets();

  /**
   * ==========================================================================
   * NOTIFICATION STORE
   * ==========================================================================
   */

  const notifications = useNotificationStore((state) => state.notifications);

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications
  );

  const resetNotifications = useNotificationStore(
    (state) => state.resetNotifications
  );

  /**
   * ==========================================================================
   * LOCAL STATE
   * ==========================================================================
   */

  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * ==========================================================================
   * DERIVED STATE
   * ==========================================================================
   */

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  /**
   * ==========================================================================
   * REFRESH NOTIFICATIONS
   * ==========================================================================
   *
   * For now notifications are mocked. When the backend inbox endpoint is
   * available, resetNotifications() can be replaced with the API query.
   */

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);

    setTimeout(() => {
      resetNotifications();
      setIsRefreshing(false);
    }, 500);
  }, [resetNotifications]);

  /**
   * ==========================================================================
   * MARK NOTIFICATION AS READ
   * ==========================================================================
   */

  const handleNotificationPress = useCallback(
    (notificationId: string) => {
      markAsRead(notificationId);
    },
    [markAsRead]
  );

  /**
   * ==========================================================================
   * MARK ALL NOTIFICATIONS AS READ
   * ==========================================================================
   */

  const handleMarkAllAsRead = useCallback(() => {
    if (unreadCount === 0) {
      return;
    }

    markAllAsRead();
  }, [markAllAsRead, unreadCount]);

  /**
   * ==========================================================================
   * CLEAR ALL NOTIFICATIONS
   * ==========================================================================
   */

  const handleClearNotifications = useCallback(() => {
    if (notifications.length === 0) {
      return;
    }

    Alert.alert(
      "Clear notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearNotifications,
        },
      ]
    );
  }, [clearNotifications, notifications.length]);

  /**
   * ==========================================================================
   * NOTIFICATION ICON
   * ==========================================================================
   */

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

  /**
   * ==========================================================================
   * DATE HELPERS
   * ==========================================================================
   */

  const getDateKey = (date: string) => {
    const notificationDate = new Date(date);

    return `${notificationDate.getFullYear()}-${String(
      notificationDate.getMonth() + 1
    ).padStart(2, "0")}-${String(notificationDate.getDate()).padStart(2, "0")}`;
  };

  const isToday = (date: string) => {
    const notificationDate = new Date(date);
    const today = new Date();

    return (
      notificationDate.getFullYear() === today.getFullYear() &&
      notificationDate.getMonth() === today.getMonth() &&
      notificationDate.getDate() === today.getDate()
    );
  };

  const isYesterday = (date: string) => {
    const notificationDate = new Date(date);
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return (
      notificationDate.getFullYear() === yesterday.getFullYear() &&
      notificationDate.getMonth() === yesterday.getMonth() &&
      notificationDate.getDate() === yesterday.getDate()
    );
  };

  const formatDateHeading = (date: string) => {
    if (isToday(date)) {
      return "TODAY";
    }

    if (isYesterday(date)) {
      return "YESTERDAY";
    }

    const notificationDate = new Date(date);

    return notificationDate
      .toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatNotificationDate = (date: string) => {
    const notificationDate = new Date(date);

    return notificationDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * ==========================================================================
   * GROUP NOTIFICATIONS BY DATE
   * ==========================================================================
   */

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};

    notifications.forEach((notification) => {
      const key = getDateKey(notification.createdAt);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(notification);
    });

    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [notifications]);

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
   */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="dark" />

      {/* ================================================================== 
          FIXED HEADER
      ================================================================== */}

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* BACK BUTTON */}

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
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -spacing.xs,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={theme.text.primary}
            />
          </Pressable>

          {/* TITLE + SUBTITLE */}

          <View
            style={{
              flex: 1,
              marginLeft: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <AppText
                variant="h1"
                style={{
                  flex: 1,
                }}
              >
                Notifications
              </AppText>

              {unreadCount > 0 && (
                <View
                  style={{
                    minWidth: 28,
                    height: 28,
                    paddingHorizontal: spacing.xs,
                    borderRadius: radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.background.pending,
                  }}
                >
                  <AppText
                    variant="caption"
                    color="inverse"
                    style={{
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </AppText>
                </View>
              )}
            </View>

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                marginTop: spacing.xs,
              }}
            >
              Stay up to date with activity on your account
            </AppText>
          </View>
        </View>

        {/* MARK ALL AS READ */}

        {unreadCount > 0 && (
          <View
            style={{
              alignItems: "flex-end",
              marginTop: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
              onPress={handleMarkAllAsRead}
              hitSlop={8}
            >
              <AppText
                variant="bodySmall"
                style={{
                  color: theme.icon.branding.icon,
                  fontWeight: "700",
                }}
              >
                Mark all as read
              </AppText>
            </Pressable>
          </View>
        )}
      </View>

      {/* ==================================================================
          SCROLLABLE CONTENT
      ================================================================== */}

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          // paddingTop: spacing.lg,
          // paddingBottom: spacing.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.icon.branding.icon}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================
            NOTIFICATIONS
        ================================================================ */}

        {notifications.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing["3xl"] ?? spacing.xl,
            }}
          >
            <Image
              source={require("../../assets/images/default-notifications.png")}
              accessibilityLabel="No notifications"
              resizeMode="contain"
              style={{
                width: 180,
                height: 180,
              }}
            />

            <AppText
              variant="h3"
              style={{
                marginTop: spacing.lg,
                textAlign: "center",
              }}
            >
              No notifications yet
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                marginTop: spacing.sm,
                textAlign: "center",
                maxWidth: 300,
              }}
            >
              Notifications about your XpressStore account will appear here
            </AppText>
          </View>
        ) : (
          <>
            {/* ============================================================
                NOTIFICATION GROUPS
            ============================================================ */}

            {groupedNotifications.map(([dateKey, items]) => {
              const firstNotification = items[0];

              if (!firstNotification) {
                return null;
              }

              return (
                <View
                  key={dateKey}
                  style={{
                    marginTop: spacing.xl,
                  }}
                >
                  {/* DATE HEADING */}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.sm,
                      marginBottom: spacing.md,
                    }}
                  >
                    <AppText
                      variant="bodySmall"
                      style={{
                        fontWeight: "700",
                        letterSpacing: 1,
                        color: theme.text.secondary,
                      }}
                    >
                      {formatDateHeading(firstNotification.createdAt)}
                    </AppText>

                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: theme.divider.strong,
                      }}
                    />
                  </View>

                  {/* NOTIFICATIONS */}

                  {items.map((notification) => {
                    const iconName = getNotificationIcon(notification.type);

                    return (
                      <Pressable
                        key={notification.id}
                        accessibilityRole="button"
                        accessibilityLabel={notification.title}
                        onPress={() => handleNotificationPress(notification.id)}
                        style={{
                          marginBottom: spacing.md,
                        }}
                      >
                        <Card
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            borderWidth: notification.isRead ? 0 : 1,
                            borderColor: notification.isRead
                              ? "transparent"
                              : theme.divider.strong,
                            backgroundColor: theme.card.default.background,
                            padding: spacing.lg,
                          }}
                        >
                          {/* UNREAD ACCENT */}

                          {!notification.isRead && (
                            <View
                              style={{
                                position: "absolute",
                                left: 0,
                                top: spacing.lg,
                                bottom: spacing.lg,
                                width: 3,
                                backgroundColor: theme.icon.branding.icon,
                              }}
                            />
                          )}

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: spacing.md,
                            }}
                          >
                            {/* NOTIFICATION ICON */}

                            <View
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: radius.full,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: theme.icon.default.background,
                              }}
                            >
                              <Ionicons
                                name={iconName}
                                size={22}
                                color={theme.icon.default.icon}
                              />
                            </View>

                            {/* NOTIFICATION CONTENT */}

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
                                      width: 10,
                                      height: 10,
                                      borderRadius: radius.full,
                                      backgroundColor: theme.icon.branding.icon,
                                    }}
                                  />
                                )}
                              </View>

                              <AppText
                                variant="body"
                                color="secondary"
                                style={{
                                  lineHeight: 26,
                                }}
                              >
                                {notification.message}
                              </AppText>

                              <AppText
                                variant="bodySmall"
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
              );
            })}

            {/* ============================================================
                CLEAR NOTIFICATIONS
            ============================================================ */}

            {notifications.length > 0 && (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: spacing.lg,
                  paddingBottom: spacing.xl,
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear notifications"
                  onPress={handleClearNotifications}
                  hitSlop={8}
                >
                  <AppText
                    variant="bodySmall"
                    style={{
                      color: theme.text.error,
                      fontWeight: "700",
                    }}
                  >
                    Clear notifications
                  </AppText>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
