import { Pressable, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme, radius } from "@/theme";
import { Button } from "@/components/ui/Button";

import { Divider } from "@/components/ui/Divider";

import { router } from "expo-router";

import { clearSession } from "@/features/auth/services/session";

import { useAuthStore } from "@/features/auth/store/auth-store";

import { Card } from "@/components/ui/Card";

import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  async function handleLogout() {
    try {
      await clearSession();

      setAuthenticated(false);

      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <View
        style={{
          flex: 1,

          paddingHorizontal: spacing.lg,

          paddingTop: spacing.md,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <View
            style={{
              gap: spacing.xs,
            }}
          >
            <AppText variant="body" color="secondary">
              Good morning,
            </AppText>

            <AppText variant="h1">Jeremiah's Store</AppText>
          </View>

          <Pressable>
            <View
              style={{
                width: 40,
                height: 40,

                justifyContent: "center",

                alignItems: "center",

                backgroundColor: theme.icon.default.background,

                borderRadius: radius.full,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.icon.default.icon}
              />
            </View>
          </Pressable>
        </View>

        {/* STATS CARD */}

        <View
          style={{
            marginTop: spacing.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.lg,
            backgroundColor: theme.card.dashboard.background,
            borderRadius: radius.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <View style={{ gap: spacing.sm }}>
              <AppText
                variant="bodyLargeBold"
                style={{
                  color: theme.card.dashboard.headerText,
                }}
              >
                Today's Revenue
              </AppText>
              <AppText
                variant="displayLarge"
                style={{ color: theme.card.dashboard.text }}
              >
                ₦48,250
              </AppText>
            </View>
            <View
              style={{
                backgroundColor: theme.card.stats.background,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.rg,
                borderRadius: radius.xl,
                flexDirection: "row",
                gap: spacing.xs,
                alignItems: "center",
              }}
            >
              <Ionicons
                name="trending-up"
                size={16}
                style={{ color: theme.card.dashboard.text }}
              />
              <AppText style={{ color: theme.card.dashboard.text }}>
                24%
              </AppText>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.md,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: spacing.lg,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <AppText variant="bodySmall" color="inverse">
                  This Week
                </AppText>
                <AppText variant="bodyLargeBold" color="inverse">
                  ₦312,400
                </AppText>
              </View>
              <View>
                <Divider orientation="vertical" length={32} />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.lg,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <AppText variant="bodySmall" color="inverse">
                  Orders
                </AppText>
                <AppText variant="bodyLargeBold" color="inverse">
                  38
                </AppText>
              </View>
              <View>
                <Divider orientation="vertical" length={32} />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: spacing.lg,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <AppText variant="bodySmall" color="inverse">
                  New clients
                </AppText>
                <AppText variant="bodyLargeBold" color="inverse">
                  12
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="h3">Quick Actions</AppText>

          <View
            style={{
              flexDirection: "row",

              gap: spacing.md,

              marginTop: spacing.md,
            }}
          >
            <Card
              variant="default"
              style={{
                flex: 1,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "center",

                gap: spacing.sm,
              }}
            >
              <Ionicons name="link" size={24} color={theme.text.primary} />

              <AppText variant="button">Payment Link</AppText>
            </Card>

            <Card
              variant="default"
              style={{
                flex: 1,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "center",

                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="storefront-outline"
                size={24}
                color={theme.text.primary}
              />

              <AppText variant="button">Storefront</AppText>
            </Card>
          </View>
        </View>

        {/* Recent Transactions */}
        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AppText variant="h3">Recent Transactions</AppText>
            <AppText variant="bodySmallBold" color="link">
              View All
            </AppText>
          </View>

          
        </View>

        {/* LOGOUT BUTTON */}

        <View
          style={{
            marginTop: "auto",

            paddingBottom: spacing.lg,
          }}
        >
          <Button title="Logout" variant="primary" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}
