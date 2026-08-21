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

import type { TransactionFilters } from "@/types/transactionFilters";

import type { Transaction } from "@/types/transaction";

import { ROUTES } from "@/navigation/routes";

/**
 * ===========================================================================
 * MOCK MODE
 * ===========================================================================
 *
 * Set this to false when the real Transactions API is ready.
 */
const USE_MOCK_TRANSACTIONS = true;

/**
 * ===========================================================================
 * MOCK TRANSACTIONS
 * ===========================================================================
 */

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    customer: "Daniel Okafor",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 185000,
    currency: "NGN",
    reference: "XPS-000001",
    createdAt: "2026-08-21T09:30:00.000Z",
  },
  {
    id: "txn_002",
    customer: "Amaka Eze",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 45000,
    currency: "NGN",
    reference: "XPS-000002",
    createdAt: "2026-08-21T08:45:00.000Z",
  },
  {
    id: "txn_003",
    customer: "Michael Adeyemi",
    type: "credit",
    status: "pending",
    channel: "transfer",
    amount: 75000,
    currency: "NGN",
    reference: "XPS-000003",
    createdAt: "2026-08-21T08:10:00.000Z",
  },
  {
    id: "txn_004",
    customer: "Grace Williams",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 120000,
    currency: "NGN",
    reference: "XPS-000004",
    createdAt: "2026-08-20T17:30:00.000Z",
  },
  {
    id: "txn_005",
    customer: "Ibrahim Musa",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 25000,
    currency: "NGN",
    reference: "XPS-000005",
    createdAt: "2026-08-20T16:50:00.000Z",
  },
  {
    id: "txn_006",
    customer: "Sarah Johnson",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 350000,
    currency: "NGN",
    reference: "XPS-000006",
    createdAt: "2026-08-20T15:40:00.000Z",
  },
  {
    id: "txn_007",
    customer: "Chinedu Okoro",
    type: "credit",
    status: "pending",
    channel: "qr",
    amount: 65000,
    currency: "NGN",
    reference: "XPS-000007",
    createdAt: "2026-08-20T14:25:00.000Z",
  },
  {
    id: "txn_008",
    customer: "Blessing Joseph",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 95000,
    currency: "NGN",
    reference: "XPS-000008",
    createdAt: "2026-08-20T13:10:00.000Z",
  },
  {
    id: "txn_009",
    customer: "Tunde Balogun",
    type: "credit",
    status: "failed",
    channel: "ussd",
    amount: 18000,
    currency: "NGN",
    reference: "XPS-000009",
    createdAt: "2026-08-20T11:45:00.000Z",
  },
  {
    id: "txn_010",
    customer: "Esther Adebayo",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 210000,
    currency: "NGN",
    reference: "XPS-000010",
    createdAt: "2026-08-20T10:20:00.000Z",
  },
  {
    id: "txn_011",
    customer: "David Nwosu",
    type: "credit",
    status: "pending",
    channel: "bank",
    amount: 55000,
    currency: "NGN",
    reference: "XPS-000011",
    createdAt: "2026-08-20T09:15:00.000Z",
  },
  {
    id: "txn_012",
    customer: "Mercy Peter",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 80000,
    currency: "NGN",
    reference: "XPS-000012",
    createdAt: "2026-08-19T18:40:00.000Z",
  },
  {
    id: "txn_013",
    customer: "Samuel Obi",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 150000,
    currency: "NGN",
    reference: "XPS-000013",
    createdAt: "2026-08-19T16:30:00.000Z",
  },
  {
    id: "txn_014",
    customer: "Aisha Bello",
    type: "credit",
    status: "failed",
    channel: "qr",
    amount: 32000,
    currency: "NGN",
    reference: "XPS-000014",
    createdAt: "2026-08-19T15:20:00.000Z",
  },
  {
    id: "txn_015",
    customer: "Kevin Martins",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 275000,
    currency: "NGN",
    reference: "XPS-000015",
    createdAt: "2026-08-19T13:45:00.000Z",
  },
  {
    id: "txn_016",
    customer: "Joyce Williams",
    type: "credit",
    status: "pending",
    channel: "bank",
    amount: 40000,
    currency: "NGN",
    reference: "XPS-000016",
    createdAt: "2026-08-19T12:30:00.000Z",
  },
  {
    id: "txn_017",
    customer: "Femi Lawal",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 70000,
    currency: "NGN",
    reference: "XPS-000017",
    createdAt: "2026-08-19T11:15:00.000Z",
  },
  {
    id: "txn_018",
    customer: "Nneka Ibe",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 125000,
    currency: "NGN",
    reference: "XPS-000018",
    createdAt: "2026-08-19T09:40:00.000Z",
  },
  {
    id: "txn_019",
    customer: "Yusuf Ibrahim",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 90000,
    currency: "NGN",
    reference: "XPS-000019",
    createdAt: "2026-08-18T17:20:00.000Z",
  },
  {
    id: "txn_020",
    customer: "Adaeze Chukwu",
    type: "credit",
    status: "paid",
    channel: "qr",
    amount: 60000,
    currency: "NGN",
    reference: "XPS-000020",
    createdAt: "2026-08-18T16:10:00.000Z",
  },
  {
    id: "txn_021",
    customer: "Emeka Uche",
    type: "credit",
    status: "pending",
    channel: "card",
    amount: 220000,
    currency: "NGN",
    reference: "XPS-000021",
    createdAt: "2026-08-18T14:50:00.000Z",
  },
  {
    id: "txn_022",
    customer: "Hannah Cole",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 30000,
    currency: "NGN",
    reference: "XPS-000022",
    createdAt: "2026-08-18T13:35:00.000Z",
  },
  {
    id: "txn_023",
    customer: "Peter James",
    type: "credit",
    status: "failed",
    channel: "bank",
    amount: 110000,
    currency: "NGN",
    reference: "XPS-000023",
    createdAt: "2026-08-18T12:20:00.000Z",
  },
  {
    id: "txn_024",
    customer: "Rita Okeke",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 145000,
    currency: "NGN",
    reference: "XPS-000024",
    createdAt: "2026-08-18T10:45:00.000Z",
  },
  {
    id: "txn_025",
    customer: "Oluwaseun Adeola",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 50000,
    currency: "NGN",
    reference: "XPS-000025",
    createdAt: "2026-08-17T17:30:00.000Z",
  },
  {
    id: "txn_026",
    customer: "Fatima Abdullahi",
    type: "credit",
    status: "pending",
    channel: "qr",
    amount: 85000,
    currency: "NGN",
    reference: "XPS-000026",
    createdAt: "2026-08-17T15:15:00.000Z",
  },
  {
    id: "txn_027",
    customer: "Chris Morgan",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 190000,
    currency: "NGN",
    reference: "XPS-000027",
    createdAt: "2026-08-17T13:40:00.000Z",
  },
  {
    id: "txn_028",
    customer: "Ngozi Eze",
    type: "credit",
    status: "failed",
    channel: "ussd",
    amount: 27000,
    currency: "NGN",
    reference: "XPS-000028",
    createdAt: "2026-08-17T11:20:00.000Z",
  },
  {
    id: "txn_029",
    customer: "Marcus Brown",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 135000,
    currency: "NGN",
    reference: "XPS-000029",
    createdAt: "2026-08-17T09:50:00.000Z",
  },
  {
    id: "txn_030",
    customer: "Temitope Akinyemi",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 72000,
    currency: "NGN",
    reference: "XPS-000030",
    createdAt: "2026-08-16T16:30:00.000Z",
  },
];

/**
 * ===========================================================================
 * SCREEN
 * ===========================================================================
 */

export default function TransactionsScreen() {
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

      startDate: filters.date.start
        ? filters.date.start.toISOString()
        : null,

      endDate: filters.date.end
        ? filters.date.end.toISOString()
        : null,
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
    isRefetching: apiIsRefetching,
    error: apiError,
    refetch: apiRefetch,
  } = useTransactions(currentPage, pageSize, serverFilters);

  /**
   * =========================================================================
   * DATA SOURCE
   * =========================================================================
   */

  const apiTransactions = transactionsData?.transactions ?? [];

  const transactions = USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS
    : apiTransactions;

  const totalCount = USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS.length
    : transactionsData?.totalCount ?? 0;

  const pageNumber = USE_MOCK_TRANSACTIONS
    ? currentPage
    : transactionsData?.pageNumber ?? currentPage;

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  const hasPreviousPage = pageNumber > 1;

  const hasNextPage = pageNumber < totalPages;

  const isLoading = USE_MOCK_TRANSACTIONS
    ? false
    : apiIsLoading;

  const isRefetching = USE_MOCK_TRANSACTIONS
    ? false
    : apiIsRefetching;

  const error = USE_MOCK_TRANSACTIONS
    ? null
    : apiError;

  /**
   * =========================================================================
   * REFRESH
   * =========================================================================
   */

  const onRefresh = async () => {
    if (USE_MOCK_TRANSACTIONS) {
      return;
    }

    await apiRefetch();
  };

  /**
   * =========================================================================
   * CLIENT-SIDE FILTERING
   * =========================================================================
   */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesStatus =
        filters.status === "all" ||
        transaction.status === filters.status;

      const matchesChannel =
        filters.channel === "all" ||
        transaction.channel === filters.channel;

      const matchesType =
        filters.type === "all" ||
        transaction.type === filters.type;

      const matchesAmount =
        (filters.amount.min == null ||
          transaction.amount >= filters.amount.min) &&
        (filters.amount.max == null ||
          transaction.amount <= filters.amount.max);

      const transactionAmount = formatCurrency(
        transaction.amount,
        {
          currency: transaction.currency,
        }
      );

      const matchesSearch =
        query.length === 0 ||
        transaction.customer
          .toLowerCase()
          .includes(query) ||
        transaction.reference
          .toLowerCase()
          .includes(query) ||
        transaction.id
          .toLowerCase()
          .includes(query) ||
        transactionAmount
          .toLowerCase()
          .includes(query);

      return (
        matchesStatus &&
        matchesChannel &&
        matchesType &&
        matchesAmount &&
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
   * PAGINATED MOCK DATA
   * =========================================================================
   */

  const paginatedTransactions = useMemo(() => {
    if (!USE_MOCK_TRANSACTIONS) {
      return filteredTransactions;
    }

    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex =
      startIndex + pageSize;

    return filteredTransactions.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredTransactions,
    currentPage,
  ]);

  /**
   * =========================================================================
   * DISPLAY PAGINATION
   * =========================================================================
   */

  const displayedTotalCount = USE_MOCK_TRANSACTIONS
    ? filteredTransactions.length
    : totalCount;

  const displayedTotalPages = USE_MOCK_TRANSACTIONS
    ? Math.max(
        1,
        Math.ceil(
          filteredTransactions.length /
            pageSize
        )
      )
    : totalPages;

  const displayedPageNumber = USE_MOCK_TRANSACTIONS
    ? Math.min(
        currentPage,
        displayedTotalPages
      )
    : pageNumber;

  const displayedHasPreviousPage =
    displayedPageNumber > 1;

  const displayedHasNextPage =
    displayedPageNumber <
    displayedTotalPages;

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

  const isFirstTimeUser =
    !isLoading &&
    totalCount === 0 &&
    !hasActiveFilters &&
    search.trim() === "";

  const showTransactionError =
    !isLoading &&
    !!error &&
    totalCount > 0;

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
      (sum, transaction) =>
        sum + transaction.amount,
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
      : `${activeFilterLabel
          .charAt(0)
          .toUpperCase()}${activeFilterLabel.slice(
          1
        )} Value`;

  const summaryAmount =
    formatCurrency(totalAmount);

  const summaryCount =
    filteredTransactions.length;

  const summaryLabel =
    activeFilterLabel === null
      ? "Transactions"
      : activeFilterLabel
          .charAt(0)
          .toUpperCase() +
        activeFilterLabel.slice(1);

  const summaryStatusColors: Record<
    TransactionFilters["status"],
    Color
  > = {
    all: "strong",
    paid: "success",
    pending: "warning",
    failed: "error",
  };

  const summaryStatusColor =
    summaryStatusColors[filters.status];

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

  const handleStatusChange = (
    status: TransactionFilters["status"]
  ) => {
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
   * =========================================================================
   * UI
   * =========================================================================
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          theme.background.primary,
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
              <AppText variant="h1">
                Transactions
              </AppText>

              <AppText
                variant="body"
                color="secondary"
              >
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
                      justifyContent:
                        "center",
                      alignItems: "center",
                      backgroundColor:
                        theme.icon.branding
                          .background,
                    }}
                  >
                    <Ionicons
                      name="receipt-outline"
                      size={28}
                      color={
                        theme.icon.branding.icon
                      }
                    />
                  </View>

                  <View
                    style={{
                      gap: spacing.xs,
                    }}
                  >
                    <AppText
                      variant="bodySmallBold"
                      color="muted"
                    >
                      {summaryTitle}
                    </AppText>

                    <AppText variant="h2">
                      {isLoading
                        ? "—"
                        : summaryAmount}
                    </AppText>
                  </View>
                </View>

                <View
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    marginHorizontal:
                      spacing.md,
                    backgroundColor:
                      theme.divider.strong,
                  }}
                />

                <View
                  style={{
                    minWidth: 84,
                    justifyContent:
                      "center",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmallBold"
                    color="muted"
                  >
                    Transactions
                  </AppText>

                  <AppText variant="h2">
                    {isLoading
                      ? "—"
                      : summaryCount}
                  </AppText>

                  <AppText
                    variant="caption"
                    color={
                      summaryStatusColor
                    }
                  >
                    {summaryLabel}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* =============================================================
                SEARCH + FILTER
            ============================================================= */}

            {!isFirstTimeUser &&
              !showTransactionError && (
                <View
                  style={{
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    gap: spacing.sm,
                    marginTop:
                      spacing.md,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <SearchBar
                      value={search}
                      onChangeText={(
                        value
                      ) => {
                        setSearch(value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by transaction ID, customer or amount"
                    />
                  </View>

                  <FilterButton
                    active={
                      hasActiveFilters
                    }
                    onPress={() => {
                      setDraftFilters(
                        filters
                      );

                      transactionFilterRef.current?.present();
                    }}
                  />
                </View>
              )}

            {/* =============================================================
                STATUS FILTERS
            ============================================================= */}

            {!isFirstTimeUser &&
              !showTransactionError && (
                <View
                  style={{
                    flexDirection:
                      "row",
                    marginTop:
                      spacing.md,
                    gap: spacing.sm,
                  }}
                >
                  {filterOptions.map(
                    (filter) => (
                      <UICard
                        key={
                          filter.key
                        }
                        title={
                          filter.title
                        }
                        variant={
                          filters.status ===
                          filter.key
                            ? "active"
                            : "default"
                        }
                        onPress={() =>
                          handleStatusChange(
                            filter.key
                          )
                        }
                      />
                    )
                  )}
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
                showsVerticalScrollIndicator={
                  false
                }
                refreshControl={
                  <RefreshControl
                    refreshing={
                      isRefetching
                    }
                    onRefresh={
                      onRefresh
                    }
                    tintColor={
                      theme.icon.branding
                        .icon
                    }
                    colors={[
                      theme.icon.branding
                        .icon,
                    ]}
                    progressBackgroundColor={
                      theme.background
                        .surface
                    }
                  />
                }
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 0,
                }}
              >
                {/* =========================================================
                    INITIAL LOADING
                ========================================================= */}

                {isLoading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      paddingVertical:
                        spacing["3xl"],
                    }}
                  >
                    <ActivityIndicator
                      size="large"
                      color={
                        theme.icon.branding
                          .icon
                      }
                    />

                    <AppText
                      color="secondary"
                      style={{
                        marginTop:
                          spacing.md,
                      }}
                    >
                      Loading transactions...
                    </AppText>
                  </View>
                ) : isFirstTimeUser ? (
                  /* =======================================================
                     FIRST-TIME USER
                  ======================================================= */

                  <Card
                    style={{
                      alignItems:
                        "center",
                      paddingVertical:
                        spacing.xl,
                      paddingHorizontal:
                        spacing.lg,
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius:
                          radius.full,
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          theme.icon
                            .branding
                            .background,
                      }}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={32}
                        color={
                          theme.icon
                            .branding
                            .icon
                        }
                      />
                    </View>

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop:
                          spacing.md,
                        textAlign:
                          "center",
                      }}
                    >
                      No transactions yet
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        marginTop:
                          spacing.xs,
                        textAlign:
                          "center",
                        maxWidth: 320,
                      }}
                    >
                      Transactions will appear
                      here when customers make
                      payments through your store.
                    </AppText>

                    <Button
                      title="Create Payment Link"
                      variant="primary"
                      style={{
                        marginTop:
                          spacing.lg,
                      }}
                      onPress={() =>
                        router.push(
                          ROUTES.ADD_PAYMENT_LINK_INFORMATION
                        )
                      }
                    />

                    <AppText
                      variant="caption"
                      color="muted"
                      style={{
                        marginTop:
                          spacing.sm,
                        textAlign:
                          "center",
                      }}
                    >
                      Start accepting payments by
                      creating your first payment
                      link.
                    </AppText>
                  </Card>
                ) : showTransactionError ? (
                  /* =======================================================
                     ERROR
                  ======================================================= */

                  <View
                    style={{
                      flex: 1,
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      paddingVertical:
                        spacing["3xl"],
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius:
                          radius.full,
                        justifyContent:
                          "center",
                        alignItems:
                          "center",
                        backgroundColor:
                          theme.background
                            .error,
                      }}
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color={
                          theme.icon.error
                            .icon
                        }
                      />
                    </View>

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop:
                          spacing.md,
                        textAlign:
                          "center",
                      }}
                    >
                      Unable to load transactions
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        marginTop:
                          spacing.xs,
                        textAlign:
                          "center",
                        maxWidth: 320,
                      }}
                    >
                      We couldn't load your
                      transactions. Please try again.
                    </AppText>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Try again"
                      onPress={() =>
                        apiRefetch()
                      }
                      style={{
                        marginTop:
                          spacing.md,
                        paddingVertical:
                          spacing.xs,
                        paddingHorizontal:
                          spacing.sm,
                      }}
                    >
                      <AppText color="link">
                        Try Again
                      </AppText>
                    </Pressable>
                  </View>
                ) : hasNoResults ? (
                  /* =======================================================
                     SEARCH / FILTER EMPTY
                  ======================================================= */

                  <Card
                    style={{
                      alignItems:
                        "center",
                      paddingVertical:
                        spacing.xl,
                      paddingHorizontal:
                        spacing.lg,
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius:
                          radius.full,
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          theme.icon
                            .default
                            .background,
                      }}
                    >
                      <Ionicons
                        name="search-outline"
                        size={28}
                        color={
                          theme.icon
                            .default
                            .icon
                        }
                      />
                    </View>

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop:
                          spacing.md,
                        textAlign:
                          "center",
                      }}
                    >
                      No transactions found
                    </AppText>

                    <AppText
                      variant="body"
                      color="secondary"
                      style={{
                        marginTop:
                          spacing.xs,
                        textAlign:
                          "center",
                      }}
                    >
                      Try searching with a different
                      transaction ID, customer or amount.
                    </AppText>

                    {search.trim() !==
                      "" && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Clear search"
                        onPress={
                          clearSearch
                        }
                        style={{
                          marginTop:
                            spacing.md,
                        }}
                      >
                        <AppText color="link">
                          Clear Search
                        </AppText>
                      </Pressable>
                    )}

                    {hasActiveFilters &&
                      search.trim() ===
                        "" && (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Clear filters"
                          onPress={
                            clearFilters
                          }
                          style={{
                            marginTop:
                              spacing.md,
                          }}
                        >
                          <AppText color="link">
                            Clear Filters
                          </AppText>
                        </Pressable>
                      )}
                  </Card>
                ) : (
                  /* =======================================================
                     TRANSACTION LIST
                  ======================================================= */

                  <TransactionList
                    transactions={
                      paginatedTransactions
                    }
                  />
                )}
              </ScrollView>

              {/* =============================================================
                  PAGINATION
              ============================================================= */}

              {!isLoading &&
                !showTransactionError &&
                !isFirstTimeUser &&
                displayedTotalPages > 1 && (
                  <View
                    style={{
                      paddingTop:
                        spacing.md,
                      paddingBottom: 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection:
                          "row",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: spacing.md,
                      }}
                    >
                      {/* PREVIOUS */}

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Previous page"
                        disabled={
                          !displayedHasPreviousPage
                        }
                        onPress={() => {
                          if (
                            displayedHasPreviousPage
                          ) {
                            setCurrentPage(
                              (page) =>
                                page - 1
                            );
                          }
                        }}
                        style={({
                          pressed,
                        }) => ({
                          flex: 1,
                          height: 44,
                          flexDirection:
                            "row",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          gap: spacing.xs,
                          borderWidth: 1,
                          borderColor:
                            theme.border
                              .default,
                          borderRadius:
                            radius.sm,
                          backgroundColor:
                            theme.background
                              .surface,
                          opacity:
                            !displayedHasPreviousPage
                              ? 0.4
                              : pressed
                                ? 0.7
                                : 1,
                        })}
                      >
                        <Ionicons
                          name="chevron-back"
                          size={18}
                          color={
                            theme.text.primary
                          }
                        />

                        <AppText
                          variant="bodySmallBold"
                          color="primary"
                        >
                          Previous
                        </AppText>
                      </Pressable>

                      {/* PAGE INFO */}

                      <View
                        style={{
                          minWidth: 80,
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        <AppText
                          variant="bodySmallBold"
                          color="secondary"
                        >
                          Page{" "}
                          {
                            displayedPageNumber
                          }{" "}
                          of{" "}
                          {
                            displayedTotalPages
                          }
                        </AppText>

                        <AppText
                          variant="caption"
                          color="muted"
                          style={{
                            marginTop:
                              spacing.xs,
                          }}
                        >
                          {
                            displayedTotalCount
                          }{" "}
                          transactions
                        </AppText>
                      </View>

                      {/* NEXT */}

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Next page"
                        disabled={
                          !displayedHasNextPage
                        }
                        onPress={() => {
                          if (
                            displayedHasNextPage
                          ) {
                            setCurrentPage(
                              (page) =>
                                page + 1
                            );
                          }
                        }}
                        style={({
                          pressed,
                        }) => ({
                          flex: 1,
                          height: 44,
                          flexDirection:
                            "row",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          gap: spacing.xs,
                          borderWidth: 1,
                          borderColor:
                            theme.border
                              .default,
                          borderRadius:
                            radius.sm,
                          backgroundColor:
                            theme.background
                              .surface,
                          opacity:
                            !displayedHasNextPage
                              ? 0.4
                              : pressed
                                ? 0.7
                                : 1,
                        })}
                      >
                        <AppText
                          variant="bodySmallBold"
                          color="primary"
                        >
                          Next
                        </AppText>

                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={
                            theme.text.primary
                          }
                        />
                      </Pressable>
                    </View>
                  </View>
                )}

              {/* =============================================================
                  FILTER BOTTOM SHEET
              ============================================================= */}

              <TransactionFilterBottomSheet
                ref={transactionFilterRef}
                draftFilters={
                  draftFilters
                }
                setDraftFilters={
                  setDraftFilters
                }
                onApply={(
                  nextFilters
                ) => {
                  setFilters(
                    nextFilters
                  );

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