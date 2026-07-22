import { Pressable, View, ScrollView, FlatList } from "react-native";
import { useEffect } from "react";
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

import { useProfile } from "@/features/home/hooks/use-profile";

import { supabase } from "@/services/supabase/client";

import { Alert } from "react-native";

import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";

import { formatCurrency } from "@/utils/formatCurrency";

import { useDashboardStats } from "@/hooks/useDashboardStats";

type PaymentChannel = "bank" | "card" | "qr" | "transfer" | "ussd";

type Transaction = {
  id: string;
  customer: string;
  type: "credit" | "debit";
  channel: PaymentChannel;
  amount: string;
  reference: string;
  time: string;
};

export default function HomeScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const { profile } = useProfile();

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

  const transactions: Transaction[] = [
    {
      id: "1",
      customer: "John Smith",
      type: "credit",
      channel: "card",
      amount: "₦1,000,000",
      reference: "XP-293AA",
      time: "Today, 12:30",
    },
    {
      id: "2",
      customer: "Mary Johnson",
      type: "credit",
      channel: "bank",
      amount: "₦250,000",
      reference: "XP-847BB",
      time: "Today, 11:05",
    },
    {
      id: "3",
      customer: "David Wilson",
      type: "debit",
      channel: "transfer",
      amount: "₦75,000",
      reference: "XP-991CC",
      time: "Today, 09:42",
    },
    {
      id: "4",
      customer: "Sarah Brown",
      type: "credit",
      channel: "qr",
      amount: "₦500,000",
      reference: "XP-552DD",
      time: "Today, 08:15",
    },
    {
      id: "5",
      customer: "Michael Davis",
      type: "credit",
      channel: "ussd",
      amount: "₦180,000",
      reference: "XP-672EE",
      time: "Yesterday, 18:20",
    },
  ];

  const { data: stats, isLoading } = useDashboardStats();

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

              <Pressable>
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
                data={transactions}
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
                            {item.time}
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
                        <AppText variant="bodyBold">{item.amount}</AppText>

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
