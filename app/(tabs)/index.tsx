import {
  Pressable,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme, radius } from "@/theme";

import { Divider } from "@/components/ui/Divider";

import { router } from "expo-router";

import { Card } from "@/components/ui/Card";

import { Ionicons } from "@expo/vector-icons";

import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";

import { formatCurrency } from "@/utils/formatCurrency";

import { useDashboard } from "@/hooks/dashboard/useDashboard";

import { ROUTES } from "@/navigation/routes";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import { TransactionListItem } from "@/components/transactions/TransactionListItem";

import { TransactionList } from "@/components/transactions/TransactionList";

import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

export default function HomeScreen() {
  const {
    profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useMerchantProfile();

  const {
    dashboard,
    refetch: refetchDashboard,
    isLoading: dashboardLoading,
  } = useDashboard();

  const { data: transactions = [], refetch: refetchTransactions } =
    useTransactions();

  const recentTransactions = transactions.slice(0, 5);

  const dashboardMetrics = useMemo(() => {
    const paidTransactions = transactions.filter(
      (transaction) => transaction.status === "paid"
    );

    const pendingTransactions = transactions.filter(
      (transaction) => transaction.status === "pending"
    );

    const failedTransactions = transactions.filter(
      (transaction) => transaction.status === "failed"
    );

    return {
      paid: paidTransactions.length,
      pending: pendingTransactions.length,
      failed: failedTransactions.length,
    };
  }, [transactions]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        refetchProfile(),
        refetchDashboard(),
        refetchTransactions(),
      ]);
    } finally {
      setRefreshing(false);
    }
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

            <AppText variant="h1">
              {profileLoading
                ? "Loading..."
                : (profile?.businessName ?? "Merchant")}
            </AppText>
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

          {dashboard && (
            <DashboardStatsCard
              title="Today's Revenue"
              amount={formatCurrency(dashboard.todayRevenue, {
                currency: dashboard.currency,
              })}
              trend={`${dashboard.growth}%`}
              metrics={[
                {
                  label: "Today",
                  value: formatCurrency(dashboard.todayRevenue, {
                    currency: dashboard.currency,
                  }),
                },
                {
                  label: "Successful",
                  value: dashboard.successfulTransactions.toString(),
                },
                {
                  label: "Pending",
                  value: dashboard.pendingTransactions.toString(),
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

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <TransactionList transactions={recentTransactions} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
