import {
  Pressable,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
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

import { useProfile } from "@/hooks/use-profile";

import { supabase } from "@/services/supabase/client";

import { Alert } from "react-native";

import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";

import { formatCurrency } from "@/utils/formatCurrency";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { ROUTES } from "@/navigation/routes";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import { PaymentChannel } from "@/types/transaction";

import { formatDateTime } from "@/utils/formatters/date";

export default function HomeScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const { profile, refetch: refetchProfile } = useProfile();

  const { data: stats, refetch: refetchDashboardStats } = useDashboardStats();

  const { data: transactions = [], refetch: refetchTransactions } =
    useTransactions();

  const recentTransactions = transactions.slice(0, 5);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        refetchProfile(),
        refetchDashboardStats(),
        refetchTransactions(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  async function handleLogout() {
    try {
      await clearSession();
      setAuthenticated(false);
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  }

  const paymentChannelIcons: Record<
    PaymentChannel,
    React.ComponentProps<typeof Ionicons>["name"]
  > = {
    bank: "business-outline",
    card: "card-outline",
    qr: "qr-code-outline",
    transfer: "swap-horizontal-outline",
    ussd: "keypad-outline",
  };

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
        }}
      >
        {/* HEADER */}

        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-between",

            alignItems: "center",

            // paddingTop: spacing.md,
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

            <AppText variant="h1">{profile?.full_name ?? "Merchant"}</AppText>
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

        {/* SCROLLABLE CONTENT */}

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing.xl,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.icon.branding.icon}
              colors={[theme.icon.branding.icon]}
              progressBackgroundColor={theme.background.surface}
            />
          }
        >
          {/* STATS CARD */}

          {stats && (
            <DashboardStatsCard
              title="Today's Revenue"
              amount={formatCurrency(stats.todayRevenue, stats.currency)}
              trend={`${stats.growth}%`}
              metrics={[
                {
                  label: "This Week",
                  value: formatCurrency(stats.weekRevenue, stats.currency),
                },
                {
                  label: "Orders",
                  value: stats.orders.toString(),
                },
                {
                  label: "New Clients",
                  value: stats.newCustomers.toString(),
                },
              ]}
            />
          )}

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
              <Pressable
                onPress={() => router.push("/more/payment-link")}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.sm,

                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,

                    borderWidth: 1,
                    borderRadius: radius.md,

                    backgroundColor: theme.card.default.background,
                    borderColor: theme.card.default.border,

                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="link" size={24} color={theme.text.primary} />

                <AppText variant="button">Payment Link</AppText>
              </Pressable>

              <Pressable
                onPress={() => router.push("/store")}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.sm,

                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,

                    borderWidth: 1,
                    borderRadius: radius.md,

                    backgroundColor: theme.card.default.background,
                    borderColor: theme.card.default.border,

                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={24}
                  color={theme.text.primary}
                />

                <AppText variant="button">Storefront</AppText>
              </Pressable>
            </View>
          </View>

          {/* RECENT TRANSACTIONS */}

          {/* RECENT TRANSACTIONS */}

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

              <Pressable onPress={() => router.push(ROUTES.TRANSACTIONS)}>
                <AppText variant="bodySmallBold" color="link">
                  View All
                </AppText>
              </Pressable>
            </View>

            <Card
              style={{
                marginTop: spacing.md,

                paddingHorizontal: 0,

                paddingVertical: 0,

                overflow: "hidden",
              }}
            >
              <FlatList
                data={recentTransactions}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                  <View
                    style={{
                      paddingHorizontal: 16,

                      paddingVertical: spacing.md,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",

                        justifyContent: "space-between",
                      }}
                    >
                      {/* LEFT */}

                      <View
                        style={{
                          gap: spacing.xs,
                        }}
                      >
                        <AppText variant="body" color="secondary">
                          {item.customer}
                        </AppText>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.xs,
                          }}
                        >
                          <Ionicons
                            name={paymentChannelIcons[item.channel]}
                            size={16}
                            color={
                              item.type === "credit"
                                ? theme.icon.success.icon
                                : theme.icon.error.icon
                            }
                          />

                          <AppText
                            variant="bodySmallBold"
                            color={item.type === "credit" ? "success" : "error"}
                          >
                            {item.type === "credit" ? "Credit" : "Debit"}
                          </AppText>

                          <Divider
                            orientation="vertical"
                            variant="strong"
                            length={12}
                          />

                          <AppText variant="bodySmall" color="secondary">
                            {formatDateTime(new Date(item.createdAt))}
                          </AppText>
                        </View>
                      </View>

                      {/* RIGHT */}

                      <View
                        style={{
                          alignItems: "flex-end",

                          gap: spacing.xs,
                        }}
                      >
                        <AppText variant="bodyBold">
                          {formatCurrency(item.amount, {
                            currency: item.currency,
                          })}
                        </AppText>

                        <AppText variant="bodySmall" color="secondary">
                          {item.reference}
                        </AppText>
                      </View>
                    </View>
                  </View>
                )}
              />
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
