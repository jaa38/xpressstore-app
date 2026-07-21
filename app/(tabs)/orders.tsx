import { View, Pressable, FlatList, RefreshControl } from "react-native";

import { useMemo, useRef, useState } from "react";

import type { OrderFilter } from "@/types/order-filter";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";

import { SearchBar } from "@/components/ui/SearchBar";

import { UICard } from "@/components/ui/UICard";

import { spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";

import { PAYMENT_CHANNELS } from "@/constants/paymentChannels";

import { formatCurrency } from "@/utils/formatCurrency";

import { ORDER_STATUS } from "@/constants/orderStatus";
import { useOrders } from "@/hooks/useOrders";

import { formatOrderDate } from "@/utils/formatOrderDate";

import { FilterButton } from "@/components/ui/FilterButton";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { FilterBottomSheet } from "@/components/bottom-sheet/FilterBottomSheet";

import type { OrderFilters } from "@/types/orderFilters";

import { defaultOrderFilters } from "@/constants/defaultOrderFilters";

import { ProductImage } from "@/components/ui/ProductImage";

import { useProducts } from "@/hooks/useProducts";
import { Order } from "@/types/order";

export default function OrdersScreen() {
  const { data: orders = [], isLoading, isRefetching, refetch } = useOrders();

  const { data: products = [] } = useProducts();

  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [draftFilters, setDraftFilters] =
    useState<OrderFilters>(defaultOrderFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<OrderFilters>(defaultOrderFilters);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const hasActiveFilters = useMemo(() => {
    const hasAmountFilter =
      appliedFilters.amount.min !== undefined ||
      appliedFilters.amount.max !== undefined;

    const hasDateFilter =
      appliedFilters.date.start !== undefined ||
      appliedFilters.date.end !== undefined;

    const hasSortFilter = appliedFilters.sort !== "mostRecent";

    return hasAmountFilter || hasDateFilter || hasSortFilter;
  }, [appliedFilters]);

  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const matchesStatus =
        selectedFilter === "all" || order.status === selectedFilter;

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        order.reference.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(query)
        );

      const matchesAmount =
        (appliedFilters.amount.min === undefined ||
          order.total >= appliedFilters.amount.min) &&
        (appliedFilters.amount.max === undefined ||
          order.total <= appliedFilters.amount.max);

      const orderDate = new Date(order.createdAt);

      const startDate = appliedFilters.date.start;

      const endDate = appliedFilters.date.end
        ? new Date(appliedFilters.date.end)
        : undefined;

      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      const matchesDate =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);

      return matchesStatus && matchesSearch && matchesAmount && matchesDate;
    });

    switch (appliedFilters.sort) {
      case "amountHighToLow":
        return [...filtered].sort((a, b) => b.total - a.total);

      case "amountLowToHigh":
        return [...filtered].sort((a, b) => a.total - b.total);

      case "mostRecent":
      default:
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [orders, selectedFilter, searchQuery, appliedFilters]);

  const productsById = useMemo(() => {
    return Object.fromEntries(products.map((product) => [product.id, product]));
  }, [products]);

  const [selectedOrder, setSelectedOrder] =
  useState<Order | null>(null);

  const orderSummaryBottomSheetRef =
  useRef<BottomSheetModal>(null);

  if (isLoading) {
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
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          <AppText variant="body">Loading orders...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
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
          {/* TOP */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.lg,
            }}
          >
            <View style={{}}>
              <AppText variant="h1">Orders</AppText>

              <AppText variant="body" color="secondary">
                Number of orders this week
              </AppText>
            </View>

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <SearchBar
                  placeholder="Search orders"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <FilterButton
                active={hasActiveFilters}
                onPress={() => {
                  setDraftFilters(appliedFilters);
                  bottomSheetRef.current?.present();
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: spacing.md,
                justifyContent: "space-between",
              }}
            >
              {/* <UICard /> */}
              <UICard
                title="All"
                variant={selectedFilter === "all" ? "active" : "default"}
                onPress={() => setSelectedFilter("all")}
              />

              <UICard
                title="Paid"
                variant={selectedFilter === "paid" ? "active" : "default"}
                onPress={() => setSelectedFilter("paid")}
              />

              <UICard
                title="Delivered"
                variant={selectedFilter === "delivered" ? "active" : "default"}
                onPress={() => setSelectedFilter("delivered")}
              />

              <UICard
                title="Returned"
                variant={selectedFilter === "returned" ? "active" : "default"}
                onPress={() => setSelectedFilter("returned")}
              />

              <UICard
                title="Failed"
                variant={selectedFilter === "failed" ? "active" : "default"}
                onPress={() => setSelectedFilter("failed")}
              />
            </View>

            <FlatList
              style={{
                flex: 1,
              }}
              data={filteredOrders}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={theme.text.brand}
                  colors={[theme.text.brand]}
                />
              }
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <View
                  style={{
                    paddingVertical: spacing.xl,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={48}
                    color={theme.icon.default.icon}
                  />

                  <AppText
                    variant="bodyLargeBold"
                    style={{
                      marginTop: spacing.md,
                    }}
                  >
                    No orders yet
                  </AppText>

                  <AppText
                    variant="body"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,
                      textAlign: "center",
                    }}
                  >
                    Orders will appear here when customers make purchases.
                  </AppText>
                </View>
              }
              contentContainerStyle={{
                marginTop: spacing.lg,
                gap: spacing.md,
                paddingBottom: spacing.lg,
              }}
              renderItem={({ item: order }) => {
                const status =
                  order.status !== "paid" ? ORDER_STATUS[order.status] : null;

                const firstItem = order.items[0];

                const totalItems = order.items.reduce(
                  (total, item) => total + item.quantity,
                  0
                );

                const product = firstItem
                  ? productsById[firstItem.productId]
                  : undefined;

                const productSummary = (() => {
                  if (!firstItem) {
                    return "Unknown Product";
                  }

                  const firstProductName =
                    product?.productName ?? firstItem.productName;

                  const additionalProducts = order.items.length - 1;

                  if (additionalProducts <= 0) {
                    return firstProductName;
                  }

                  return `${firstProductName} +${additionalProducts} more`;
                })();

                return (
                  <Card>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                      }}
                    >
                      {/* IMAGE */}

                      <ProductImage image={product?.image ?? ""} />
                      {/* ORDER INFO */}

                      <View
                        style={{
                          flex: 1,
                          gap: spacing.xs,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.xs,
                          }}
                        >
                          <AppText variant="bodySmall" color="secondary">
                            {order.reference}
                          </AppText>

                          <Ionicons
                            name={
                              order.status === "paid"
                                ? PAYMENT_CHANNELS[order.paymentChannel].icon
                                : status!.icon
                            }
                            size={16}
                            color={
                              order.status === "paid"
                                ? theme.icon.success.icon
                                : status!.iconColor
                            }
                          />
                        </View>

                        <AppText variant="bodyLargeBold">
                          {order.customerName}
                        </AppText>

                        <AppText
                          variant="bodySmall"
                          color="secondary"
                          numberOfLines={1}
                        >
                          {totalItems} item
                          {totalItems === 1 ? "" : "s"} • {productSummary}
                        </AppText>
                      </View>

                      {/* PRICE */}

                      <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                          alignSelf: "stretch",
                        }}
                      >
                        <AppText variant="bodySmall" color="secondary">
                          {formatOrderDate(order.createdAt)}
                        </AppText>

                        <AppText
                          color={
                            order.status === "paid"
                              ? "success"
                              : status!.amountColor
                          }
                          variant="bodyLargeBold"
                        >
                          {formatCurrency(order.total, {
                            currency: order.currency,
                          })}
                        </AppText>

                        <Pressable
                          hitSlop={10}
                          onPress={() => {
                            setSelectedOrder(order);
                            orderSummaryBottomSheetRef.current?.present();
                          }}
                        >
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={20}
                            color={theme.text.primary}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </Card>
                );
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      <FilterBottomSheet
        ref={bottomSheetRef}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        onApply={(filters) => {
          setAppliedFilters(filters);
        }}
      />
    </>
  );
}
