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

import { AppText } from "@/components/ui/AppText";
import { SearchBar } from "@/components/ui/SearchBar";
import { UICard } from "@/components/ui/UICard";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { useTransactions } from "@/hooks/transactions/useTransactions";

import { formatCurrency } from "@/utils/formatters/currency";

import { TransactionListItem } from "@/components/transactions/TransactionListItem";

import { TransactionList } from "@/components/transactions/TransactionList";

import { FilterButton } from "@/components/ui/FilterButton";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { TransactionFilterBottomSheet } from "@/components/bottom-sheet/TransactionFilterBottomSheet";

export default function TransactionsScreen() {
  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "paid" | "failed" | "inactive"
  >("all");

  const onRefresh = () => refetch();

  const {
    data: transactions = [],
    isLoading,
    isRefetching,
    refetch,
  } = useTransactions();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Status filter
      const matchesStatus =
        selectedStatus === "all" || transaction.status === selectedStatus;

      // Search filter
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

      return matchesStatus && matchesSearch;
    });
  }, [transactions, selectedStatus, search]);

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  }, [filteredTransactions]);

  const summaryTitle =
    selectedStatus === "all"
      ? "Transaction Value"
      : `${selectedStatus.charAt(0).toUpperCase()}${selectedStatus.slice(1)} Value`;

  const summaryAmount = formatCurrency(totalAmount);

  const summaryCount = filteredTransactions.length;

  const summaryLabel =
    selectedStatus === "all"
      ? "Transactions"
      : `${selectedStatus.charAt(0).toUpperCase()}${selectedStatus.slice(1)}`;

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
      key: "all",
      title: "All",
      count: transactions.length,
    },
    {
      key: "paid",
      title: "Paid",
      count: transactions.filter((t) => t.status === "paid").length,
    },
    {
      key: "pending",
      title: "Pending",
      count: transactions.filter((t) => t.status === "pending").length,
    },
    {
      key: "failed",
      title: "Failed",
      count: transactions.filter((t) => t.status === "failed").length,
    },
  ] satisfies {
    key: typeof selectedStatus;
    title: string;
    count: number;
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

                <AppText variant="caption" color="brand">
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
                onChangeText={setSearch}
                placeholder="Search by transaction ID, customer or amount"
              />
            </View>

            <FilterButton
              active={false}
              onPress={() => transactionFilterRef.current?.present()}
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
                variant={selectedStatus === filter.key ? "active" : "default"}
                onPress={() => setSelectedStatus(filter.key)}
                rightElement={
                  <AppText
                    variant="bodySmallBold"
                    color={
                      selectedStatus === filter.key ? "inverse" : "secondary"
                    }
                  >
                    {filter.count}
                  </AppText>
                }
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
                paddingBottom: spacing["2xl"],
              }}
            >
              <TransactionList transactions={filteredTransactions} />
            </ScrollView>
            <TransactionFilterBottomSheet ref={transactionFilterRef} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
