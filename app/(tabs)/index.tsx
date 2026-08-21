import { Pressable, View, ScrollView, RefreshControl } from "react-native";

import { useMemo, useState } from "react";

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

import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

import { USE_MOCK_TRANSACTIONS } from "@/mocks/config";

/**
 * ============================================================================
 * MOCK CONFIGURATION
 * ============================================================================
 *
 * Dashboard and merchant profile continue to use the existing Home screen
 * mock configuration.
 *
 * Transactions now use the centralized transaction mock configuration:
 *
 * src/mocks/config.ts
 *
 * USE_MOCK_TRANSACTIONS
 *
 * This keeps transaction mock mode consistent across:
 *
 * - Home
 * - Transactions
 * - Transaction Details
 * ============================================================================
 */

const USE_MOCK_DASHBOARD = true;

/**
 * ============================================================================
 * MOCK MERCHANT PROFILE
 * ============================================================================
 */

const MOCK_PROFILE = {
  businessName: "Jeremiah Fashion Store",
};

/**
 * ============================================================================
 * MOCK DASHBOARD
 * ============================================================================
 */

const MOCK_DASHBOARD = {
  summary: {
    totalRevenue: 4850000,
    totalTransactions: 128,
    pendingSettlements: 7,
    revenueChangePercent: 12.5,
  },
};

/**
 * ============================================================================
 * HOME SCREEN
 * ============================================================================
 */

export default function HomeScreen() {
  /**
   * --------------------------------------------------------------------------
   * MERCHANT PROFILE
   * --------------------------------------------------------------------------
   */

  const {
    profile: apiProfile,
    isLoading: profileLoadingApi,
    refetch: refetchProfile,
  } = useMerchantProfile();

  /**
   * --------------------------------------------------------------------------
   * DASHBOARD
   * --------------------------------------------------------------------------
   */

  const {
    dashboard: apiDashboard,
    refetch: refetchDashboard,
    isLoading: dashboardLoadingApi,
  } = useDashboard();

  /**
   * --------------------------------------------------------------------------
   * TRANSACTIONS API
   * --------------------------------------------------------------------------
   *
   * The API hook is always called.
   *
   * We choose between the API data and the shared mock data below based on:
   *
   * USE_MOCK_TRANSACTIONS
   */

  const { data: transactionsData, refetch: refetchTransactions } =
    useTransactions();

  /**
   * --------------------------------------------------------------------------
   * API TRANSACTIONS
   * --------------------------------------------------------------------------
   */

  const apiTransactions = transactionsData?.transactions ?? [];

  /**
   * --------------------------------------------------------------------------
   * DATA SOURCE
   * --------------------------------------------------------------------------
   *
   * Dashboard/profile:
   *
   * USE_MOCK_DASHBOARD
   *
   * Transactions:
   *
   * USE_MOCK_TRANSACTIONS
   *
   * This is important because transaction mock mode is now controlled from:
   *
   * src/mocks/config.ts
   */

  const profile = USE_MOCK_DASHBOARD ? MOCK_PROFILE : apiProfile;

  const dashboard = USE_MOCK_DASHBOARD ? MOCK_DASHBOARD : apiDashboard;

  const transactions = USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS
    : apiTransactions;

  /**
   * --------------------------------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------------------------------
   */

  const profileLoading = USE_MOCK_DASHBOARD ? false : profileLoadingApi;

  const dashboardLoading = USE_MOCK_DASHBOARD ? false : dashboardLoadingApi;

  /**
   * --------------------------------------------------------------------------
   * RECENT TRANSACTIONS
   * --------------------------------------------------------------------------
   *
   * Only show the first 5 transactions on Home.
   *
   * The complete transaction list remains available on:
   *
   * /more/transactions
   */

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);

    try {
      /**
       * ----------------------------------------------------------------------
       * MOCK MODE
       * ----------------------------------------------------------------------
       *
       * If all currently displayed data is mocked, there is nothing to
       * actually refetch.
       *
       * Keep the refresh interaction so the UI behaves consistently with
       * the API version.
       */

      if (USE_MOCK_DASHBOARD && USE_MOCK_TRANSACTIONS) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        return;
      }

      /**
       * ----------------------------------------------------------------------
       * API MODE
       * ----------------------------------------------------------------------
       *
       * Refetch only the data sources that are currently using the API.
       */

      const refetchPromises: Promise<unknown>[] = [];

      if (!USE_MOCK_DASHBOARD) {
        refetchPromises.push(refetchProfile(), refetchDashboard());
      }

      if (!USE_MOCK_TRANSACTIONS) {
        refetchPromises.push(refetchTransactions());
      }

      await Promise.all(refetchPromises);
    } finally {
      setRefreshing(false);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * TRANSACTION STATE
   * --------------------------------------------------------------------------
   */

  const hasTransactions =
    (dashboard?.summary.totalTransactions ?? 0) > 0 || transactions.length > 0;

  /**
   * --------------------------------------------------------------------------
   * EMPTY DASHBOARD
   * --------------------------------------------------------------------------
   */

  const showEmptyDashboard = !dashboardLoading && !hasTransactions;

  /**
   * --------------------------------------------------------------------------
   * DASHBOARD STATISTICS
   * --------------------------------------------------------------------------
   */

  const showDashboardStats =
    !dashboardLoading && !!dashboard && hasTransactions;

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
   */

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
        {/* ==================================================================
            HEADER
        ================================================================== */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* GREETING */}

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

          {/* NOTIFICATIONS */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
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

        {/* ==================================================================
            SCROLLABLE CONTENT
        ================================================================== */}

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
          {/* ================================================================
              DASHBOARD
          ================================================================ */}

          {showDashboardStats && dashboard && (
            <DashboardStatsCard
              title="Total Revenue"
              amount={formatCurrency(dashboard.summary.totalRevenue, {
                currency: "NGN",
              })}
              trend={`${dashboard.summary.revenueChangePercent}%`}
              metrics={[
                {
                  label: "Revenue",
                  value: formatCurrency(dashboard.summary.totalRevenue, {
                    currency: "NGN",
                  }),
                },

                {
                  label: "Transactions",
                  value: dashboard.summary.totalTransactions.toString(),
                },

                {
                  label: "Pending",
                  value: dashboard.summary.pendingSettlements.toString(),
                },
              ]}
            />
          )}

          {/* ================================================================
              EMPTY DASHBOARD
          ================================================================ */}

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
                {/* ICON */}

                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.full,
                    backgroundColor: theme.icon.default.background,
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
                  Your sales and transaction activity will appear here once you
                  receive your first payment.
                </AppText>
              </View>
            </Card>
          )}

          {/* ================================================================
              QUICK ACTIONS
          ================================================================ */}

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
              {/* PAYMENT LINK */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Payment Link"
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

              {/* STOREFRONT */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Storefront"
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

          {/* ================================================================
              RECENT TRANSACTIONS
          ================================================================ */}

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
              <AppText variant="h3">Recent Transactions</AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all transactions"
                onPress={() => router.push(ROUTES.TRANSACTIONS)}
              >
                <AppText variant="bodySmallBold" color="link">
                  View All
                </AppText>
              </Pressable>
            </View>

            {/* TRANSACTION LIST */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              {recentTransactions.length > 0 ? (
                <TransactionList transactions={recentTransactions} />
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
                    Your recent transactions will appear here.
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
