import { useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
  Image,
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

import { Divider } from "@/components/ui/Divider";

import { FilterButton } from "@/components/ui/FilterButton";

import { TransactionListItem } from "@/components/transactions/TransactionListItem";

import { TransactionFilterBottomSheet } from "@/components/bottom-sheet/TransactionFilterBottomSheet";

import { spacing, theme, radius } from "@/theme";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import type { TransactionsQueryFilters } from "@/services/transactions/transactions-service";

import { formatCurrency } from "@/utils/formatters/currency";

import { defaultTransactionFilters } from "@/constants/defaultTransactionFilters";

import type { TransactionFilters } from "@/types/transactionFilters";

import type { Transaction } from "@/types/transaction";

import { ROUTES } from "@/navigation/routes";

/**
 * ===========================================================================
 * PAGINATION
 * ===========================================================================
 */

const PAGE_SIZE = 20;

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
   * ACCUMULATED TRANSACTIONS
   * -------------------------------------------------------------------------
   *
   * The screen does not know whether these transactions came from:
   *
   * - mock data
   * - GraphQL
   * - SQLite fallback
   *
   * That decision belongs to the transaction service.
   */

  const [loadedTransactions, setLoadedTransactions] = useState<Transaction[]>(
    []
  );

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
   * TRANSACTIONS
   * =========================================================================
   */

  const {
    data: transactionsData,
    isLoading,
    isFetching,
    isRefetching,
    error,
    refetch,
  } = useTransactions(currentPage, PAGE_SIZE, serverFilters);

  /**
   * =========================================================================
   * PAGE ACCUMULATION
   * =========================================================================
   */

  useEffect(() => {
    if (!transactionsData) {
      return;
    }

    const incomingTransactions = transactionsData.transactions ?? [];

    const incomingPage = transactionsData.pageNumber ?? currentPage;

    if (incomingPage === 1) {
      setLoadedTransactions(incomingTransactions);

      return;
    }

    setLoadedTransactions((previousTransactions) => {
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
   * DATA
   * =========================================================================
   */

  const transactions = loadedTransactions;

  const totalCount = transactionsData?.totalCount ?? 0;

  const pageNumber = transactionsData?.pageNumber ?? currentPage;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const hasNextPage = pageNumber < totalPages;

  /**
   * =========================================================================
   * LOADING
   * =========================================================================
   */

  const isLoadingMore = isFetching && !isLoading && !isRefetching;

  /**
   * =========================================================================
   * CLIENT-SIDE FILTERING
   * =========================================================================
   */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      /**
       * -------------------------------------------------------------------
       * STATUS
       * -------------------------------------------------------------------
       */

      const matchesStatus =
        filters.status === "all" || transaction.status === filters.status;

      /**
       * -------------------------------------------------------------------
       * CHANNEL
       * -------------------------------------------------------------------
       */

      const matchesChannel =
        filters.channel === "all" || transaction.channel === filters.channel;

      /**
       * -------------------------------------------------------------------
       * TRANSACTION TYPE
       * -------------------------------------------------------------------
       */

      const matchesType =
        filters.type === "all" || transaction.type === filters.type;

      /**
       * -------------------------------------------------------------------
       * MINIMUM AMOUNT
       * -------------------------------------------------------------------
       */

      const matchesAmount =
        filters.amount.min == null || transaction.amount >= filters.amount.min;

      /**
       * -------------------------------------------------------------------
       * MAXIMUM AMOUNT
       * -------------------------------------------------------------------
       */

      const matchesMaximumAmount =
        filters.amount.max == null || transaction.amount <= filters.amount.max;

      /**
       * -------------------------------------------------------------------
       * AMOUNT SEARCH
       * -------------------------------------------------------------------
       */

      const transactionAmount = formatCurrency(transaction.amount, {
        currency: transaction.currency,
      });

      /**
       * -------------------------------------------------------------------
       * SEARCH
       * -------------------------------------------------------------------
       */

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
   * HAS MORE
   * =========================================================================
   */

  const hasMoreTransactions = hasNextPage;

  /**
   * =========================================================================
   * RESET PAGINATION
   * =========================================================================
   */

  const resetPagination = () => {
    setCurrentPage(1);
  };

  /**
   * =========================================================================
   * LOAD MORE
   * =========================================================================
   */

  const loadMoreTransactions = () => {
    if (isFetching || !hasMoreTransactions) {
      return;
    }

    setCurrentPage((page) => page + 1);
  };

  /**
   * =========================================================================
   * REFRESH
   * =========================================================================
   */

  const onRefresh = async () => {
    setCurrentPage(1);

    await refetch();
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
   * -------------------------------------------------------------------------
   * SUMMARY ICON
   * -------------------------------------------------------------------------
   */

  const summaryIconSource =
    filters.status === "all"
      ? require("../../../../assets/icons/transactions/transactionsAllIcon.png")
      : filters.status === "paid"
        ? require("../../../../assets/icons/transactions/transactionsPaidIcon.png")
        : filters.status === "pending"
          ? require("../../../../assets/icons/transactions/transactionsPendingIcon.png")
          : require("../../../../assets/icons/transactions/transactionsFailed.png");

  /**
   * =========================================================================
   * HEADER
   * =========================================================================
   */

  const headerSubtitle = isLoading
    ? "Loading transactions..."
    : isFirstTimeUser
      ? "Start accepting payments"
      : totalCount === 1
        ? "1 transaction"
        : `${totalCount} transactions`;

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
   * CREATE PAYMENT LINK
   * =========================================================================
   */

  const handleCreatePaymentLink = () => {
    router.push(ROUTES.ADD_PAYMENT_LINK_INFORMATION);
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
          {/* ================================================================
              HEADER
          ================================================================ */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* BACK */}

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

            {/* TITLE */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Transactions</AppText>

              <AppText variant="bodySmall" color="secondary">
                {headerSubtitle}
              </AppText>
            </View>
          </View>

          {/* ================================================================
              CONTENT
          ================================================================ */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* ==============================================================
                SUMMARY
            ============================================================== */}

            {!isFirstTimeUser && (
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
                      }}
                    >
                      <Image
                        source={summaryIconSource}
                        style={{
                          width: 56,
                          height: 56,
                        }}
                        resizeMode="contain"
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

                      <AppText variant="h2">{summaryAmount}</AppText>
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

                    <AppText variant="h2">{summaryCount}</AppText>

                    <AppText variant="caption" color={summaryStatusColor}>
                      {summaryLabel}
                    </AppText>
                  </View>
                </View>
              </Card>
            )}

            {/* ==============================================================
                SEARCH + FILTER
            ============================================================== */}

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

            {/* ==============================================================
                STATUS FILTERS
            ============================================================== */}

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

            {/* ==============================================================
                TRANSACTION CONTENT
            ============================================================== */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
            >
              {/* ============================================================
                  1. LOADING
              ============================================================ */}

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
                /* ==========================================================
                   2. FIRST-TIME USER
                ========================================================== */

                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  <Image
                    source={require("../../../../assets/images/default-transactions.png")}
                    style={{
                      width: 256,
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
                    leftIcon={
                      <Ionicons
                        name="add"
                        size={20}
                        color={theme.action.primary.text}
                      />
                    }
                    style={{
                      marginTop: spacing.lg,
                    }}
                    onPress={handleCreatePaymentLink}
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
                /* ==========================================================
                   3. ERROR
                ========================================================== */

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
                /* ==========================================================
                   4. SEARCH / FILTER EMPTY
                ========================================================== */

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
                /* ==========================================================
                   5. TRANSACTION LIST
                ========================================================== */

                <Card
                  style={{
                    flex: 1,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    overflow: "hidden",
                  }}
                >
                  <FlatList
                    data={filteredTransactions}
                    keyExtractor={(transaction) => transaction.id}
                    showsVerticalScrollIndicator={true}
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
                    renderItem={({ item }) => (
                      <TransactionListItem transaction={item} />
                    )}
                    ItemSeparatorComponent={() => <Divider />}
                    onEndReached={loadMoreTransactions}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{
                      paddingBottom: spacing["2xl"],
                    }}
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
                        ) : !hasMoreTransactions &&
                          filteredTransactions.length > 0 ? (
                          <AppText variant="caption" color="muted">
                            You've reached the end of your transactions.
                          </AppText>
                        ) : null}
                      </View>
                    }
                  />
                </Card>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ================================================================
          TRANSACTION FILTER BOTTOM SHEET
      ================================================================ */}

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
