import {
  Pressable,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme, radius } from "@/theme";

import { router } from "expo-router";

import { Card } from "@/components/ui/Card";

import { Ionicons } from "@expo/vector-icons";

import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";

import { formatCurrency } from "@/utils/formatCurrency";

import { useDashboard } from "@/hooks/dashboard/useDashboard";

import { ROUTES } from "@/navigation/routes";

import { useTransactions } from "@/hooks/transactions/useTransactions";

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

  const {
    data: transactionsData,
    refetch: refetchTransactions,
  } = useTransactions();

  const transactions = transactionsData?.transactions ?? [];

  const recentTransactions = transactions.slice(0, 5);

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

  /*
   * A merchant has transactions if either:
   *
   * 1. The dashboard API says there are transactions, OR
   * 2. The transactions API returned transactions.
   *
   * This is useful because a first-time merchant may not have
   * a dashboard object at all.
   */
  const hasTransactions =
    (dashboard?.summary.totalTransactions ?? 0) > 0 ||
    transactions.length > 0;

  /*
   * Only show the empty dashboard after the dashboard request
   * has finished loading.
   */
  const showEmptyDashboard =
    !dashboardLoading && !hasTransactions;

  /*
   * Only show statistics when we actually have dashboard data
   * and the merchant has transactions.
   */
  const showDashboardStats =
    !dashboardLoading && !!dashboard && hasTransactions;

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
          {/* DASHBOARD */}

          {showDashboardStats && dashboard && (
            <DashboardStatsCard
              title="Total Revenue"
              amount={formatCurrency(
                dashboard.summary.totalRevenue,
                {
                  currency: "NGN",
                }
              )}
              trend={`${dashboard.summary.revenueChangePercent}%`}
              metrics={[
                {
                  label: "Revenue",
                  value: formatCurrency(
                    dashboard.summary.totalRevenue,
                    {
                      currency: "NGN",
                    }
                  ),
                },
                {
                  label: "Transactions",
                  value:
                    dashboard.summary.totalTransactions.toString(),
                },
                {
                  label: "Pending",
                  value:
                    dashboard.summary.pendingSettlements.toString(),
                },
              ]}
            />
          )}

          {/* FIRST-TIME USER / EMPTY DASHBOARD */}

          {showEmptyDashboard && (
            <Card
              style={{
                marginTop: spacing.lg,
                padding: spacing.lg,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                {/* EMPTY STATE ICON */}

                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.full,
                    backgroundColor:
                      theme.icon.default.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="bar-chart-outline"
                    size={28}
                    color={theme.icon.default.icon}
                  />
                </View>

                {/* TITLE */}

                <AppText
                  variant="h3"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No transactions yet
                </AppText>

                {/* DESCRIPTION */}

                <AppText
                  variant="bodySmall"
                  color="secondary"
                  style={{
                    textAlign: "center",
                  }}
                >
                  Your sales and transaction activity will
                  appear here once you receive your first
                  payment.
                </AppText>

                {/* CTA

                <Pressable
                  onPress={() =>
                    router.push("/more/payment-link")
                  }
                  style={({ pressed }) => ({
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: spacing.md,
                    marginTop: spacing.sm,
                    borderRadius: radius.md,
                    backgroundColor:
                      theme.background.brand,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <AppText variant="button">
                    Create Payment Link
                  </AppText>
                </Pressable> */}
              </View>
            </Card>
          )}

          {/* QUICK ACTIONS */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <AppText variant="h3">
              Quick Actions
            </AppText>

            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginTop: spacing.md,
              }}
            >
              {/* PAYMENT LINK */}

              <Pressable
                onPress={() =>
                  router.push("/more/payment-link")
                }
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

                    backgroundColor:
                      theme.card.default.background,
                    borderColor:
                      theme.card.default.border,

                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="link"
                  size={24}
                  color={theme.text.primary}
                />

                <AppText variant="button">
                  Payment Link
                </AppText>
              </Pressable>

              {/* STOREFRONT */}

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

                    backgroundColor:
                      theme.card.default.background,
                    borderColor:
                      theme.card.default.border,

                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={24}
                  color={theme.text.primary}
                />

                <AppText variant="button">
                  Storefront
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* RECENT TRANSACTIONS */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            {/* SECTION HEADER */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="h3">
                Recent Transactions
              </AppText>

              <Pressable
                onPress={() =>
                  router.push(ROUTES.TRANSACTIONS)
                }
              >
                <AppText
                  variant="bodySmallBold"
                  color="link"
                >
                  View All
                </AppText>
              </Pressable>
            </View>

            {/* TRANSACTION LIST / EMPTY STATE */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              {recentTransactions.length > 0 ? (
                <TransactionList
                  transactions={recentTransactions}
                />
              ) : (
                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                  }}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={32}
                    color={theme.icon.default.icon}
                  />

                  <AppText
                    variant="bodyBold"
                    style={{
                      marginTop: spacing.sm,
                    }}
                  >
                    No transactions yet
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    style={{
                      textAlign: "center",
                      marginTop: spacing.xs,
                    }}
                  >
                    Your recent transactions will appear
                    here.
                  </AppText>
                </Card>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}