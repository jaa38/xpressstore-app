import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Switch,
  View,
  Image
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { useCallback, useEffect, useMemo, useState } from "react";

import { router, useFocusEffect } from "expo-router";

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

import type { Currency } from "@/types/currency";
import type { MerchantProduct } from "@/types/product";

import { radius, spacing, theme } from "@/theme";

/**
 * ============================================================================
 * MOCKS
 * ============================================================================
 */

import { USE_MOCK_PRODUCTS } from "@/mocks/config";
import { getMockProducts } from "@/mocks/products";

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

  onEdit: (productId: number) => void;

  deleting: boolean;

  toggling: boolean;
}) {
  const actionDisabled = deleting || toggling;

  return (
    <Swipeable
      enabled={!actionDisabled}
      renderRightActions={() => (
        <RightActions
          disabled={actionDisabled}
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
        ================================================================= */}

        <ProductImage image={product.productImages?.[0]?.url ?? ""} />

        {/* ================================================================
            PRODUCT INFORMATION
        ================================================================= */}

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
        ================================================================= */}

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
            disabled={actionDisabled}
            onPress={() => onEdit(product.id)}
            hitSlop={12}
            style={{
              opacity: actionDisabled ? 0.5 : 1,
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
            disabled={actionDisabled}
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
  const insets = useSafeAreaInsets();
  /**
   * ==========================================================================
   * PRODUCTS
   * ==========================================================================
   */

  const { products, isLoading, isRefetching, error, refetch } = useProducts();

  /**
   * ==========================================================================
   * MOCK PRODUCTS STATE
   * ==========================================================================
   *
   * The shared mock repository is the source of truth in mock mode.
   *
   * This state gives this screen a React state update whenever the repository
   * changes.
   */

  const [mockProducts, setMockProducts] = useState<MerchantProduct[]>(() =>
    USE_MOCK_PRODUCTS ? getMockProducts() : []
  );

  /**
   * ==========================================================================
   * REFRESH MOCK PRODUCTS
   * ==========================================================================
   *
   * Always read directly from the shared repository.
   *
   * This is important because the Edit Product screen calls:
   *
   *     updateMockProduct()
   *
   * and then:
   *
   *     router.back()
   *
   * When this screen gets focus again, we read the latest data.
   */

  const refreshMockProducts = useCallback(() => {
    if (!USE_MOCK_PRODUCTS) {
      return;
    }

    const latestProducts = getMockProducts();

    setMockProducts(latestProducts);
  }, []);

  /**
   * ==========================================================================
   * SOURCE OF TRUTH
   * ==========================================================================
   */

  const productList = USE_MOCK_PRODUCTS ? mockProducts : (products ?? []);

  /**
   * ==========================================================================
   * REFRESH WHEN SCREEN GETS FOCUS
   * ==========================================================================
   *
   * This handles:
   *
   * Products
   *    ↓
   * Edit Product
   *    ↓
   * Save Changes
   *    ↓
   * router.back()
   *    ↓
   * Products gets focus
   *    ↓
   * getMockProducts()
   *
   * Therefore changes to:
   *
   * - product name
   * - price
   * - stock
   * - active status
   * - image
   * - category
   * - description
   * - etc.
   *
   * are reflected immediately.
   */

  useFocusEffect(
    useCallback(() => {
      if (USE_MOCK_PRODUCTS) {
        refreshMockProducts();

        return;
      }

      /**
       * API mode.
       *
       * React Query remains the source of truth.
       */

      refetch();
    }, [refreshMockProducts, refetch])
  );

  /**
   * ==========================================================================
   * MUTATIONS
   * ==========================================================================
   */

  const deleteProductMutation = useDeleteProduct();

  const toggleStatusMutation = useToggleProductStatus();

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * SEARCH
   * ==========================================================================
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * ==========================================================================
   * INFINITE SCROLL
   * ==========================================================================
   */

  const PRODUCTS_PER_BATCH = 10;

  const [visibleProductCount, setVisibleProductCount] =
    useState(PRODUCTS_PER_BATCH);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * ==========================================================================
   * LOW STOCK
   * ==========================================================================
   */

  const [showLowStockBanner, setShowLowStockBanner] = useState(true);

  /**
   * ==========================================================================
   * REFRESH
   * ==========================================================================
   */

  async function onRefresh() {
    if (USE_MOCK_PRODUCTS) {
      refreshMockProducts();

      setVisibleProductCount(PRODUCTS_PER_BATCH);

      return;
    }

    await refetch();

    setVisibleProductCount(PRODUCTS_PER_BATCH);
  }

  /**
   * ==========================================================================
   * SORT PRODUCTS
   * ==========================================================================
   */

  const sortedProducts = useMemo(() => {
    return [...productList].sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
  }, [productList]);

  /**
   * ==========================================================================
   * SEARCH PRODUCTS
   * ==========================================================================
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
   * ==========================================================================
   * RESET INFINITE SCROLL WHEN SEARCH CHANGES
   * ==========================================================================
   */

  useEffect(() => {
    setVisibleProductCount(PRODUCTS_PER_BATCH);
  }, [searchQuery]);

  /**
   * ==========================================================================
   * KEEP VISIBLE COUNT VALID
   * ==========================================================================
   */

  useEffect(() => {
    setVisibleProductCount((currentCount) =>
      Math.min(
        currentCount,
        Math.max(PRODUCTS_PER_BATCH, filteredProducts.length)
      )
    );
  }, [filteredProducts.length]);

  /**
   * ==========================================================================
   * PRODUCTS TO DISPLAY
   * ==========================================================================
   */

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProductCount);
  }, [filteredProducts, visibleProductCount]);

  /**
   * ==========================================================================
   * HAS MORE PRODUCTS
   * ==========================================================================
   */

  const hasMoreProducts = displayedProducts.length < filteredProducts.length;

  /**
   * ==========================================================================
   * LOAD MORE PRODUCTS
   * ==========================================================================
   */

  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) {
      return;
    }

    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleProductCount((currentCount) =>
        Math.min(currentCount + PRODUCTS_PER_BATCH, filteredProducts.length)
      );

      setIsLoadingMore(false);
    }, 150);
  }, [isLoadingMore, hasMoreProducts, filteredProducts.length]);

  /**
   * ==========================================================================
   * LOW STOCK PRODUCTS
   * ==========================================================================
   */

  const lowStockProducts = useMemo(() => {
    return filteredProducts.filter(
      (product) => product.totalInStock <= product.lowStockAlert
    );
  }, [filteredProducts]);

  /**
   * ==========================================================================
   * SCREEN STATES
   * ==========================================================================
   *
   * State priority:
   *
   * 1. Initial loading
   * 2. First-time user
   * 3. Existing products + API error
   * 4. Existing products + no search results
   * 5. Product list
   *
   * A brand-new user should not see a technical error state simply because
   * their catalog is empty.
   */

  const hasProducts = productList.length > 0;

  const isFirstTimeUser =
    !isLoading && !hasProducts && searchQuery.trim() === "";

  const showProductError = !isLoading && !!error && hasProducts;

  const hasNoSearchResults =
    !isLoading &&
    !showProductError &&
    hasProducts &&
    searchQuery.trim() !== "" &&
    filteredProducts.length === 0;

  /**
   * ==========================================================================
   * TOGGLE PRODUCT
   * ==========================================================================
   */

  async function toggleProduct(productId: number, value: boolean) {
    try {
      await toggleStatusMutation.mutateAsync({
        productId,
        status: value,
      });

      /**
       * ======================================================================
       * MOCK MODE
       * ======================================================================
       *
       * toggleMockProductStatus() updates the shared repository.
       *
       * Read it again immediately.
       */

      if (USE_MOCK_PRODUCTS) {
        refreshMockProducts();
      } else {
        /**
         * API mode.
         */

        await refetch();
      }

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
   * ==========================================================================
   * DELETE PRODUCT
   * ==========================================================================
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
              await deleteProductMutation.mutateAsync(productId);

              /**
               * ==============================================================
               * MOCK MODE
               * ==============================================================
               */

              if (USE_MOCK_PRODUCTS) {
                refreshMockProducts();
              } else {
                /**
                 * API mode.
                 */

                await refetch();
              }

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
   * ==========================================================================
   * EDIT PRODUCT
   * ==========================================================================
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
   * ==========================================================================
   * HEADER SUBTITLE
   * ==========================================================================
   */

  const headerSubtitle = isLoading
    ? "Loading products..."
    : isFirstTimeUser
      ? "Add your first product to start building your catalog"
      : productList.length === 1
        ? "1 item in catalog"
        : `${productList.length} items in catalog`;

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
   */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
        paddingTop: insets.top,
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
          ================================================================= */}

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

              <AppText variant="bodySmall" color="secondary">
                {headerSubtitle}
              </AppText>
            </View>

            {/* ============================================================
                ADD PRODUCT
                Hidden for first-time users.
                The empty state provides the primary CTA instead.
            ============================================================= */}

            {!isFirstTimeUser && (
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
            )}
          </View>

          {/* ================================================================
              LOW STOCK BANNER
          ================================================================= */}

          {showLowStockBanner &&
            lowStockProducts.length > 0 &&
            !isLoading &&
            !showProductError &&
            !isFirstTimeUser && (
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
              Hidden for first-time users.
          ================================================================= */}

          {!isFirstTimeUser && hasProducts && !showProductError && (
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
          ================================================================= */}

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
              {/* ==========================================================
                  INITIAL LOADING
              =========================================================== */}

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
              ) : isFirstTimeUser ? (
                /* ==========================================================
                   FIRST-TIME USER
                =========================================================== */

                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  {/* PRODUCTS IMAGE */}

                  <Image
                    source={require("../../assets/images/default-products.png")}
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
                    No products yet
                  </AppText>

                  <AppText
                    variant="bodySmall"
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
              ) : showProductError ? (
                /* ==========================================================
                   EXISTING PRODUCTS + ERROR
                =========================================================== */

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
              ) : hasNoSearchResults ? (
                /* ==========================================================
                   SEARCH EMPTY STATE
                =========================================================== */

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
                =========================================================== */

                <FlatList
                  style={{
                    flex: 1,
                  }}
                  contentContainerStyle={{
                    paddingBottom: spacing.md,
                  }}
                  data={displayedProducts}
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
                  onEndReached={loadMoreProducts}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    hasMoreProducts || isLoadingMore ? (
                      <View
                        style={{
                          paddingVertical: spacing.lg,
                          alignItems: "center",
                        }}
                      >
                        {isLoadingMore && (
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
                              Loading more products...
                            </AppText>
                          </>
                        )}
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingVertical: spacing.lg,
                          alignItems: "center",
                        }}
                      >
                        <AppText variant="caption" color="muted">
                          You've reached the end of your products.
                        </AppText>
                      </View>
                    )
                  }
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
