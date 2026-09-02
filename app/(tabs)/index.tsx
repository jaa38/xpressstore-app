import {
  ActivityIndicator,
  Image,
  Pressable,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";

import { useEffect, useMemo, useState } from "react";

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

import { Button } from "@/components/ui/Button";

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
   */

  const profile = apiProfile;

  const dashboard = apiDashboard;

  const transactions = USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS
    : apiTransactions;

  /**
   * --------------------------------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------------------------------
   */

  const profileLoading = profileLoadingApi;

  const dashboardLoading = dashboardLoadingApi;

  const transactionsLoading =
    !USE_MOCK_TRANSACTIONS && !transactionsData && dashboardLoadingApi;

  /**
   * --------------------------------------------------------------------------
   * TIME-BASED GREETING
   * --------------------------------------------------------------------------
   *
   * Morning:
   * 05:00 - 11:59
   *
   * Afternoon:
   * 12:00 - 16:59
   *
   * Evening:
   * 17:00 - 20:59
   *
   * Night:
   * 21:00 - 04:59
   */

  const [currentHour, setCurrentHour] = useState(() => {
    return new Date().getHours();
  });

  useEffect(() => {
    const updateCurrentHour = () => {
      setCurrentHour(new Date().getHours());
    };

    const interval = setInterval(updateCurrentHour, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const greeting = useMemo(() => {
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning,";
    }

    if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon,";
    }

    if (currentHour >= 17 && currentHour < 21) {
      return "Good evening,";
    }

    return "Good night,";
  }, [currentHour]);

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
   * WEEKLY REVENUE
   * --------------------------------------------------------------------------
   *
   * Revenue is calculated from successful credit transactions.
   */

  const weeklyRevenue = useMemo(() => {
    const now = new Date();

    /**
     * Current week starts on Monday.
     */
    const currentWeekStart = new Date(now);

    const day = currentWeekStart.getDay();

    const daysSinceMonday = day === 0 ? 6 : day - 1;

    currentWeekStart.setDate(currentWeekStart.getDate() - daysSinceMonday);

    currentWeekStart.setHours(0, 0, 0, 0);

    /**
     * Previous week starts seven days before
     * the current week.
     */
    const previousWeekStart = new Date(currentWeekStart);

    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    /**
     * End of previous week.
     */
    const previousWeekEnd = new Date(currentWeekStart);

    previousWeekEnd.setMilliseconds(-1);

    /**
     * Successful credit transactions only.
     */
    const revenueTransactions = transactions.filter(
      (transaction) =>
        transaction.type === "credit" && transaction.status === "paid"
    );

    /**
     * This week's revenue.
     */
    const thisWeekRevenue = revenueTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);

        return transactionDate >= currentWeekStart;
      })
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    /**
     * Previous week's revenue.
     */
    const previousWeekRevenue = revenueTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);

        return (
          transactionDate >= previousWeekStart &&
          transactionDate <= previousWeekEnd
        );
      })
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    /**
     * Percentage change.
     */
    const revenueChangePercent =
      previousWeekRevenue === 0
        ? 0
        : ((thisWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;

    return {
      thisWeekRevenue,
      previousWeekRevenue,
      revenueChangePercent,
    };
  }, [transactions]);

  /**
   * --------------------------------------------------------------------------
   * TRANSACTION STATE
   * --------------------------------------------------------------------------
   */

  const hasTransactions =
    (dashboard?.summary.totalTransactions ?? 0) > 0 || transactions.length > 0;

  /**
   * --------------------------------------------------------------------------
   * FIRST-TIME USER
   * --------------------------------------------------------------------------
   *
   * A merchant with no transaction history is treated as a new/empty
   * dashboard rather than being shown a technical or analytics state.
   */

  const isFirstTimeUser =
    !dashboardLoading && !hasTransactions && transactions.length === 0;

  /**
   * --------------------------------------------------------------------------
   * DASHBOARD STATISTICS
   * --------------------------------------------------------------------------
   *
   * Do not show the revenue statistics card for a first-time merchant.
   */

  const showDashboardStats =
    !dashboardLoading && !!dashboard && !isFirstTimeUser;

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);

    try {
      if (USE_MOCK_TRANSACTIONS) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        await Promise.all([refetchProfile(), refetchDashboard()]);

        return;
      }

      const refetchPromises: Promise<unknown>[] = [
        refetchProfile(),
        refetchDashboard(),
        refetchTransactions(),
      ];

      await Promise.all(refetchPromises);
    } finally {
      setRefreshing(false);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * HOME CONTENT LOADING
   * --------------------------------------------------------------------------
   */

  const isInitialLoading =
    profileLoading || dashboardLoading || transactionsLoading;

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
              {greeting}
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
              INITIAL LOADING
          ================================================================ */}

          {isInitialLoading ? (
            <View
              style={{
                minHeight: 260,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                size="large"
                color={theme.icon.branding.icon}
              />

              <AppText
                color="secondary"
                style={{
                  marginTop: spacing.md,
                }}
              >
                Loading your dashboard...
              </AppText>
            </View>
          ) : (
            <>
              {/* ============================================================
                  FIRST-TIME DASHBOARD
              ============================================================ */}

              {isFirstTimeUser && (
                <Card
                  style={{
                    marginTop: spacing.lg,
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  {/* XPRESSSTORE LOGO */}

                  <Image
                    source={require("../../assets/logo/xpressStoreLogo.png")}
                    style={{
                      width: 128,
                      height: 128,
                    }}
                    resizeMode="contain"
                  />

                  <AppText
                    variant="bodyLargeBold"
                    style={{
                      marginTop: spacing.md,
                      textAlign: "center",
                    }}
                  >
                    Welcome to XpressStore
                  </AppText>

                  <AppText
                    variant="body"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,
                      textAlign: "center",
                      maxWidth: 320,
                    }}
                  >
                    Your dashboard will come to life once you start accepting
                    payments from your customers.
                  </AppText>

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      gap: spacing.sm,
                      marginTop: spacing.lg,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Button
                        title="Payment Link"
                        variant="primary"
                        onPress={() =>
                          router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)
                        }
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Button
                        title="Storefront"
                        variant='tertiary'
                        onPress={() => router.push(ROUTES.ADD_STORE_INFORMATION)}
                      />
                    </View>
                  </View>
                </Card>
              )}

              {/* ============================================================
                  DASHBOARD STATISTICS
              ============================================================ */}

              {showDashboardStats && dashboard && (
                <DashboardStatsCard
                  title="This Week's Revenue"
                  amount={formatCurrency(weeklyRevenue.thisWeekRevenue, {
                    currency: "NGN",
                  })}
                  trend={weeklyRevenue.revenueChangePercent}
                />
              )}

              {/* ============================================================
                  QUICK ACTIONS
                  Hidden for first-time users because the onboarding
                  card already provides the primary actions.
              ============================================================ */}

              {!isFirstTimeUser && (
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
                    {/* ADD PAYMENT LINK */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="New Payment Link"
                      onPress={() =>
                        router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)
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

                          backgroundColor: theme.card.default.background,

                          borderColor: theme.card.default.border,

                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="add"
                        size={24}
                        color={theme.text.primary}
                      />

                      <AppText variant="button">Payment Link</AppText>
                    </Pressable>

                    {/* ADD STOREFRONT */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Storefront"
                      onPress={() => router.push(ROUTES.ADD_STORE_INFORMATION)}
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
                        name="add"
                        size={24}
                        color={theme.text.primary}
                      />

                      <AppText variant="button">Storefront</AppText>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* ============================================================
                  RECENT TRANSACTIONS
                  Hidden for first-time users because there is no
                  transaction history to display.
              ============================================================ */}

              {!isFirstTimeUser && (
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
                          paddingVertical: spacing.lg,
                          paddingHorizontal: spacing.lg,
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
                            textAlign: "center",
                          }}
                        >
                          No recent transactions
                        </AppText>

                        <AppText
                          variant="bodySmall"
                          color="secondary"
                          style={{
                            textAlign: "center",
                            marginTop: spacing.xs,
                            maxWidth: 300,
                          }}
                        >
                          Transactions will appear here as your customers make
                          payments.
                        </AppText>
                      </Card>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
