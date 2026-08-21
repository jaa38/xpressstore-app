import { router, useFocusEffect } from "expo-router";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Switch,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { useCallback, useEffect, useMemo, useState } from "react";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProductImage } from "@/components/ui/ProductImage";
import { SearchBar } from "@/components/ui/SearchBar";

import { ROUTES } from "@/navigation/routes";

import { useProducts } from "@/hooks/products/useProducts";
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";
import { useToggleProductStatus } from "@/hooks/products/useToggleProductStatus";

import { useToast } from "@/hooks/useToast";

import { formatCurrency } from "@/utils/formatters/currency";

import { Currency } from "@/types/currency";
import type { MerchantProduct } from "@/types/product";

import { radius, spacing, theme } from "@/theme";

/**
 * ============================================================================
 * MOCK MODE
 * ============================================================================
 *
 * Set to false when you want to use the real products API.
 */
const USE_MOCK_PRODUCTS = true;

/**
 * ============================================================================
 * MOCK PRODUCTS
 * ============================================================================
 */

const MOCK_PRODUCTS: MerchantProduct[] = [
  {
    id: 1,
    productReference: "PROD-001",
    productName: "Classic Leather Sneakers",
    description:
      "Classic everyday leather sneakers designed for comfort and durability.",
    unitPrice: 85000,
    currency: "NGN",
    totalInStock: 18,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "classic-leather-sneakers.jpg",
        url: "",
      },
    ],
  },

  {
    id: 2,
    productReference: "PROD-002",
    productName: "Premium Ankara Tote Bag",
    description:
      "A stylish Ankara tote bag suitable for everyday shopping and casual use.",
    unitPrice: 45000,
    currency: "NGN",
    totalInStock: 4,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "premium-ankara-tote-bag.jpg",
        url: "",
      },
    ],
  },

  {
    id: 3,
    productReference: "PROD-003",
    productName: "Minimalist Wrist Watch",
    description: "Minimalist wrist watch featuring a clean and modern design.",
    unitPrice: 52500,
    currency: "NGN",
    totalInStock: 12,
    lowStockAlert: 4,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "minimalist-wrist-watch.jpg",
        url: "",
      },
    ],
  },

  {
    id: 4,
    productReference: "PROD-004",
    productName: "Premium Wireless Headphones",
    description:
      "Premium wireless headphones designed for music, calls and entertainment.",
    unitPrice: 125000,
    currency: "NGN",
    totalInStock: 2,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "premium-wireless-headphones.jpg",
        url: "",
      },
    ],
  },

  {
    id: 5,
    productReference: "PROD-005",
    productName: "Smart Travel Backpack",
    description:
      "Spacious travel backpack with dedicated compartments for everyday essentials.",
    unitPrice: 100000,
    currency: "NGN",
    totalInStock: 25,
    lowStockAlert: 5,
    inStock: true,
    isActive: false,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "smart-travel-backpack.jpg",
        url: "",
      },
    ],
  },

  {
    id: 6,
    productReference: "PROD-006",
    productName: "Classic Cotton Shirt",
    description:
      "Comfortable cotton shirt suitable for casual and smart-casual outfits.",
    unitPrice: 22500,
    currency: "NGN",
    totalInStock: 3,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "classic-cotton-shirt.jpg",
        url: "",
      },
    ],
  },

  {
    id: 7,
    productReference: "PROD-007",
    productName: "Executive Office Chair",
    description:
      "Comfortable executive office chair designed for long working sessions.",
    unitPrice: 180000,
    currency: "NGN",
    totalInStock: 9,
    lowStockAlert: 3,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "executive-office-chair.jpg",
        url: "",
      },
    ],
  },

  {
    id: 8,
    productReference: "PROD-008",
    productName: "Adjustable Laptop Stand",
    description: "Adjustable laptop stand designed to improve desk ergonomics.",
    unitPrice: 35000,
    currency: "NGN",
    totalInStock: 16,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "adjustable-laptop-stand.jpg",
        url: "",
      },
    ],
  },

  {
    id: 9,
    productReference: "PROD-009",
    productName: "Wireless Keyboard",
    description:
      "Compact wireless keyboard suitable for work and everyday computing.",
    unitPrice: 60000,
    currency: "NGN",
    totalInStock: 7,
    lowStockAlert: 3,
    inStock: true,
    isActive: false,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "wireless-keyboard.jpg",
        url: "",
      },
    ],
  },

  {
    id: 10,
    productReference: "PROD-010",
    productName: "Premium Crossbody Bag",
    description:
      "Premium crossbody bag combining practical storage with a modern design.",
    unitPrice: 69000,
    currency: "NGN",
    totalInStock: 22,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "premium-crossbody-bag.jpg",
        url: "",
      },
    ],
  },

  {
    id: 11,
    productReference: "PROD-011",
    productName: "Fashion Sunglasses",
    description: "Modern fashion sunglasses designed for everyday wear.",
    unitPrice: 25000,
    currency: "NGN",
    totalInStock: 1,
    lowStockAlert: 5,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "fashion-sunglasses.jpg",
        url: "",
      },
    ],
  },

  {
    id: 12,
    productReference: "PROD-012",
    productName: "Modern Canvas Backpack",
    description:
      "Durable canvas backpack suitable for work, school and everyday travel.",
    unitPrice: 55000,
    currency: "NGN",
    totalInStock: 14,
    lowStockAlert: 4,
    inStock: true,
    isActive: true,
    productCategories: [],
    variations: [],
    productImages: [
      {
        filename: "modern-canvas-backpack.jpg",
        url: "",
      },
    ],
  },
];

/**
 * ============================================================================
 * RIGHT SWIPE ACTIONS
 * ============================================================================
 */

function RightActions({
  onDelete,
  disabled,
}: {
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Delete product"
      disabled={disabled}
      onPress={onDelete}
      style={{
        width: 90,
        marginLeft: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.action.primary.delete,
        borderRadius: radius.md,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name="trash-outline" size={24} color={theme.text.inverse} />

      <AppText
        variant="bodySmall"
        color="inverse"
        style={{
          marginTop: spacing.xs,
        }}
      >
        Delete
      </AppText>
    </Pressable>
  );
}

/**
 * ============================================================================
 * PRODUCT CARD
 * ============================================================================
 */

function ProductCard({
  product,
  onToggle,
  onDelete,
  onEdit,
  deleting,
  toggling,
}: {
  product: MerchantProduct;

  onToggle: (productId: number, value: boolean) => void;

  onDelete: (productId: number) => void;

  deleting: boolean;

  toggling: boolean;

  onEdit: (productId: number) => void;
}) {
  return (
    <Swipeable
      enabled={!deleting && !toggling}
      renderRightActions={() => (
        <RightActions
          disabled={deleting || toggling}
          onDelete={() => onDelete(product.id)}
        />
      )}
    >
      <Card
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          borderWidth: 1,
          borderColor: theme.border.default,
        }}
      >
        {/* ================================================================
            PRODUCT IMAGE
        ================================================================ */}

        <ProductImage image={product.productImages?.[0]?.url ?? ""} />

        {/* ================================================================
            PRODUCT INFORMATION
        ================================================================ */}

        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyLargeBold" numberOfLines={1}>
            {product.productName}
          </AppText>

          <AppText variant="bodySmall" color="secondary">
            {product.totalInStock} in stock
          </AppText>

          <AppText variant="bodyBold" color="warning">
            {formatCurrency(product.unitPrice, {
              currency: product.currency as Currency,
            })}
          </AppText>
        </View>

        {/* ================================================================
            PRODUCT ACTIONS
        ================================================================ */}

        <View
          style={{
            alignSelf: "stretch",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingVertical: spacing.xs,
          }}
        >
          {/* EDIT */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${product.productName}`}
            disabled={deleting || toggling}
            onPress={() => onEdit(product.id)}
            hitSlop={12}
            style={{
              opacity: deleting || toggling ? 0.5 : 1,
            }}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={theme.icon.default.icon}
            />
          </Pressable>

          {/* ACTIVE / INACTIVE */}

          <Switch
            disabled={deleting || toggling}
            value={product.isActive}
            onValueChange={(value) => onToggle(product.id, value)}
          />
        </View>
      </Card>
    </Swipeable>
  );
}

/**
 * ============================================================================
 * PRODUCTS SCREEN
 * ============================================================================
 */

export default function ProductScreen() {
  /**
   * --------------------------------------------------------------------------
   * PRODUCTS API
   * --------------------------------------------------------------------------
   */

  const {
    products,
    isLoading: apiLoading,
    isRefetching: apiRefetching,
    error: apiError,
    refetch: apiRefetch,
  } = useProducts();

  /**
   * --------------------------------------------------------------------------
   * MOCK PRODUCTS STATE
   * --------------------------------------------------------------------------
   */

  const [mockProducts, setMockProducts] =
    useState<MerchantProduct[]>(MOCK_PRODUCTS);

  /**
   * --------------------------------------------------------------------------
   * SOURCE OF TRUTH
   * --------------------------------------------------------------------------
   */

  const productList = USE_MOCK_PRODUCTS ? mockProducts : (products ?? []);

  const isLoading = USE_MOCK_PRODUCTS ? false : apiLoading;

  const isRefetching = USE_MOCK_PRODUCTS ? false : apiRefetching;

  const error = USE_MOCK_PRODUCTS ? null : apiError;

  /**
   * --------------------------------------------------------------------------
   * MUTATIONS
   * --------------------------------------------------------------------------
   */

  const deleteProductMutation = useDeleteProduct();

  const toggleStatusMutation = useToggleProductStatus();

  const { showToast } = useToast();

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * --------------------------------------------------------------------------
   * PAGINATION
   * --------------------------------------------------------------------------
   */

  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 5;

  /**
   * --------------------------------------------------------------------------
   * LOW STOCK
   * --------------------------------------------------------------------------
   */

  const [showLowStockBanner, setShowLowStockBanner] = useState(true);

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  async function onRefresh() {
    if (USE_MOCK_PRODUCTS) {
      setMockProducts([...MOCK_PRODUCTS]);

      setCurrentPage(1);

      return;
    }

    await apiRefetch();
  }

  /**
   * --------------------------------------------------------------------------
   * SORT PRODUCTS
   * --------------------------------------------------------------------------
   */

  const sortedProducts = useMemo(() => {
    return [...productList].sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
  }, [productList]);

  /**
   * --------------------------------------------------------------------------
   * SEARCH PRODUCTS
   * --------------------------------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sortedProducts;
    }

    return sortedProducts.filter((product) =>
      product.productName.toLowerCase().includes(query)
    );
  }, [sortedProducts, searchQuery]);

  /**
   * --------------------------------------------------------------------------
   * PAGINATION
   * --------------------------------------------------------------------------
   *
   * Pagination is applied AFTER search.
   *
   * Example:
   *
   * 12 products
   * 5 products per page
   *
   * Page 1 = products 1–5
   * Page 2 = products 6–10
   * Page 3 = products 11–12
   */

  const totalProductCount = filteredProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProductCount / PRODUCTS_PER_PAGE)
  );

  const displayedPageNumber = Math.min(currentPage, totalPages);

  const hasPreviousPage = displayedPageNumber > 1;

  const hasNextPage = displayedPageNumber < totalPages;

  const paginatedProducts = useMemo(() => {
    const startIndex = (displayedPageNumber - 1) * PRODUCTS_PER_PAGE;

    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, displayedPageNumber]);

  /**
   * --------------------------------------------------------------------------
   * LOW STOCK PRODUCTS
   * --------------------------------------------------------------------------
   */

  const lowStockProducts = useMemo(() => {
    return filteredProducts.filter(
      (product) => product.totalInStock <= product.lowStockAlert
    );
  }, [filteredProducts]);

  /**
   * --------------------------------------------------------------------------
   * RESET PAGINATION WHEN SEARCH
   * CHANGES
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * --------------------------------------------------------------------------
   * KEEP PAGE VALID
   * --------------------------------------------------------------------------
   *
   * This handles cases such as:
   *
   * - deleting products
   * - filtering products
   * - changing the underlying API result
   */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * --------------------------------------------------------------------------
   * KEEP LOW STOCK BANNER VISIBLE
   * --------------------------------------------------------------------------
   */

  useFocusEffect(
    useCallback(() => {
      if (lowStockProducts.length > 0) {
        setShowLowStockBanner(true);
      }
    }, [lowStockProducts.length])
  );

  /**
   * --------------------------------------------------------------------------
   * SCREEN STATES
   * --------------------------------------------------------------------------
   */

  const hasProducts = productList.length > 0;

  const isFirstTimeUser =
    !isLoading && !hasProducts && searchQuery.trim() === "";

  const showProductError = !isLoading && !!error && hasProducts;

  const hasNoSearchResults =
    !isLoading &&
    !error &&
    hasProducts &&
    searchQuery.trim() !== "" &&
    filteredProducts.length === 0;

  /**
   * --------------------------------------------------------------------------
   * TOGGLE PRODUCT
   * --------------------------------------------------------------------------
   */

  async function toggleProduct(productId: number, value: boolean) {
    /**
     * MOCK MODE
     */

    if (USE_MOCK_PRODUCTS) {
      setMockProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                isActive: value,
              }
            : product
        )
      );

      showToast({
        type: "success",
        title: "Product Updated",
        message: value ? "Product is now active." : "Product has been hidden.",
      });

      return;
    }

    /**
     * API MODE
     */

    try {
      await toggleStatusMutation.mutateAsync({
        productId,
        status: value,
      });

      showToast({
        type: "success",
        title: "Product Updated",
        message: value ? "Product is now active." : "Product has been hidden.",
      });
    } catch (error) {
      console.log("UPDATE STATUS ERROR", error);

      showToast({
        type: "error",
        title: "Update Failed",
        message: "Unable to update product status.",
      });
    }
  }

  /**
   * --------------------------------------------------------------------------
   * DELETE PRODUCT
   * --------------------------------------------------------------------------
   */

  async function handleDelete(productId: number) {
    if (deleteProductMutation.isPending) {
      return;
    }

    const product = productList.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              /**
               * MOCK MODE
               */

              if (USE_MOCK_PRODUCTS) {
                setMockProducts((currentProducts) =>
                  currentProducts.filter((item) => item.id !== productId)
                );

                /**
                 * Calculate the number
                 * of products remaining
                 * after deletion.
                 */

                const remaining = productList.length - 1;

                const filteredRemaining = filteredProducts.filter(
                  (item) => item.id !== productId
                ).length;

                const remainingPages = Math.max(
                  1,
                  Math.ceil(filteredRemaining / PRODUCTS_PER_PAGE)
                );

                /**
                 * If the current page
                 * becomes empty, move
                 * to the previous page.
                 */

                setCurrentPage((page) => Math.min(page, remainingPages));

                showToast({
                  type: "success",
                  title: "Product Deleted",
                  message: `${product.productName} has been removed successfully.`,
                });

                return;
              }

              /**
               * API MODE
               */

              await deleteProductMutation.mutateAsync(productId);

              showToast({
                type: "success",
                title: "Product Deleted",
                message: "The product has been removed successfully.",
              });
            } catch (error) {
              console.log("DELETE ERROR", error);

              showToast({
                type: "error",
                title: "Delete Failed",
                message: "Unable to delete this product. Please try again.",
              });
            }
          },
        },
      ]
    );
  }

  /**
   * --------------------------------------------------------------------------
   * EDIT PRODUCT
   * --------------------------------------------------------------------------
   */

  function handleEdit(productId: number) {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: String(productId),
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
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
            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Products</AppText>

              <AppText variant="body" color="secondary">
                {isLoading
                  ? "Loading products..."
                  : productList.length === 0
                    ? "Add your first product to start building your catalog"
                    : productList.length === 1
                      ? "1 item in catalog"
                      : `${productList.length} items in catalog`}
              </AppText>
            </View>

            {/* ADD PRODUCT */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add Product"
              disabled={
                deleteProductMutation.isPending ||
                toggleStatusMutation.isPending
              }
              onPress={() => router.push(ROUTES.ADD_PRODUCT_INFO)}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: pressed
                  ? theme.action.primary.pressed
                  : theme.action.primary.background,
                opacity:
                  deleteProductMutation.isPending ||
                  toggleStatusMutation.isPending
                    ? 0.5
                    : 1,
              })}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* ================================================================
              LOW STOCK BANNER
          ================================================================ */}

          {showLowStockBanner &&
            lowStockProducts.length > 0 &&
            !isLoading &&
            !showProductError && (
              <Card
                style={{
                  marginTop: spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  borderColor: theme.border.warning,
                  backgroundColor: theme.background.warning,
                }}
              >
                <Ionicons
                  name="warning-outline"
                  size={22}
                  color={theme.icon.warning.icon}
                />

                <View
                  style={{
                    flex: 1,
                    marginHorizontal: spacing.md,
                  }}
                >
                  <AppText variant="bodyBold" color="primary">
                    {lowStockProducts.length}{" "}
                    {lowStockProducts.length === 1
                      ? "product is"
                      : "products are"}{" "}
                    running low
                  </AppText>

                  <AppText variant="bodySmall" color="secondary">
                    Restock soon to avoid missing sales.
                  </AppText>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss low stock warning"
                  hitSlop={10}
                  onPress={() => setShowLowStockBanner(false)}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={theme.icon.default.icon}
                  />
                </Pressable>
              </Card>
            )}

          {/* ================================================================
              SEARCH
          ================================================================ */}

          {hasProducts && !showProductError && (
            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <SearchBar
                placeholder="Search products"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {/* ================================================================
              PRODUCT CONTENT
          ================================================================ */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              {/* ============================================================
                  INITIAL LOADING
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
                    Loading products...
                  </AppText>
                </View>
              ) : showProductError ? (
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
                    Unable to load products
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
                    We couldn't load your products. Please try again.
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
                      width: 56,
                      height: 56,
                      borderRadius: radius.full,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.icon.branding.background,
                    }}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={28}
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
                    No products yet
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
                    Add your first product to start building your catalogue and
                    selling to customers.
                  </AppText>

                  <Button
                    title="Add Product"
                    variant="primary"
                    style={{
                      marginTop: spacing.md,
                    }}
                    onPress={() => router.push(ROUTES.ADD_PRODUCT_INFO)}
                  />
                </Card>
              ) : hasNoSearchResults ? (
                /* ==========================================================
                   SEARCH EMPTY STATE
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
                    No products found
                  </AppText>

                  <AppText
                    variant="body"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,
                      textAlign: "center",
                    }}
                  >
                    Try searching with a different product name.
                  </AppText>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear product search"
                    onPress={() => setSearchQuery("")}
                    style={{
                      marginTop: spacing.md,
                    }}
                  >
                    <AppText color="link">Clear Search</AppText>
                  </Pressable>
                </Card>
              ) : (
                /* ==========================================================
                   PRODUCT LIST
                ========================================================== */

                <FlatList
                  style={{
                    flex: 1,
                  }}
                  contentContainerStyle={{
                    paddingBottom: spacing.md,
                  }}
                  data={paginatedProducts}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefetching}
                      onRefresh={onRefresh}
                      tintColor={theme.icon.branding.icon}
                      colors={[theme.icon.branding.icon]}
                      progressBackgroundColor={theme.background.surface}
                    />
                  }
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ProductCard
                      product={item}
                      deleting={deleteProductMutation.isPending}
                      toggling={toggleStatusMutation.isPending}
                      onToggle={toggleProduct}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: spacing.md,
                      }}
                    />
                  )}
                />
              )}
            </View>

            {/* =============================================================
                PAGINATION
            ============================================================= */}

            {!isLoading &&
              !showProductError &&
              !isFirstTimeUser &&
              filteredProducts.length > 0 &&
              totalPages > 1 && (
                <View
                  style={{
                    paddingTop: spacing.md,
                    paddingBottom: 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: spacing.md,
                    }}
                  >
                    {/* ===================================================
                        PREVIOUS
                    =================================================== */}

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
                        height: 44,
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

                    {/* ===================================================
                        PAGE INFO
                    =================================================== */}

                    <View
                      style={{
                        minWidth: 80,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppText variant="bodySmallBold" color="secondary">
                        Page {displayedPageNumber} of {totalPages}
                      </AppText>

                      <AppText
                        variant="caption"
                        color="muted"
                        style={{
                          marginTop: spacing.xs,
                        }}
                      >
                        {totalProductCount} products
                      </AppText>
                    </View>

                    {/* ===================================================
                        NEXT
                    =================================================== */}

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
                        height: 44,
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
                </View>
              )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
