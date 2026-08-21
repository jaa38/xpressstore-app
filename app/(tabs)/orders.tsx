import {
  View,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
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

import { useOrders } from "@/hooks/orders/useOrders";
import { useProducts } from "@/hooks/products/useProducts";

import { formatCurrency } from "@/utils/formatCurrency";
import { formatOrderDate } from "@/utils/formatOrderDate";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme, radius } from "@/theme";

/**
 * ============================================================================
 * MOCK MODE
 * ============================================================================
 *
 * Set to false when the Orders API is ready.
 */

const USE_MOCK_ORDERS = true;

/**
 * ============================================================================
 * INFINITE SCROLL CONFIGURATION
 * ============================================================================
 *
 * In mock mode, orders are progressively revealed in batches.
 *
 * In API mode, the actual API pagination is handled by useOrders().
 */

const ORDERS_PER_BATCH = 10;

/**
 * ============================================================================
 * MOCK ORDERS
 * ============================================================================
 */

const MOCK_ORDERS: Order[] = [
  {
    id: "mock-order-001",
    reference: "ORD-20260821",
    customerName: "Chinedu Okafor",
    customerPhone: "08031234567",
    customerEmail: "chinedu.okafor@example.com",

    deliveryAddress: {
      street: "14 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "106104",
    },

    total: 85000,
    currency: "NGN",

    items: [
      {
        productId: "1",
        productName: "Classic Leather Sneakers",
        quantity: 1,
        unitPrice: 85000,
        subtotal: 85000,
        currency: "NGN",
      },
    ],

    paymentChannel: "card",
    status: "paid",

    createdAt: "2026-08-21T09:15:00.000Z",
    updatedAt: "2026-08-21T09:20:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-002",
    reference: "ORD-20260820",
    customerName: "Amaka Eze",
    customerPhone: "08145678901",
    customerEmail: "amaka.eze@example.com",

    deliveryAddress: {
      street: "22 GRA Avenue",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101233",
    },

    total: 142500,
    currency: "NGN",

    items: [
      {
        productId: "2",
        productName: "Premium Ankara Tote Bag",
        quantity: 2,
        unitPrice: 45000,
        subtotal: 90000,
        currency: "NGN",
      },
      {
        productId: "3",
        productName: "Minimalist Wrist Watch",
        quantity: 1,
        unitPrice: 52500,
        subtotal: 52500,
        currency: "NGN",
      },
    ],

    paymentChannel: "bankTransfer",
    status: "delivered",

    createdAt: "2026-08-20T13:45:00.000Z",
    updatedAt: "2026-08-21T08:30:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-003",
    reference: "ORD-20260819",
    customerName: "Tunde Adeyemi",
    customerPhone: "07012345678",
    customerEmail: "tunde.adeyemi@example.com",

    deliveryAddress: {
      street: "8 Wuse 2 Crescent",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
      postalCode: "900288",
    },

    total: 225000,
    currency: "NGN",

    items: [
      {
        productId: "4",
        productName: "Premium Wireless Headphones",
        quantity: 1,
        unitPrice: 125000,
        subtotal: 125000,
        currency: "NGN",
      },
      {
        productId: "5",
        productName: "Smart Travel Backpack",
        quantity: 1,
        unitPrice: 100000,
        subtotal: 100000,
        currency: "NGN",
      },
    ],

    paymentChannel: "bank",
    status: "returned",

    createdAt: "2026-08-19T10:30:00.000Z",
    updatedAt: "2026-08-20T16:00:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-004",
    reference: "ORD-20260818",
    customerName: "Fatima Bello",
    customerPhone: "08098765432",
    customerEmail: "fatima.bello@example.com",

    deliveryAddress: {
      street: "17 Ahmadu Bello Way",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101241",
    },

    total: 67500,
    currency: "NGN",

    items: [
      {
        productId: "6",
        productName: "Classic Cotton Shirt",
        quantity: 3,
        unitPrice: 22500,
        subtotal: 67500,
        currency: "NGN",
      },
    ],

    paymentChannel: "ussd",
    status: "failed",

    createdAt: "2026-08-18T15:20:00.000Z",
    updatedAt: "2026-08-18T15:35:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-005",
    reference: "ORD-20260817",
    customerName: "David Williams",
    customerPhone: "09023456789",
    customerEmail: "david.williams@example.com",

    deliveryAddress: {
      street: "5 Allen Avenue",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101233",
    },

    total: 310000,
    currency: "NGN",

    items: [
      {
        productId: "7",
        productName: "Executive Office Chair",
        quantity: 1,
        unitPrice: 180000,
        subtotal: 180000,
        currency: "NGN",
      },
      {
        productId: "8",
        productName: "Adjustable Laptop Stand",
        quantity: 2,
        unitPrice: 35000,
        subtotal: 70000,
        currency: "NGN",
      },
      {
        productId: "9",
        productName: "Wireless Keyboard",
        quantity: 1,
        unitPrice: 60000,
        subtotal: 60000,
        currency: "NGN",
      },
    ],

    paymentChannel: "nqr",
    status: "paid",

    createdAt: "2026-08-17T11:10:00.000Z",
    updatedAt: "2026-08-17T11:15:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-006",
    reference: "ORD-20260816",
    customerName: "Blessing Johnson",
    customerPhone: "08167890123",
    customerEmail: "blessing.johnson@example.com",

    deliveryAddress: {
      street: "31 Banana Island Road",
      city: "Ikoyi",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "106104",
    },

    total: 119000,
    currency: "NGN",

    items: [
      {
        productId: "10",
        productName: "Premium Crossbody Bag",
        quantity: 1,
        unitPrice: 69000,
        subtotal: 69000,
        currency: "NGN",
      },
      {
        productId: "11",
        productName: "Fashion Sunglasses",
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000,
        currency: "NGN",
      },
    ],

    paymentChannel: "card",
    status: "delivered",

    createdAt: "2026-08-16T09:40:00.000Z",
    updatedAt: "2026-08-17T14:20:00.000Z",

    statusHistory: [],
  },
];

/**
 * ============================================================================
 * MOCK PAGE
 * ============================================================================
 */

const MOCK_PAGE = {
  orders: MOCK_ORDERS,
};

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
      return MOCK_PAGE.orders;
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
   * MOCK INFINITE SCROLL STATE
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
   * BOTTOM SHEET REFS
   * -------------------------------------------------------------------------
   */

  const filterBottomSheetRef = useRef<BottomSheetModal>(null);

  const orderActionsBottomSheetRef = useRef<BottomSheetModal>(null);

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
   * RESET MOCK INFINITE SCROLL
   * -------------------------------------------------------------------------
   *
   * Whenever search, status or advanced filters change, start again from the
   * first batch.
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
   * LOAD MORE ORDERS
   * -------------------------------------------------------------------------
   */

  const loadMoreOrders = useCallback(() => {
    /**
     * API MODE
     */

    if (!USE_MOCK_ORDERS) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }

      return;
    }

    /**
     * MOCK MODE
     */

    if (isLoadingMoreMock || !hasMoreMockOrders) {
      return;
    }

    setIsLoadingMoreMock(true);

    /**
     * Small delay gives the footer loader time to render and makes the
     * infinite-scroll behaviour feel natural during mock development.
     */

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
   */

  const isFirstTimeUser =
    !isLoading &&
    orders.length === 0 &&
    !hasActiveFilters &&
    searchQuery.trim() === "";

  const showOrderError =
    !isLoading && !USE_MOCK_ORDERS && !!error && orders.length > 0;

  const hasNoResults =
    !isLoading &&
    !showOrderError &&
    !isFirstTimeUser &&
    filteredOrders.length === 0;

  /**
   * -------------------------------------------------------------------------
   * HEADER
   * -------------------------------------------------------------------------
   */

  const headerSubtitle = isLoading
    ? "Loading orders..."
    : isFirstTimeUser
      ? "Start accepting orders"
      : ordersThisWeek.length === 1
        ? "1 order this week"
        : `${ordersThisWeek.length} orders this week`;

  /**
   * -------------------------------------------------------------------------
   * SEARCH / FILTER HANDLERS
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

      /**
       * Reset infinite scroll to the first batch.
       */

      setVisibleOrderCount(ORDERS_PER_BATCH);

      setRefreshingMock(false);

      return;
    }

    await refetch();

    /**
     * The API itself controls how many pages are loaded.
     * Resetting this state is harmless and keeps the screen consistent
     * if the mode is changed during development.
     */

    setVisibleOrderCount(ORDERS_PER_BATCH);
  };

  /**
   * -------------------------------------------------------------------------
   * REFRESHING STATE
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

                <AppText variant="body" color="secondary">
                  {headerSubtitle}
                </AppText>
              </View>
            </View>

            {/* ============================================================
                SEARCH + FILTER
            ============================================================ */}

            {!isFirstTimeUser && !showOrderError && (
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

                    filterBottomSheetRef.current?.present();
                  }}
                />
              </View>
            )}

            {/* ============================================================
                STATUS FILTERS
            ============================================================ */}

            {!isFirstTimeUser && !showOrderError && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: spacing.md,
                  gap: spacing.sm,
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
              </View>
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
              {/* ==========================================================
                  LOADING
              ========================================================== */}

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
              ) : showOrderError ? (
                /* ==========================================================
                   ERROR
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
              ) : isFirstTimeUser ? (
                /* ==========================================================
                   FIRST-TIME USER
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
              ) : hasNoResults ? (
                /* ==========================================================
                   NO SEARCH RESULTS
                ========================================================== */

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Card
                    style={{
                      marginTop: spacing.md,
                      paddingVertical: spacing.xl,
                      paddingHorizontal: spacing.lg,
                      alignItems: "center",
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
                      }}
                    >
                      Try searching with a different order reference, customer
                      or product.
                    </AppText>

                    {searchQuery.trim() !== "" && (
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

                    {hasActiveFilters && searchQuery.trim() === "" && (
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
                </View>
              ) : (
                /* ==========================================================
                   ORDER LIST — INFINITE SCROLL
                ========================================================== */

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
                    (USE_MOCK_ORDERS && hasMoreMockOrders) ||
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
                          {USE_MOCK_ORDERS && filteredOrders.length > 0
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
                            {/* REFERENCE + STATUS */}

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

                            {/* CUSTOMER */}

                            <AppText variant="bodyLargeBold">
                              {order.customerName}
                            </AppText>

                            {/* ITEMS */}

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
                            {/* DATE */}

                            <AppText variant="bodySmall" color="secondary">
                              {formatOrderDate(order.createdAt)}
                            </AppText>

                            {/* AMOUNT */}

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

                            {/* ACTIONS */}

                            <Pressable
                              hitSlop={10}
                              accessibilityRole="button"
                              accessibilityLabel={`Actions for order ${order.reference}`}
                              onPress={() => {
                                setSelectedOrder(order);

                                orderActionsBottomSheetRef.current?.present();
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
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ======================================================================
          FILTER BOTTOM SHEET
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
          ORDER ACTIONS BOTTOM SHEET
      ====================================================================== */}

      <OrderActionsBottomSheet
        ref={orderActionsBottomSheetRef}
        order={selectedOrder}
      />
    </>
  );
}
