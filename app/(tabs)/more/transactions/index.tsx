import { useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { router } from "expo-router";

import { AppText, type Color } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { UICard } from "@/components/ui/UICard";
import { Card } from "@/components/ui/Card";
import { FilterButton } from "@/components/ui/FilterButton";

import { TransactionList } from "@/components/transactions/TransactionList";

import { TransactionFilterBottomSheet } from "@/components/bottom-sheet/TransactionFilterBottomSheet";

import { spacing, theme, radius } from "@/theme";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import type { TransactionsQueryFilters } from "@/services/transactions/transactions-service";

import { formatCurrency } from "@/utils/formatters/currency";

import { defaultTransactionFilters } from "@/constants/defaultTransactionFilters";

import { TransactionFilters } from "@/types/transactionFilters";

import { ROUTES } from "@/navigation/routes";

export default function TransactionsScreen() {
  /**
   * -------------------------------------------------------------------------
   * STATE
   * -------------------------------------------------------------------------
   */

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<TransactionFilters>(
    defaultTransactionFilters
  );

  const [draftFilters, setDraftFilters] = useState<TransactionFilters>(
    defaultTransactionFilters
  );

  const pageSize = 20;

  const transactionFilterRef = useRef<BottomSheetModal>(null);

  /**
   * -------------------------------------------------------------------------
   * SERVER FILTERS
   * -------------------------------------------------------------------------
   */

  const serverFilters = useMemo<TransactionsQueryFilters>(() => {
    return {
      status:
        filters.status === "all"
          ? null
          : filters.status === "paid"
            ? "Successful"
            : filters.status === "pending"
              ? "Pending"
              : "Failed",

      startDate: filters.date.start ? filters.date.start.toISOString() : null,

      endDate: filters.date.end ? filters.date.end.toISOString() : null,
    };
  }, [filters.status, filters.date.start, filters.date.end]);

  /**
   * -------------------------------------------------------------------------
   * TRANSACTIONS
   * -------------------------------------------------------------------------
   */

  const {
    data: transactionsData,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useTransactions(currentPage, pageSize, serverFilters);

  const transactions = transactionsData?.transactions ?? [];

  const totalCount = transactionsData?.totalCount ?? 0;

  const pageNumber = transactionsData?.pageNumber ?? currentPage;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const hasPreviousPage = pageNumber > 1;

  const hasNextPage = pageNumber < totalPages;

  /**
   * -------------------------------------------------------------------------
   * REFRESH
   * -------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    await refetch();
  };

  /**
   * -------------------------------------------------------------------------
   * CLIENT-SIDE FILTERING
   * -------------------------------------------------------------------------
   */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesChannel =
        filters.channel === "all" || transaction.channel === filters.channel;

      const matchesType =
        filters.type === "all" || transaction.type === filters.type;

      const matchesAmount =
        (filters.amount.min == null ||
          transaction.amount >= filters.amount.min) &&
        (filters.amount.max == null ||
          transaction.amount <= filters.amount.max);

      const matchesSearch =
        query.length === 0 ||
        transaction.customer.toLowerCase().includes(query) ||
        transaction.reference.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        formatCurrency(transaction.amount, {
          currency: transaction.currency,
        })
          .toLowerCase()
          .includes(query);

      return matchesChannel && matchesType && matchesAmount && matchesSearch;
    });
  }, [
    transactions,
    filters.channel,
    filters.type,
    filters.amount.min,
    filters.amount.max,
    search,
  ]);

  /**
   * -------------------------------------------------------------------------
   * FILTER STATE
   * -------------------------------------------------------------------------
   */

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.channel !== "all" ||
    filters.type !== "all" ||
    filters.amount.min != null ||
    filters.amount.max != null ||
    filters.date.start != null ||
    filters.date.end != null;

  /**
   * -------------------------------------------------------------------------
   * SCREEN STATES
   * -------------------------------------------------------------------------
   *
   * Architecture:
   *
   * 1. Initial loading
   * 2. First-time user / no transactions
   * 3. Error after transactions already exist
   * 4. Search / filter empty
   * 5. Transaction list
   *
   * IMPORTANT:
   *
   * A backend error with zero transactions is treated as the first-time
   * empty state. This prevents a new merchant from seeing a technical
   * error before they have ever made a payment.
   */

  const isFirstTimeUser =
    !isLoading && totalCount === 0 && !hasActiveFilters && search.trim() === "";

  const showTransactionError = !isLoading && !!error && totalCount > 0;

  const hasNoResults =
    !isLoading &&
    !showTransactionError &&
    !isFirstTimeUser &&
    filteredTransactions.length === 0;

  /**
   * -------------------------------------------------------------------------
   * SUMMARY
   * -------------------------------------------------------------------------
   */

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  }, [filteredTransactions]);

  const activeFilterLabel =
    filters.status !== "all"
      ? filters.status
      : filters.channel !== "all"
        ? filters.channel
        : filters.type !== "all"
          ? filters.type
          : null;

  const summaryTitle =
    activeFilterLabel === null
      ? "Transaction Value"
      : `${activeFilterLabel.charAt(0).toUpperCase()}${activeFilterLabel.slice(
          1
        )} Value`;

  const summaryAmount = formatCurrency(totalAmount);

  const summaryCount = filteredTransactions.length;

  const summaryLabel =
    activeFilterLabel === null
      ? "Transactions"
      : activeFilterLabel.charAt(0).toUpperCase() + activeFilterLabel.slice(1);

  const summaryStatusColors: Record<TransactionFilters["status"], Color> = {
    all: "strong",
    paid: "success",
    pending: "warning",
    failed: "error",
  };

  const summaryStatusColor = summaryStatusColors[filters.status];

  /**
   * -------------------------------------------------------------------------
   * HEADER
   * -------------------------------------------------------------------------
   */

  const headerSubtitle = isLoading
    ? "Loading transactions..."
    : isFirstTimeUser
      ? "Start accepting payments"
      : filteredTransactions.length === 1
        ? "1 transaction"
        : `${filteredTransactions.length} transactions`;

  /**
   * -------------------------------------------------------------------------
   * STATUS FILTER OPTIONS
   * -------------------------------------------------------------------------
   */

  const filterOptions = [
    {
      key: "all" as const,
      title: "All",
    },
    {
      key: "paid" as const,
      title: "Paid",
    },
    {
      key: "pending" as const,
      title: "Pending",
    },
    {
      key: "failed" as const,
      title: "Failed",
    },
  ] satisfies {
    key: TransactionFilters["status"];
    title: string;
  }[];

  /**
   * -------------------------------------------------------------------------
   * FILTER HANDLERS
   * -------------------------------------------------------------------------
   */

  const handleStatusChange = (status: TransactionFilters["status"]) => {
    const nextFilters: TransactionFilters = {
      ...filters,
      status,
    };

    setFilters(nextFilters);
    setDraftFilters(nextFilters);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(defaultTransactionFilters);

    setDraftFilters(defaultTransactionFilters);

    setCurrentPage(1);
  };

  /**
   * -------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          {/* ===============================================================
              HEADER
          =============================================================== */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* Back */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.text.primary}
              />
            </Pressable>

            {/* Title */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Transactions</AppText>

              <AppText variant="body" color="secondary">
                {headerSubtitle}
              </AppText>
            </View>
          </View>

          {/* ===============================================================
              CONTENT
          =============================================================== */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* =============================================================
                SUMMARY
            ============================================================= */}

            <Card
              variant="active"
              style={{
                marginTop: spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* LEFT */}

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: radius.full,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: theme.icon.branding.background,
                    }}
                  >
                    <Ionicons
                      name="receipt-outline"
                      size={28}
                      color={theme.icon.branding.icon}
                    />
                  </View>

                  <View
                    style={{
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodySmallBold" color="muted">
                      {summaryTitle}
                    </AppText>

                    <AppText variant="h2">
                      {isLoading ? "—" : summaryAmount}
                    </AppText>
                  </View>
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    marginHorizontal: spacing.md,
                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* RIGHT */}

                <View
                  style={{
                    minWidth: 84,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Transactions
                  </AppText>

                  <AppText variant="h2">
                    {isLoading ? "—" : summaryCount}
                  </AppText>

                  <AppText variant="caption" color={summaryStatusColor}>
                    {summaryLabel}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* =============================================================
                SEARCH + FILTER
            ============================================================= */}

            {!isFirstTimeUser && !showTransactionError && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                  marginTop: spacing.md,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <SearchBar
                    value={search}
                    onChangeText={(value) => {
                      setSearch(value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by transaction ID, customer or amount"
                  />
                </View>

                <FilterButton
                  active={hasActiveFilters}
                  onPress={() => {
                    setDraftFilters(filters);

                    transactionFilterRef.current?.present();
                  }}
                />
              </View>
            )}

            {/* =============================================================
                STATUS FILTERS
            ============================================================= */}

            {!isFirstTimeUser && !showTransactionError && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: spacing.md,
                  gap: spacing.sm,
                }}
              >
                {filterOptions.map((filter) => (
                  <UICard
                    key={filter.key}
                    title={filter.title}
                    variant={
                      filters.status === filter.key ? "active" : "default"
                    }
                    onPress={() => handleStatusChange(filter.key)}
                  />
                ))}
              </View>
            )}

            {/* =============================================================
                TRANSACTION CONTENT
            ============================================================= */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
            >
              <ScrollView
                style={{
                  flex: 1,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={onRefresh}
                    tintColor={theme.icon.branding.icon}
                    colors={[theme.icon.branding.icon]}
                    progressBackgroundColor={theme.background.surface}
                  />
                }
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: spacing.md,
                }}
              >
                {/* =========================================================
                    1. INITIAL LOADING
                ========================================================= */}

                {isLoading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: spacing["3xl"],
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
                      Loading transactions...
                    </AppText>
                  </View>
                ) : isFirstTimeUser ? (
                  /* =======================================================
                     2. FIRST-TIME USER
                  ======================================================= */

                  <Card
                    style={{
                      alignItems: "center",
                      paddingVertical: spacing.xl,
                      paddingHorizontal: spacing.lg,
                    }}
                  >
                    {/* ICON */}

                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: radius.full,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.icon.branding.background,
                      }}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={32}
                        color={theme.icon.branding.icon}
                      />
                    </View>

                    {/* TITLE */}

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                        textAlign: "center",
                      }}
                    >
                      No transactions yet
                    </AppText>

                    {/* DESCRIPTION */}

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        marginTop: spacing.xs,
                        textAlign: "center",
                        maxWidth: 320,
                      }}
                    >
                      Transactions will appear here when customers make payments
                      through your store.
                    </AppText>

                    {/* CTA */}

                    <Button
                      title="Create Payment Link"
                      variant="primary"
                      style={{
                        marginTop: spacing.lg,
                      }}
                      onPress={() =>
                        router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION)
                      }
                    />

                    <AppText
                      variant="caption"
                      color="muted"
                      style={{
                        marginTop: spacing.sm,
                        textAlign: "center",
                      }}
                    >
                      Start accepting payments by creating your first payment
                      link.
                    </AppText>
                  </Card>
                ) : showTransactionError ? (
                  /* =======================================================
                     3. ERROR
                  ======================================================= */

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: spacing["3xl"],
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.background.error,
                      }}
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color={theme.icon.error.icon}
                      />
                    </View>

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                        textAlign: "center",
                      }}
                    >
                      Unable to load transactions
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
                      We couldn't load your transactions. Please try again.
                    </AppText>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Try again"
                      onPress={() => refetch()}
                      style={{
                        marginTop: spacing.md,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.sm,
                      }}
                    >
                      <AppText color="link">Try Again</AppText>
                    </Pressable>
                  </View>
                ) : hasNoResults ? (
                  /* =======================================================
                     4. SEARCH / FILTER EMPTY
                  ======================================================= */

                  <Card
                    style={{
                      alignItems: "center",
                      paddingVertical: spacing.xl,
                      paddingHorizontal: spacing.lg,
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: radius.full,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.icon.default.background,
                      }}
                    >
                      <Ionicons
                        name="search-outline"
                        size={28}
                        color={theme.icon.default.icon}
                      />
                    </View>

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                        textAlign: "center",
                      }}
                    >
                      No transactions found
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        marginTop: spacing.xs,
                        textAlign: "center",
                      }}
                    >
                      Try searching with a different transaction ID, customer or
                      amount.
                    </AppText>

                    {search.trim() !== "" && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Clear search"
                        onPress={clearSearch}
                        style={{
                          marginTop: spacing.md,
                        }}
                      >
                        <AppText color="link">Clear Search</AppText>
                      </Pressable>
                    )}

                    {hasActiveFilters && search.trim() === "" && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Clear filters"
                        onPress={clearFilters}
                        style={{
                          marginTop: spacing.md,
                        }}
                      >
                        <AppText color="link">Clear Filters</AppText>
                      </Pressable>
                    )}
                  </Card>
                ) : (
                  /* =======================================================
                     5. TRANSACTION LIST
                  ======================================================= */

                  <TransactionList transactions={filteredTransactions} />
                )}
              </ScrollView>

              {/* =============================================================
                  PAGINATION
              ============================================================= */}

              {!isLoading &&
                !showTransactionError &&
                !isFirstTimeUser &&
                totalPages > 1 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: spacing.md,
                      gap: spacing.md,
                    }}
                  >
                    {/* PREVIOUS */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Previous page"
                      disabled={!hasPreviousPage}
                      onPress={() => {
                        if (hasPreviousPage) {
                          setCurrentPage((page) => page - 1);
                        }
                      }}
                      style={({ pressed }) => ({
                        flex: 1,
                        minHeight: 44,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: spacing.xs,
                        borderWidth: 1,
                        borderColor: theme.border.default,
                        borderRadius: radius.sm,
                        backgroundColor: theme.background.surface,
                        opacity: !hasPreviousPage ? 0.4 : pressed ? 0.7 : 1,
                      })}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={18}
                        color={theme.text.primary}
                      />

                      <AppText variant="bodySmallBold" color="primary">
                        Previous
                      </AppText>
                    </Pressable>

                    {/* PAGE INFO */}

                    <View
                      style={{
                        alignItems: "center",
                        minWidth: 80,
                      }}
                    >
                      <AppText variant="bodySmallBold" color="secondary">
                        Page {pageNumber} of {totalPages}
                      </AppText>

                      <AppText
                        variant="caption"
                        color="muted"
                        style={{
                          marginTop: spacing.xs,
                        }}
                      >
                        {totalCount} transactions
                      </AppText>
                    </View>

                    {/* NEXT */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Next page"
                      disabled={!hasNextPage}
                      onPress={() => {
                        if (hasNextPage) {
                          setCurrentPage((page) => page + 1);
                        }
                      }}
                      style={({ pressed }) => ({
                        flex: 1,
                        minHeight: 44,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: spacing.xs,
                        borderWidth: 1,
                        borderColor: theme.border.default,
                        borderRadius: radius.sm,
                        backgroundColor: theme.background.surface,
                        opacity: !hasNextPage ? 0.4 : pressed ? 0.7 : 1,
                      })}
                    >
                      <AppText variant="bodySmallBold" color="primary">
                        Next
                      </AppText>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={theme.text.primary}
                      />
                    </Pressable>
                  </View>
                )}

              {/* =============================================================
                  FILTER BOTTOM SHEET
              ============================================================= */}

              <TransactionFilterBottomSheet
                ref={transactionFilterRef}
                draftFilters={draftFilters}
                setDraftFilters={setDraftFilters}
                onApply={(nextFilters) => {
                  setFilters(nextFilters);
                  setCurrentPage(1);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
