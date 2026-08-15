import { useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText, type Color } from "@/components/ui/AppText";

import { SearchBar } from "@/components/ui/SearchBar";
import { UICard } from "@/components/ui/UICard";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import type { TransactionsQueryFilters } from "@/services/transactions/transactions-service";

import { formatCurrency } from "@/utils/formatters/currency";

import { TransactionListItem } from "@/components/transactions/TransactionListItem";

import { TransactionList } from "@/components/transactions/TransactionList";

import { FilterButton } from "@/components/ui/FilterButton";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { TransactionFilterBottomSheet } from "@/components/bottom-sheet/TransactionFilterBottomSheet";

import { defaultTransactionFilters } from "@/constants/defaultTransactionFilters";

import { TransactionFilters } from "@/types/transactionFilters";

export default function TransactionsScreen() {
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;

  const [filters, setFilters] = useState<TransactionFilters>(
    defaultTransactionFilters
  );

  const [draftFilters, setDraftFilters] = useState<TransactionFilters>(
    defaultTransactionFilters
  );

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

  const onRefresh = () => refetch();

  const {
    data: transactionsData,
    isLoading,
    isRefetching,
    refetch,
  } = useTransactions(currentPage, pageSize, serverFilters);

  const transactions = transactionsData?.transactions ?? [];

  const totalCount = transactionsData?.totalCount ?? 0;

  const pageNumber = transactionsData?.pageNumber ?? currentPage;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const hasPreviousPage = pageNumber > 1;

  const hasNextPage = pageNumber < totalPages;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Payment Channel
      const matchesChannel =
        filters.channel === "all" || transaction.channel === filters.channel;

      // Transaction Type
      const matchesType =
        filters.type === "all" || transaction.type === filters.type;

      // Amount
      const matchesAmount =
        (filters.amount.min == null ||
          transaction.amount >= filters.amount.min) &&
        (filters.amount.max == null ||
          transaction.amount <= filters.amount.max);

      // Search
      const query = search.trim().toLowerCase();

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
      : `${activeFilterLabel.charAt(0).toUpperCase()}${activeFilterLabel.slice(1)} Value`;

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

  const transactionFilterRef = useRef<BottomSheetModal>(null);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.icon.branding.icon} />

        <AppText color="secondary" style={{ marginTop: spacing.md }}>
          Loading transactions...
        </AppText>
      </View>
    );
  }

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
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Pressable
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
              //   gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Transactions</AppText>

            <AppText variant="body" color="secondary">
              Number of transactions: {filteredTransactions.length}
            </AppText>
          </View>
        </View>

        {/* Content */}

        <View
          style={{
            flex: 1,
            // marginTop: spacing.md,
          }}
        >
          {/* Transaction Summary */}

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
              {/* Left */}

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
                    borderRadius: 999,
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

                  <AppText variant="h2">{summaryAmount}</AppText>
                </View>
              </View>

              {/* Divider */}

              <View
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  marginHorizontal: spacing.md,
                  backgroundColor: theme.divider.strong,
                }}
              />

              {/* Right */}

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
              active={
                filters.status !== "all" ||
                filters.channel !== "all" ||
                filters.type !== "all" ||
                filters.amount.min != null ||
                filters.amount.max != null ||
                filters.date.start != null ||
                filters.date.end != null
              }
              onPress={() => {
                // Sync the bottom sheet with the currently applied filters
                setDraftFilters(filters);

                transactionFilterRef.current?.present();
              }}
            />
          </View>

          {/* Filters */}

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
                variant={filters.status === filter.key ? "active" : "default"}
                onPress={() => {
                  const nextFilters: TransactionFilters = {
                    ...filters,
                    status: filter.key,
                  };

                  setFilters(nextFilters);
                  setDraftFilters(nextFilters);
                  setCurrentPage(1);
                }}
              />
            ))}
          </View>

          {/* Recent Transactions */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.md,
              }}
            >
              <AppText variant="h3">Recent Transactions</AppText>
            </View>

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
                paddingBottom: spacing.md,
              }}
            >
              <TransactionList transactions={filteredTransactions} />
            </ScrollView>

            {/* Pagination */}

            {totalPages > 1 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: spacing.md,
                  gap: spacing.md,
                }}
              >
                <Pressable
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
                    borderRadius: 8,
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

                <Pressable
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
                    borderRadius: 8,
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
    </SafeAreaView>
  );
}
