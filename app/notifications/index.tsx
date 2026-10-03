import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { useCallback, useState } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

export default function NotificationInboxScreen() {
  const insets = useSafeAreaInsets();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      /**
       * Notification inbox API is not currently available.
       *
       * When the backend exposes a notifications endpoint,
       * this is where the query/refetch will be triggered.
       */
    } finally {
      setIsRefreshing(false);
    }
  }, []);

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
            <AppText variant="h1">Notifications</AppText>

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
            flexGrow: 1,
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
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
            }}
          >
            <Card
              style={{
                alignItems: "center",
                paddingVertical: spacing.xl,
                paddingHorizontal: spacing.lg,
              }}
            >
              {/* Empty-state illustration */}
              <Image
                source={require("../../assets/images/default-notifications.png")}
                style={{
                  width: 160,
                  height: 160,
                  resizeMode: "contain",
                }}
                accessibilityLabel="No notifications"
              />

              {/* Heading */}
              <AppText
                variant="bodyLargeBold"
                style={{
                  marginTop: spacing.lg,
                  textAlign: "center",
                }}
              >
                No notifications yet
              </AppText>

              {/* Description */}
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
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
