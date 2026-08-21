import { useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
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

import type { TransactionFilters } from "@/types/transactionFilters";

import { ROUTES } from "@/navigation/routes";

import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

import { USE_MOCK_TRANSACTIONS } from "@/mocks/config";

/**
 * ===========================================================================
 * PAGINATION
 * ===========================================================================
 */

const PAGE_SIZE = 20;

/**
 * ===========================================================================
 * MOCK LOAD SIZE
 * ===========================================================================
 */

const MOCK_LOAD_SIZE = 20;

/**
 * ===========================================================================
 * SCREEN
 * ===========================================================================
 */

export default function TransactionsScreen() {
  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<TransactionFilters>(
    defaultTransactionFilters
  );

  const [draftFilters, setDraftFilters] = useState<TransactionFilters>(
    defaultTransactionFilters
  );

  /**
   * -------------------------------------------------------------------------
   * ACCUMULATED API TRANSACTIONS
   * -------------------------------------------------------------------------
   */

  const [loadedApiTransactions, setLoadedApiTransactions] = useState<any[]>([]);

  /**
   * -------------------------------------------------------------------------
   * MOCK VISIBLE COUNT
   * -------------------------------------------------------------------------
   */

  const [mockVisibleCount, setMockVisibleCount] = useState(PAGE_SIZE);

  /**
   * -------------------------------------------------------------------------
   * LOAD MORE STATE
   * -------------------------------------------------------------------------
   */

  const [isLoadingMoreMock, setIsLoadingMoreMock] = useState(false);

  /**
   * -------------------------------------------------------------------------
   * BOTTOM SHEET
   * -------------------------------------------------------------------------
   */

  const transactionFilterRef = useRef<BottomSheetModal>(null);

  /**
   * =========================================================================
   * SERVER FILTERS
   * =========================================================================
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
   * =========================================================================
   * REAL API
   * =========================================================================
   */

  const {
    data: transactionsData,

    isLoading: apiIsLoading,

    isFetching: apiIsFetching,

    isRefetching: apiIsRefetching,

    error: apiError,

    refetch: apiRefetch,
  } = useTransactions(currentPage, PAGE_SIZE, serverFilters);

  /**
   * =========================================================================
   * API PAGE ACCUMULATION
   * =========================================================================
   */

  useEffect(() => {
    if (USE_MOCK_TRANSACTIONS || !transactionsData) {
      return;
    }

    const incomingTransactions = transactionsData.transactions ?? [];

    const incomingPage = transactionsData.pageNumber ?? currentPage;

    if (incomingPage === 1) {
      setLoadedApiTransactions(incomingTransactions);

      return;
    }

    setLoadedApiTransactions((previousTransactions) => {
      const existingIds = new Set(
        previousTransactions.map((transaction) => transaction.id)
      );

      const newTransactions = incomingTransactions.filter(
        (transaction) => !existingIds.has(transaction.id)
      );

      return [...previousTransactions, ...newTransactions];
    });
  }, [transactionsData, currentPage]);

  /**
   * =========================================================================
   * DATA SOURCE
   * =========================================================================
   */

  const apiTransactions = USE_MOCK_TRANSACTIONS ? [] : loadedApiTransactions;

  const transactions = USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS
    : apiTransactions;

  const totalCount = USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS.length
    : (transactionsData?.totalCount ?? 0);

  const pageNumber = USE_MOCK_TRANSACTIONS
    ? currentPage
    : (transactionsData?.pageNumber ?? currentPage);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const hasNextPage = pageNumber < totalPages;

  /**
   * =========================================================================
   * LOADING
   * =========================================================================
   */

  const isLoading = USE_MOCK_TRANSACTIONS ? false : apiIsLoading;

  const isRefetching = USE_MOCK_TRANSACTIONS ? false : apiIsRefetching;

  const isLoadingMore = USE_MOCK_TRANSACTIONS
    ? isLoadingMoreMock
    : apiIsFetching && !apiIsLoading && !apiIsRefetching;

  const error = USE_MOCK_TRANSACTIONS ? null : apiError;

  /**
   * =========================================================================
   * CLIENT-SIDE FILTERING
   * =========================================================================
   */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesStatus =
        filters.status === "all" || transaction.status === filters.status;

      const matchesChannel =
        filters.channel === "all" || transaction.channel === filters.channel;

      const matchesType =
        filters.type === "all" || transaction.type === filters.type;

      const matchesAmount =
        filters.amount.min == null || transaction.amount >= filters.amount.min;

      const matchesMaximumAmount =
        filters.amount.max == null || transaction.amount <= filters.amount.max;

      const transactionAmount = formatCurrency(transaction.amount, {
        currency: transaction.currency,
      });

      const matchesSearch =
        query.length === 0 ||
        transaction.customer.toLowerCase().includes(query) ||
        transaction.reference.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        transactionAmount.toLowerCase().includes(query);

      return (
        matchesStatus &&
        matchesChannel &&
        matchesType &&
        matchesAmount &&
        matchesMaximumAmount &&
        matchesSearch
      );
    });
  }, [
    transactions,
    filters.status,
    filters.channel,
    filters.type,
    filters.amount.min,
    filters.amount.max,
    search,
  ]);

  /**
   * =========================================================================
   * MOCK PAGINATION
   * =========================================================================
   */

  const displayedTransactions = useMemo(() => {
    if (!USE_MOCK_TRANSACTIONS) {
      return filteredTransactions;
    }

    return filteredTransactions.slice(0, mockVisibleCount);
  }, [filteredTransactions, mockVisibleCount]);

  /**
   * =========================================================================
   * HAS MORE
   * =========================================================================
   */

  const hasMoreMockTransactions =
    mockVisibleCount < filteredTransactions.length;

  const hasMoreTransactions = USE_MOCK_TRANSACTIONS
    ? hasMoreMockTransactions
    : hasNextPage;

  /**
   * =========================================================================
   * RESET PAGINATION
   * =========================================================================
   */

  const resetPagination = () => {
    setCurrentPage(1);

    setMockVisibleCount(PAGE_SIZE);

    if (!USE_MOCK_TRANSACTIONS) {
      setLoadedApiTransactions([]);
    }
  };

  /**
   * =========================================================================
   * LOAD MORE
   * =========================================================================
   */

  const loadMoreTransactions = async () => {
    if (isLoadingMore || !hasMoreTransactions) {
      return;
    }

    /**
     * MOCK MODE
     */

    if (USE_MOCK_TRANSACTIONS) {
      setIsLoadingMoreMock(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 250));

        setMockVisibleCount((currentCount) =>
          Math.min(currentCount + MOCK_LOAD_SIZE, filteredTransactions.length)
        );
      } finally {
        setIsLoadingMoreMock(false);
      }

      return;
    }

    /**
     * API MODE
     */

    setCurrentPage((page) => page + 1);
  };

  /**
   * =========================================================================
   * REFRESH
   * =========================================================================
   */

  const onRefresh = async () => {
    /**
     * MOCK MODE
     */

    if (USE_MOCK_TRANSACTIONS) {
      setMockVisibleCount(PAGE_SIZE);

      return;
    }

    /**
     * API MODE
     */

    setCurrentPage(1);

    setLoadedApiTransactions([]);

    await apiRefetch();
  };

  /**
   * =========================================================================
   * FILTER STATE
   * =========================================================================
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
   * =========================================================================
   * SCREEN STATES
   * =========================================================================
   */

  const hasTransactions = totalCount > 0;

  const isFirstTimeUser =
    !isLoading && !hasTransactions && !hasActiveFilters && search.trim() === "";

  const showTransactionError = !isLoading && !!error && hasTransactions;

  const hasNoResults =
    !isLoading &&
    !showTransactionError &&
    !isFirstTimeUser &&
    filteredTransactions.length === 0;

  /**
   * =========================================================================
   * SUMMARY
   * =========================================================================
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
      : `${
          activeFilterLabel.charAt(0).toUpperCase() + activeFilterLabel.slice(1)
        } Value`;

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
   * =========================================================================
   * HEADER
   * =========================================================================
   */

  const headerSubtitle = isLoading
    ? "Loading transactions..."
    : isFirstTimeUser
      ? "Start accepting payments"
      : filteredTransactions.length === 1
        ? "1 transaction"
        : `${filteredTransactions.length} transactions`;

  /**
   * =========================================================================
   * STATUS FILTER OPTIONS
   * =========================================================================
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
   * =========================================================================
   * FILTER HANDLERS
   * =========================================================================
   */

  const handleStatusChange = (status: TransactionFilters["status"]) => {
    const nextFilters: TransactionFilters = {
      ...filters,
      status,
    };

    setFilters(nextFilters);

    setDraftFilters(nextFilters);

    resetPagination();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);

    resetPagination();
  };

  const clearSearch = () => {
    handleSearchChange("");
  };

  const clearFilters = () => {
    setFilters(defaultTransactionFilters);

    setDraftFilters(defaultTransactionFilters);

    resetPagination();
  };

  /**
   * =========================================================================
   * UI
   * =========================================================================
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
          {/* HEADER */}

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

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* SUMMARY */}

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

                <View
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    marginHorizontal: spacing.md,
                    backgroundColor: theme.divider.strong,
                  }}
                />

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

            {/* SEARCH + FILTER */}

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
                    onChangeText={handleSearchChange}
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

            {/* STATUS FILTERS */}

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

            {/* TRANSACTION CONTENT */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
            >
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
                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
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

                  <AppText
                    variant="bodyLargeBold"
                    style={{
                      marginTop: spacing.md,
                      textAlign: "center",
                    }}
                  >
                    No transactions yet
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
                    Transactions will appear here when customers make payments
                    through your store.
                  </AppText>

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
                    onPress={() => apiRefetch()}
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
                <FlatList
                  data={displayedTransactions}
                  keyExtractor={(transaction) => transaction.id}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
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
                    paddingBottom: spacing["2xl"],
                  }}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        marginBottom: spacing.md,
                      }}
                    >
                      <TransactionList transactions={[item]} />
                    </View>
                  )}
                  onEndReached={loadMoreTransactions}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    <View
                      style={{
                        paddingVertical: spacing.lg,
                        alignItems: "center",
                      }}
                    >
                      {isLoadingMore ? (
                        <>
                          <ActivityIndicator
                            size="small"
                            color={theme.icon.branding.icon}
                          />

                          <AppText
                            variant="caption"
                            color="secondary"
                            style={{
                              marginTop: spacing.xs,
                            }}
                          >
                            Loading more transactions...
                          </AppText>
                        </>
                      ) : !hasMoreTransactions ? (
                        displayedTransactions.length > 0 && (
                          <AppText variant="caption" color="muted">
                            You've reached the end of your transactions.
                          </AppText>
                        )
                      ) : null}
                    </View>
                  }
                />
              )}
            </View>
          </View>
        </View>
      </View>

      {/* TRANSACTION FILTER BOTTOM SHEET */}

      <TransactionFilterBottomSheet
        ref={transactionFilterRef}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        onApply={(nextFilters) => {
          setFilters(nextFilters);

          setDraftFilters(nextFilters);

          resetPagination();
        }}
      />
    </SafeAreaView>
  );
}
