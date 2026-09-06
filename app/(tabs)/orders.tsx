import {
  View,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { AppText } from "@/components/ui/AppText";
import { SearchBar } from "@/components/ui/SearchBar";
import { UICard } from "@/components/ui/UICard";
import { Card } from "@/components/ui/Card";
import { FilterButton } from "@/components/ui/FilterButton";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";

import { FilterBottomSheet } from "@/components/bottom-sheet/FilterBottomSheet";
import { OrderActionsBottomSheet } from "@/components/bottom-sheet/OrderActionsBottomSheet";

import type { OrderFilter } from "@/types/order-filter";
import type { OrderFilters } from "@/types/orderFilters";
import type { Order } from "@/types/order";

import { defaultOrderFilters } from "@/constants/defaultOrderFilters";
import { PAYMENT_CHANNELS } from "@/constants/paymentChannels";
import { ORDER_STATUS } from "@/constants/orderStatus";

import { USE_MOCK_ORDERS } from "@/mocks/config";
import { MOCK_ORDERS } from "@/mocks/orders";

import { useOrders } from "@/hooks/orders/useOrders";
import { useProducts } from "@/hooks/products/useProducts";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate } from "@/utils/formatOrderDate";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme, radius } from "@/theme";

/**
 * ============================================================================
 * INFINITE SCROLL CONFIGURATION
 * ============================================================================
 */

const ORDERS_PER_BATCH = 10;

/**
 * ============================================================================
 * ORDERS SCREEN
 * ============================================================================
 */

export default function OrdersScreen() {
  /**
   * -------------------------------------------------------------------------
   * ORDERS API
   * -------------------------------------------------------------------------
   */

  const {
    data,
    isLoading: apiIsLoading,
    isRefetching: apiIsRefetching,
    isFetchingNextPage: apiIsFetchingNextPage,
    hasNextPage: apiHasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useOrders();

  /**
   * -------------------------------------------------------------------------
   * ORDERS
   * -------------------------------------------------------------------------
   */

  const orders = useMemo(() => {
    if (USE_MOCK_ORDERS) {
      return MOCK_ORDERS;
    }

    return data?.pages.flatMap((page) => page.orders) ?? [];
  }, [data]);

  /**
   * -------------------------------------------------------------------------
   * LOADING
   * -------------------------------------------------------------------------
   */

  const isLoading = USE_MOCK_ORDERS ? false : apiIsLoading;

  const isRefetching = USE_MOCK_ORDERS ? false : apiIsRefetching;

  const isFetchingNextPage = USE_MOCK_ORDERS ? false : apiIsFetchingNextPage;

  const hasNextPage = USE_MOCK_ORDERS ? false : apiHasNextPage;

  /**
   * -------------------------------------------------------------------------
   * MOCK INFINITE SCROLL
   * -------------------------------------------------------------------------
   */

  const [visibleOrderCount, setVisibleOrderCount] = useState(ORDERS_PER_BATCH);

  const [isLoadingMoreMock, setIsLoadingMoreMock] = useState(false);

  /**
   * -------------------------------------------------------------------------
   * PRODUCTS
   * -------------------------------------------------------------------------
   */

  const { products } = useProducts();

  /**
   * -------------------------------------------------------------------------
   * STATE
   * -------------------------------------------------------------------------
   */

  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [draftFilters, setDraftFilters] =
    useState<OrderFilters>(defaultOrderFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<OrderFilters>(defaultOrderFilters);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [refreshingMock, setRefreshingMock] = useState(false);

  /**
   * -------------------------------------------------------------------------
   * BOTTOM SHEETS
   * -------------------------------------------------------------------------
   */

  const filterBottomSheetRef = useRef<BottomSheetModal>(null);

  const orderActionsBottomSheetRef = useRef<BottomSheetModal>(null);

  /**
   * -------------------------------------------------------------------------
   * OPEN ORDER ACTIONS
   * -------------------------------------------------------------------------
   */

  const handleOpenOrderActions = useCallback((order: Order) => {
    setSelectedOrder(order);

    requestAnimationFrame(() => {
      orderActionsBottomSheetRef.current?.present();
    });
  }, []);

  /**
   * -------------------------------------------------------------------------
   * ACTIVE FILTERS
   * -------------------------------------------------------------------------
   */

  const hasActiveFilters = useMemo(() => {
    const hasStatusFilter = selectedFilter !== "all";

    const hasAmountFilter =
      appliedFilters.amount.min !== undefined ||
      appliedFilters.amount.max !== undefined;

    const hasDateFilter =
      appliedFilters.date.start !== undefined ||
      appliedFilters.date.end !== undefined;

    const hasSortFilter = appliedFilters.sort !== "mostRecent";

    return hasStatusFilter || hasAmountFilter || hasDateFilter || hasSortFilter;
  }, [selectedFilter, appliedFilters]);

  /**
   * -------------------------------------------------------------------------
   * FILTERING + SORTING
   * -------------------------------------------------------------------------
   */

  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      /**
       * STATUS
       */

      const matchesStatus =
        selectedFilter === "all" || order.status === selectedFilter;

      /**
       * SEARCH
       */

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        order.reference.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(query)
        );

      /**
       * AMOUNT
       */

      const matchesAmount =
        (appliedFilters.amount.min === undefined ||
          order.total >= appliedFilters.amount.min) &&
        (appliedFilters.amount.max === undefined ||
          order.total <= appliedFilters.amount.max);

      /**
       * DATE
       */

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

    /**
     * SORT
     */

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

  /**
   * -------------------------------------------------------------------------
   * RESET MOCK PAGINATION
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    setVisibleOrderCount(ORDERS_PER_BATCH);
  }, [searchQuery, selectedFilter, appliedFilters]);

  /**
   * -------------------------------------------------------------------------
   * DISPLAYED ORDERS
   * -------------------------------------------------------------------------
   */

  const displayedOrders = useMemo(() => {
    if (!USE_MOCK_ORDERS) {
      return filteredOrders;
    }

    return filteredOrders.slice(0, visibleOrderCount);
  }, [filteredOrders, visibleOrderCount]);

  /**
   * -------------------------------------------------------------------------
   * MOCK HAS MORE
   * -------------------------------------------------------------------------
   */

  const hasMoreMockOrders = displayedOrders.length < filteredOrders.length;

  /**
   * -------------------------------------------------------------------------
   * LOAD MORE
   * -------------------------------------------------------------------------
   */

  const loadMoreOrders = useCallback(() => {
    if (!USE_MOCK_ORDERS) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }

      return;
    }

    if (isLoadingMoreMock || !hasMoreMockOrders) {
      return;
    }

    setIsLoadingMoreMock(true);

    setTimeout(() => {
      setVisibleOrderCount((currentCount) =>
        Math.min(currentCount + ORDERS_PER_BATCH, filteredOrders.length)
      );

      setIsLoadingMoreMock(false);
    }, 150);
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoadingMoreMock,
    hasMoreMockOrders,
    filteredOrders.length,
  ]);

  /**
   * -------------------------------------------------------------------------
   * ORDERS THIS WEEK
   * -------------------------------------------------------------------------
   */

  const ordersThisWeek = useMemo(() => {
    const now = new Date();

    const startOfWeek = new Date(now);

    const day = startOfWeek.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(startOfWeek.getDate() + diff);

    startOfWeek.setHours(0, 0, 0, 0);

    return orders.filter((order) => new Date(order.createdAt) >= startOfWeek);
  }, [orders]);

  /**
   * -------------------------------------------------------------------------
   * PRODUCT LOOKUP
   * -------------------------------------------------------------------------
   */

  const productsById = useMemo(() => {
    return Object.fromEntries(products.map((product) => [product.id, product]));
  }, [products]);

  /**
   * -------------------------------------------------------------------------
   * SCREEN STATES
   * -------------------------------------------------------------------------
   *
   * State priority:
   *
   * 1. Initial loading
   * 2. First-time user
   * 3. Existing orders + API error
   * 4. Existing orders + no search/filter results
   * 5. Orders list
   *
   * A brand-new merchant should not see an error state simply because they
   * have not received their first order yet.
   */

  const hasOrders = orders.length > 0;

  const isFirstTimeUser =
    !isLoading && !hasOrders && !hasActiveFilters && searchQuery.trim() === "";

  const showOrderError = !isLoading && !USE_MOCK_ORDERS && !!error && hasOrders;

  const hasNoResults =
    !isLoading &&
    !showOrderError &&
    hasOrders &&
    !isFirstTimeUser &&
    filteredOrders.length === 0;

  /**
   * -------------------------------------------------------------------------
   * HEADER
   * -------------------------------------------------------------------------
   */

  const headerSubtitle = useMemo(() => {
    if (isLoading) {
      return "Loading orders...";
    }

    if (isFirstTimeUser) {
      return "Start accepting orders";
    }

    const statusLabels: Record<OrderFilter, string> = {
      all: "order",
      paid: "paid order",
      delivered: "delivered order",
      returned: "returned order",
      failed: "failed order",
    };

    const filteredOrdersThisWeek =
      selectedFilter === "all"
        ? ordersThisWeek
        : ordersThisWeek.filter((order) => order.status === selectedFilter);

    const count = filteredOrdersThisWeek.length;

    const label = statusLabels[selectedFilter];

    return `${count} ${label}${count === 1 ? "" : "s"} this week`;
  }, [isLoading, isFirstTimeUser, ordersThisWeek, selectedFilter]);

  /**
   * -------------------------------------------------------------------------
   * SEARCH / FILTER
   * -------------------------------------------------------------------------
   */

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setSelectedFilter("all");

    setAppliedFilters(defaultOrderFilters);

    setDraftFilters(defaultOrderFilters);
  };

  /**
   * -------------------------------------------------------------------------
   * REFRESH
   * -------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    if (USE_MOCK_ORDERS) {
      setRefreshingMock(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      setVisibleOrderCount(ORDERS_PER_BATCH);

      setRefreshingMock(false);

      return;
    }

    await refetch();
  };

  /**
   * -------------------------------------------------------------------------
   * REFRESHING
   * -------------------------------------------------------------------------
   */

  const refreshing = USE_MOCK_ORDERS ? refreshingMock : isRefetching;

  /**
   * -------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------
   */

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
          <View
            style={{
              flex: 1,
            }}
          >
            {/* ============================================================
                HEADER
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h1">Orders</AppText>

                <AppText variant="bodySmall" color="secondary">
                  {headerSubtitle}
                </AppText>
              </View>
            </View>

            {/* ============================================================
                SEARCH + FILTER
                Hidden for first-time users.
            ============================================================ */}

            {!isFirstTimeUser && !showOrderError && (
              <View
                style={{
                  marginTop: spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search orders"
                  />
                </View>

                <FilterButton
                  active={hasActiveFilters}
                  onPress={() => {
                    setDraftFilters(appliedFilters);

                    filterBottomSheetRef.current?.present();
                  }}
                />
              </View>
            )}

            {/* ============================================================
                STATUS FILTERS
                Hidden for first-time users.
            ============================================================ */}

            {!isFirstTimeUser && !showOrderError && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  marginTop: spacing.md,
                  flexGrow: 0,
                }}
                contentContainerStyle={{
                  gap: spacing.sm,
                  paddingRight: spacing.lg,
                }}
              >
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
                  variant={
                    selectedFilter === "delivered" ? "active" : "default"
                  }
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
              </ScrollView>
            )}

            {/* ============================================================
                CONTENT
            ============================================================ */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
            >
              {/*
               * ============================================================
               * INITIAL LOADING
               * ============================================================
               */}

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
                    Loading orders...
                  </AppText>
                </View>
              ) : isFirstTimeUser ? (
                /*
                 * ==========================================================
                 * FIRST-TIME USER
                 * ==========================================================
                 */

                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  {/* ORDERS IMAGE */}

                  <Image
                    source={require("../../assets/images/default-orders.png")}
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
                    No orders yet
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
                    Orders will appear here when customers make purchases
                    through your store.
                  </AppText>

                  <Button
                    title="Add Product"
                    variant="primary"
                    style={{
                      marginTop: spacing.lg,
                    }}
                    onPress={() => router.push(ROUTES.ADD_PRODUCT_INFO)}
                  />

                  <AppText
                    variant="caption"
                    color="muted"
                    style={{
                      marginTop: spacing.sm,
                      textAlign: "center",
                    }}
                  >
                    Add products to your store to start accepting orders.
                  </AppText>
                </Card>
              ) : showOrderError ? (
                /*
                 * ==========================================================
                 * EXISTING ORDERS + ERROR
                 * ==========================================================
                 */

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
                    Unable to load orders
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
                    We couldn't load your orders. Please try again.
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
                /*
                 * ==========================================================
                 * SEARCH / FILTER EMPTY STATE
                 * ==========================================================
                 */

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
                      backgroundColor: theme.icon.default.background,
                      alignItems: "center",
                      justifyContent: "center",
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
                    No orders found
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
                    Try changing your search or filters to find what you're
                    looking for.
                  </AppText>

                  {searchQuery.trim() !== "" && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Clear order search"
                      onPress={clearSearch}
                      style={{
                        marginTop: spacing.md,
                      }}
                    >
                      <AppText color="link">Clear Search</AppText>
                    </Pressable>
                  )}

                  {hasActiveFilters && searchQuery.trim() === "" && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Clear order filters"
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
                /*
                 * ==========================================================
                 * ORDERS LIST
                 * ==========================================================
                 */

                <FlatList
                  style={{
                    flex: 1,
                  }}
                  data={displayedOrders}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor={theme.icon.branding.icon}
                      colors={[theme.icon.branding.icon]}
                      progressBackgroundColor={theme.background.surface}
                    />
                  }
                  onEndReached={loadMoreOrders}
                  onEndReachedThreshold={0.5}
                  contentContainerStyle={{
                    paddingTop: spacing.md,
                    gap: spacing.md,
                    paddingBottom: spacing.lg,
                  }}
                  keyExtractor={(item) => item.id}
                  ListFooterComponent={
                    hasMoreMockOrders ||
                    isLoadingMoreMock ||
                    isFetchingNextPage ? (
                      <View
                        style={{
                          paddingVertical: spacing.lg,
                          alignItems: "center",
                        }}
                      >
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
                          Loading more orders...
                        </AppText>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingVertical: spacing.lg,
                          alignItems: "center",
                        }}
                      >
                        <AppText variant="caption" color="muted">
                          {filteredOrders.length > 0
                            ? "You've reached the end of your orders."
                            : ""}
                        </AppText>
                      </View>
                    )
                  }
                  renderItem={({ item: order }) => {
                    /**
                     * STATUS
                     */

                    const status =
                      order.status !== "paid"
                        ? ORDER_STATUS[order.status]
                        : null;

                    /**
                     * FIRST ITEM
                     */

                    const firstItem = order.items[0];

                    /**
                     * TOTAL ITEMS
                     */

                    const totalItems = order.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    );

                    /**
                     * PRODUCT
                     */

                    const product = firstItem
                      ? productsById[firstItem.productId]
                      : undefined;

                    /**
                     * PRODUCT SUMMARY
                     */

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
                          {/* PRODUCT IMAGE */}

                          <ProductImage
                            image={product?.productImages?.[0]?.url ?? ""}
                          />

                          {/* ORDER DETAILS */}

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
                                    ? PAYMENT_CHANNELS[order.paymentChannel]
                                        .icon
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

                          {/* RIGHT SIDE */}

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
                              variant="bodyLargeBold"
                              style={{
                                color:
                                  order.status === "paid"
                                    ? theme.text.success
                                    : status!.textColor,
                              }}
                            >
                              {formatCurrency(order.total, {
                                currency: order.currency,
                              })}
                            </AppText>

                            {/* ORDER ACTIONS */}

                            <Pressable
                              hitSlop={10}
                              accessibilityRole="button"
                              accessibilityLabel={`Actions for order ${order.reference}`}
                              onPress={() => handleOpenOrderActions(order)}
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
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ======================================================================
          FILTER
      ====================================================================== */}

      <FilterBottomSheet
        ref={filterBottomSheetRef}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        onApply={(filters) => {
          setAppliedFilters(filters);
        }}
      />

      {/* ======================================================================
          ORDER ACTIONS
      ====================================================================== */}

      <OrderActionsBottomSheet
        ref={orderActionsBottomSheetRef}
        order={selectedOrder}
        onDismiss={() => {
          setSelectedOrder(null);
        }}
      />
    </>
  );
}
