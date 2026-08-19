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
 * ---------------------------------------------------------------------------
 * RIGHT SWIPE ACTIONS
 * ---------------------------------------------------------------------------
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

      <AppText color="inverse">Delete</AppText>
    </Pressable>
  );
}

/**
 * ---------------------------------------------------------------------------
 * PRODUCT CARD
 * ---------------------------------------------------------------------------
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
        {/* ---------------------------------------------------------------
            PRODUCT IMAGE
        --------------------------------------------------------------- */}

        <ProductImage image={product.productImages?.[0]?.url ?? ""} />

        {/* ---------------------------------------------------------------
            PRODUCT INFORMATION
        --------------------------------------------------------------- */}

        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyLargeBold">{product.productName}</AppText>

          <AppText variant="bodySmall" color="secondary">
            {product.totalInStock} in stock
          </AppText>

          <AppText variant="bodyBold" color="warning">
            {formatCurrency(product.unitPrice, {
              currency: product.currency as Currency,
            })}
          </AppText>
        </View>

        {/* ---------------------------------------------------------------
            PRODUCT ACTIONS
        --------------------------------------------------------------- */}

        <View
          style={{
            alignSelf: "stretch",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingVertical: spacing.xs,
          }}
        >
          {/* Edit */}

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

          {/* Active / Inactive */}

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
 * ---------------------------------------------------------------------------
 * PRODUCTS SCREEN
 * ---------------------------------------------------------------------------
 */

export default function ProductScreen() {
  /**
   * -------------------------------------------------------------------------
   * PRODUCTS
   * -------------------------------------------------------------------------
   */

  const { products, isLoading, isRefetching, error, refetch } = useProducts();

  /**
   * Keep the API result as the source of truth.
   */

  const productList = products ?? [];

  /**
   * -------------------------------------------------------------------------
   * MUTATIONS
   * -------------------------------------------------------------------------
   */

  const deleteProductMutation = useDeleteProduct();

  const toggleStatusMutation = useToggleProductStatus();

  const { showToast } = useToast();

  /**
   * -------------------------------------------------------------------------
   * SEARCH
   * -------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * -------------------------------------------------------------------------
   * PAGINATION
   * -------------------------------------------------------------------------
   */

  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 5;

  /**
   * -------------------------------------------------------------------------
   * LOW STOCK
   * -------------------------------------------------------------------------
   */

  const [showLowStockBanner, setShowLowStockBanner] = useState(true);

  /**
   * -------------------------------------------------------------------------
   * REFRESH
   * -------------------------------------------------------------------------
   */

  async function onRefresh() {
    await refetch();
  }

  /**
   * -------------------------------------------------------------------------
   * SORT PRODUCTS
   * -------------------------------------------------------------------------
   */

  const sortedProducts = useMemo(() => {
    return [...productList].sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
  }, [productList]);

  /**
   * -------------------------------------------------------------------------
   * SEARCH PRODUCTS
   * -------------------------------------------------------------------------
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
   * -------------------------------------------------------------------------
   * PAGINATED PRODUCTS
   * -------------------------------------------------------------------------
   */

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  /**
   * -------------------------------------------------------------------------
   * LOW STOCK PRODUCTS
   * -------------------------------------------------------------------------
   */

  const lowStockProducts = useMemo(() => {
    return filteredProducts.filter(
      (product) => product.totalInStock <= product.lowStockAlert
    );
  }, [filteredProducts]);

  /**
   * -------------------------------------------------------------------------
   * RESET PAGINATION WHEN SEARCH
   * CHANGES
   * -------------------------------------------------------------------------
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * -------------------------------------------------------------------------
   * LOW STOCK BANNER
   * -------------------------------------------------------------------------
   */

  useFocusEffect(
    useCallback(() => {
      if (lowStockProducts.length > 0) {
        setShowLowStockBanner(true);
      }
    }, [lowStockProducts.length])
  );

  /**
   * -------------------------------------------------------------------------
   * FIRST-TIME USER / ERROR STATES
   * -------------------------------------------------------------------------
   *
   * This follows the same architecture as Transactions and Customers.
   *
   * A merchant with no products should see the onboarding empty state.
   *
   * An API error is only presented as an actual error when products
   * already exist.
   * -------------------------------------------------------------------------
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
   * -------------------------------------------------------------------------
   * TOGGLE PRODUCT
   * -------------------------------------------------------------------------
   */

  async function toggleProduct(productId: number, value: boolean) {
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
   * -------------------------------------------------------------------------
   * DELETE PRODUCT
   * -------------------------------------------------------------------------
   */

  async function handleDelete(productId: number) {
    if (deleteProductMutation.isPending) {
      return;
    }

    Alert.alert(
      "Delete Product",
      "This product will be permanently removed and cannot be recovered.",
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
   * -------------------------------------------------------------------------
   * EDIT PRODUCT
   * -------------------------------------------------------------------------
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
   * -------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------
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
          {/* ---------------------------------------------------------------
              HEADER
          --------------------------------------------------------------- */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* Back Button */}

            {/* Title */}

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

            {/* Add Product */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add Product"
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
              })}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* ---------------------------------------------------------------
              LOW STOCK BANNER
          --------------------------------------------------------------- */}

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

          {/* ---------------------------------------------------------------
              SEARCH
          --------------------------------------------------------------- */}

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

          {/* ---------------------------------------------------------------
              PRODUCT CONTENT
          --------------------------------------------------------------- */}

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
              {/* -----------------------------------------------------------
                  INITIAL LOADING
              ----------------------------------------------------------- */}

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
                /* ---------------------------------------------------------
                    ERROR
                --------------------------------------------------------- */

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
              ) : isFirstTimeUser ? (
                /* ---------------------------------------------------------
                    FIRST-TIME USER
                --------------------------------------------------------- */

                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  {/* Icon */}

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

                  {/* Title */}

                  <AppText
                    variant="bodyLargeBold"
                    style={{
                      marginTop: spacing.md,
                      textAlign: "center",
                    }}
                  >
                    No products yet
                  </AppText>

                  {/* Description */}

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

                  {/* CTA */}

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
                /* ---------------------------------------------------------
                    SEARCH EMPTY STATE
                --------------------------------------------------------- */

                <Card
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  {/* Icon */}

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

                  {/* Title */}

                  <AppText
                    variant="bodyLargeBold"
                    style={{
                      marginTop: spacing.md,
                      textAlign: "center",
                    }}
                  >
                    No products found
                  </AppText>

                  {/* Description */}

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

                  {/* Clear */}

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
                /* ---------------------------------------------------------
                    PRODUCT LIST
                --------------------------------------------------------- */

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

            {/* -------------------------------------------------------------
                PAGINATION
            ------------------------------------------------------------- */}

            {!isLoading &&
              !showProductError &&
              hasProducts &&
              filteredProducts.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: spacing.md,
                    paddingBottom: spacing.md,
                  }}
                >
                  {/* Previous */}

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Button
                      title="Previous"
                      variant="secondary"
                      disabled={currentPage === 1}
                      onPress={() => setCurrentPage((page) => page - 1)}
                    />
                  </View>

                  {/* Page */}

                  <AppText
                    variant="bodyBold"
                    style={{
                      marginHorizontal: spacing.md,
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </AppText>

                  {/* Next */}

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Button
                      title="Next"
                      variant="primary"
                      disabled={currentPage === totalPages}
                      onPress={() => setCurrentPage((page) => page + 1)}
                    />
                  </View>
                </View>
              )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// import { router, useFocusEffect } from "expo-router";

// import {
//   View,
//   Switch,
//   FlatList,
//   ActivityIndicator,
//   RefreshControl,
//   Pressable,
//   Alert,
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// import { StatusBar } from "expo-status-bar";

// import { AppText } from "@/components/ui/AppText";
// import { Button } from "@/components/ui/Button";

// import { radius, spacing, theme } from "@/theme";

// import { Card } from "@/components/ui/Card";

// import { Ionicons } from "@expo/vector-icons";

// import { SearchBar } from "@/components/ui/SearchBar";

// import { ROUTES } from "@/navigation/routes";

// import { useCallback, useEffect, useMemo, useState } from "react";

// import { useProducts } from "@/hooks/products/useProducts";

// import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";

// import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

// import { formatCurrency } from "@/utils/formatters/currency";

// import { ProductImage } from "@/components/ui/ProductImage";

// import { useToggleProductStatus } from "@/hooks/products/useToggleProductStatus";

// import type { MerchantProduct } from "@/types/product";

// import { Currency } from "@/types/currency";

// import { useToast } from "@/hooks/useToast";

// function RightActions({ onDelete }: { onDelete: () => void }) {
//   return (
//     <Pressable
//       onPress={onDelete}
//       style={{
//         width: 90,
//         marginLeft: spacing.sm,

//         justifyContent: "center",
//         alignItems: "center",

//         backgroundColor: theme.action.primary.delete,

//         borderRadius: radius.md,
//       }}
//     >
//       <Ionicons
//         name="trash-outline"
//         size={24}
//         color={theme.text.inverse}
//       />

//       <AppText color="inverse">
//         Delete
//       </AppText>
//     </Pressable>
//   );
// }

// function ProductCard({
//   product,
//   onToggle,
//   onDelete,
//   onEdit,
//   deleting,
//   toggling,
// }: {
//   product: MerchantProduct;
//   onToggle: (productId: number, value: boolean) => void;
//   onDelete: (productId: number) => void;
//   deleting: boolean;
//   toggling: boolean;
//   onEdit: (productId: number) => void;
// }) {
//   return (
//     <Swipeable
//       enabled={!deleting}
//       renderRightActions={() => (
//         <RightActions
//           onDelete={() => onDelete(product.id)}
//         />
//       )}
//     >
//       <Card
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           gap: spacing.md,

//           borderWidth: 1,
//           borderColor: theme.border.default,
//         }}
//       >
//         <ProductImage
//           image={product.productImages?.[0]?.url ?? ""}
//         />

//         <View
//           style={{
//             flex: 1,
//             gap: spacing.xs,
//           }}
//         >
//           <AppText variant="bodyLargeBold">
//             {product.productName}
//           </AppText>

//           <AppText
//             variant="bodySmall"
//             color="secondary"
//           >
//             {product.totalInStock} in stock
//           </AppText>

//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               gap: spacing.xs,
//             }}
//           >
//             <AppText
//               variant="bodyBold"
//               color="warning"
//             >
//               {formatCurrency(product.unitPrice, {
//                 currency: product.currency as Currency,
//               })}
//             </AppText>
//           </View>
//         </View>

//         <View
//           style={{
//             alignSelf: "stretch",
//             alignItems: "flex-end",
//             justifyContent: "space-between",
//             paddingVertical: spacing.xs,
//           }}
//         >
//           <Pressable
//             disabled={deleting || toggling}
//             onPress={() => onEdit(product.id)}
//             hitSlop={12}
//           >
//             <Ionicons
//               name="create-outline"
//               size={24}
//               color={theme.icon.default.icon}
//             />
//           </Pressable>

//           <Switch
//             disabled={deleting}
//             value={product.isActive}
//             onValueChange={(value) =>
//               onToggle(product.id, value)
//             }
//           />
//         </View>
//       </Card>
//     </Swipeable>
//   );
// }

// export default function ProductScreen() {
//   const {
//     products,
//     isLoading: loading,
//     isRefetching: refreshing,
//     error,
//     refetch,
//   } = useProducts();

//   const deleteProductMutation =
//     useDeleteProduct();

//   const toggleStatusMutation =
//     useToggleProductStatus();

//   const { showToast } = useToast();

//   const [searchQuery, setSearchQuery] =
//     useState("");

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   const [showLowStockBanner, setShowLowStockBanner] =
//     useState(true);

//   const PRODUCTS_PER_PAGE = 5;

//   async function onRefresh() {
//     await refetch();
//   }

//   const sortedProducts = useMemo(() => {
//     return [...products].sort((a, b) =>
//       a.productName.localeCompare(b.productName)
//     );
//   }, [products]);

//   const filteredProducts = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();

//     if (!query) {
//       return sortedProducts;
//     }

//     return sortedProducts.filter((product) =>
//       product.productName
//         .toLowerCase()
//         .includes(query)
//     );
//   }, [sortedProducts, searchQuery]);

//   const startIndex =
//     (currentPage - 1) * PRODUCTS_PER_PAGE;

//   const endIndex =
//     startIndex + PRODUCTS_PER_PAGE;

//   const paginatedProducts =
//     filteredProducts.slice(
//       startIndex,
//       endIndex
//     );

//   const totalPages = Math.max(
//     1,
//     Math.ceil(
//       filteredProducts.length /
//         PRODUCTS_PER_PAGE
//     )
//   );

//   const lowStockProducts = useMemo(() => {
//     return filteredProducts.filter(
//       (product) =>
//         product.totalInStock <=
//         product.lowStockAlert
//     );
//   }, [filteredProducts]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   useFocusEffect(
//     useCallback(() => {
//       if (lowStockProducts.length > 0) {
//         setShowLowStockBanner(true);
//       }
//     }, [lowStockProducts.length])
//   );

//   async function toggleProduct(
//     productId: number,
//     value: boolean
//   ) {
//     try {
//       await toggleStatusMutation.mutateAsync({
//         productId,
//         status: value,
//       });

//       showToast({
//         type: "success",
//         title: "Product Updated",
//         message: value
//           ? "Product is now active."
//           : "Product has been hidden.",
//       });
//     } catch (error) {
//       console.log(
//         "UPDATE STATUS ERROR",
//         error
//       );

//       showToast({
//         type: "error",
//         title: "Update Failed",
//         message:
//           "Unable to update product status.",
//       });
//     }
//   }

//   async function handleDelete(
//     productId: number
//   ) {
//     if (deleteProductMutation.isPending) {
//       return;
//     }

//     Alert.alert(
//       "Delete Product",
//       "This product will be permanently removed and cannot be recovered.",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await deleteProductMutation.mutateAsync(
//                 productId
//               );

//               showToast({
//                 type: "success",
//                 title: "Product Deleted",
//                 message:
//                   "The product has been removed successfully.",
//               });
//             } catch (error) {
//               console.log(
//                 "DELETE ERROR",
//                 error
//               );

//               showToast({
//                 type: "error",
//                 title: "Delete Failed",
//                 message:
//                   "Unable to delete this product. Please try again.",
//               });
//             }
//           },
//         },
//       ]
//     );
//   }

//   function handleEdit(productId: number) {
//     router.push({
//       pathname: "/product/[id]",
//       params: {
//         id: String(productId),
//       },
//     });
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor:
//           theme.background.primary,
//       }}
//     >
//       <StatusBar style="auto" />

//       <View
//         style={{
//           flex: 1,
//           paddingHorizontal: spacing.lg,
//         }}
//       >
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "space-between",
//           }}
//         >
//           {/* HEADER */}

//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent:
//                 "space-between",
//               alignItems: "center",
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 gap: spacing.xs,
//               }}
//             >
//               <AppText variant="h1">
//                 Products
//               </AppText>

//               <AppText
//                 variant="body"
//                 color="secondary"
//               >
//                 {products.length === 0
//                   ? "Start building your product catalog"
//                   : products.length === 1
//                     ? "1 item in catalog"
//                     : `${products.length} items in catalog`}
//               </AppText>
//             </View>

//             {/* ADD PRODUCT */}

//             <Pressable
//               accessibilityRole="button"
//               accessibilityLabel="Add Product"
//               onPress={() =>
//                 router.push(
//                   ROUTES.ADD_PRODUCT_INFO
//                 )
//               }
//               style={({ pressed }) => ({
//                 width: 44,
//                 height: 44,

//                 borderRadius: radius.full,

//                 justifyContent: "center",
//                 alignItems: "center",

//                 backgroundColor: pressed
//                   ? theme.action.primary
//                       .pressed
//                   : theme.action.primary
//                       .background,
//               })}
//             >
//               <Ionicons
//                 name="add"
//                 size={24}
//                 color={
//                   theme.action.primary.text
//                 }
//               />
//             </Pressable>
//           </View>

//           {/* LOW STOCK BANNER */}

//           {showLowStockBanner &&
//             lowStockProducts.length > 0 && (
//               <Card
//                 style={{
//                   marginTop: spacing.md,
//                   flexDirection: "row",
//                   alignItems: "center",

//                   borderColor:
//                     theme.border.warning,
//                   backgroundColor:
//                     theme.background.warning,
//                 }}
//               >
//                 <Ionicons
//                   name="warning-outline"
//                   size={22}
//                   color={
//                     theme.icon.warning.icon
//                   }
//                 />

//                 <View
//                   style={{
//                     flex: 1,
//                     marginHorizontal:
//                       spacing.md,
//                   }}
//                 >
//                   <AppText
//                     variant="bodyBold"
//                     color="primary"
//                   >
//                     {lowStockProducts.length}{" "}
//                     {lowStockProducts.length ===
//                     1
//                       ? "product is"
//                       : "products are"}{" "}
//                     running low
//                   </AppText>

//                   <AppText
//                     variant="bodySmall"
//                     color="secondary"
//                   >
//                     Restock soon to avoid
//                     missing sales.
//                   </AppText>
//                 </View>

//                 <Pressable
//                   hitSlop={10}
//                   onPress={() =>
//                     setShowLowStockBanner(
//                       false
//                     )
//                   }
//                 >
//                   <Ionicons
//                     name="close"
//                     size={20}
//                     color={
//                       theme.icon.default.icon
//                     }
//                   />
//                 </Pressable>
//               </Card>
//             )}

//           {/* SEARCH */}

//           {products.length > 0 && (
//             <View
//               style={{
//                 marginTop: spacing.md,
//               }}
//             >
//               <SearchBar
//                 placeholder="Search products"
//                 value={searchQuery}
//                 onChangeText={
//                   setSearchQuery
//                 }
//               />
//             </View>
//           )}

//           {/* ERROR */}

//           {error && (
//             <Card
//               style={{
//                 marginTop: spacing.md,
//                 borderColor:
//                   theme.border.error,
//                 borderWidth: 1,
//               }}
//             >
//               <AppText color="error">
//                 Unable to load products.
//               </AppText>
//             </Card>
//           )}

//           {/* CONTENT */}

//           <View
//             style={{
//               flex: 1,
//               marginTop: spacing.lg,
//             }}
//           >
//             {/* LOADING */}

//             {loading ? (
//               <Card
//                 style={{
//                   alignItems: "center",
//                   paddingVertical:
//                     spacing.xl,
//                 }}
//               >
//                 <ActivityIndicator
//                   size="large"
//                   color={
//                     theme.icon.branding.icon
//                   }
//                 />

//                 <AppText
//                   style={{
//                     marginTop:
//                       spacing.md,
//                   }}
//                 >
//                   Loading products...
//                 </AppText>
//               </Card>
//             ) : products.length === 0 ? (
//               /* FIRST-TIME EMPTY STATE */

//               <Card
//                 style={{
//                   alignItems: "center",
//                   paddingVertical:
//                     spacing.xl,
//                   paddingHorizontal:
//                     spacing.lg,
//                 }}
//               >
//                 {/* ICON */}

//                 <View
//                   style={{
//                     width: 56,
//                     height: 56,
//                     borderRadius:
//                       radius.full,
//                     backgroundColor:
//                       theme.icon.default
//                         .background,
//                     alignItems: "center",
//                     justifyContent:
//                       "center",
//                   }}
//                 >
//                   <Ionicons
//                     name="cube-outline"
//                     size={28}
//                     color={
//                       theme.icon.default.icon
//                     }
//                   />
//                 </View>

//                 {/* TITLE */}

//                 <AppText
//                   variant="bodyLargeBold"
//                   style={{
//                     marginTop:
//                       spacing.md,
//                     textAlign: "center",
//                   }}
//                 >
//                   No products yet
//                 </AppText>

//                 {/* DESCRIPTION */}

//                 <AppText
//                   variant="body"
//                   color="secondary"
//                   style={{
//                     marginTop:
//                       spacing.xs,
//                     textAlign: "center",
//                   }}
//                 >
//                   Add your first product to
//                   start selling.
//                 </AppText>

//                 {/* CTA */}

//                 <Button
//                   title="Add Product"
//                   variant="primary"
//                   style={{
//                     marginTop:
//                       spacing.md,
//                   }}
//                   onPress={() =>
//                     router.push(
//                       ROUTES.ADD_PRODUCT_INFO
//                     )
//                   }
//                 />
//               </Card>
//             ) : filteredProducts.length ===
//               0 ? (
//               /* SEARCH EMPTY STATE */

//               <Card
//                 style={{
//                   alignItems: "center",
//                   paddingVertical:
//                     spacing.xl,
//                   paddingHorizontal:
//                     spacing.lg,
//                 }}
//               >
//                 {/* ICON */}

//                 <View
//                   style={{
//                     width: 56,
//                     height: 56,
//                     borderRadius:
//                       radius.full,
//                     backgroundColor:
//                       theme.icon.default
//                         .background,
//                     alignItems: "center",
//                     justifyContent:
//                       "center",
//                   }}
//                 >
//                   <Ionicons
//                     name="search-outline"
//                     size={28}
//                     color={
//                       theme.icon.default.icon
//                     }
//                   />
//                 </View>

//                 {/* TITLE */}

//                 <AppText
//                   variant="bodyLargeBold"
//                   style={{
//                     marginTop:
//                       spacing.md,
//                     textAlign: "center",
//                   }}
//                 >
//                   No products found
//                 </AppText>

//                 {/* DESCRIPTION */}

//                 <AppText
//                   variant="body"
//                   color="secondary"
//                   style={{
//                     marginTop:
//                       spacing.xs,
//                     textAlign: "center",
//                   }}
//                 >
//                   Try searching with a
//                   different product name.
//                 </AppText>
//               </Card>
//             ) : (
//               /* PRODUCT LIST */

//               <FlatList
//                 style={{
//                   flex: 1,
//                 }}
//                 contentContainerStyle={{
//                   paddingBottom:
//                     spacing.md,
//                 }}
//                 data={paginatedProducts}
//                 refreshControl={
//                   <RefreshControl
//                     refreshing={refreshing}
//                     onRefresh={onRefresh}
//                   />
//                 }
//                 showsVerticalScrollIndicator={
//                   false
//                 }
//                 keyExtractor={(item) =>
//                   item.id.toString()
//                 }
//                 renderItem={({ item }) => (
//                   <ProductCard
//                     product={item}
//                     deleting={
//                       deleteProductMutation.isPending
//                     }
//                     toggling={
//                       toggleStatusMutation.isPending
//                     }
//                     onToggle={
//                       toggleProduct
//                     }
//                     onDelete={
//                       handleDelete
//                     }
//                     onEdit={handleEdit}
//                   />
//                 )}
//                 ItemSeparatorComponent={() => (
//                   <View
//                     style={{
//                       height:
//                         spacing.md,
//                     }}
//                   />
//                 )}
//               />
//             )}
//           </View>

//           {/* PAGINATION */}

//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginTop: spacing.lg,
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//               }}
//             >
//               <Button
//                 title="Previous"
//                 variant="secondary"
//                 disabled={
//                   currentPage === 1
//                 }
//                 onPress={() =>
//                   setCurrentPage(
//                     (page) => page - 1
//                   )
//                 }
//               />
//             </View>

//             <AppText
//               variant="bodyBold"
//               style={{
//                 marginHorizontal:
//                   spacing.md,
//               }}
//             >
//               Page {currentPage} of{" "}
//               {totalPages}
//             </AppText>

//             <View
//               style={{
//                 flex: 1,
//               }}
//             >
//               <Button
//                 title="Next"
//                 variant="primary"
//                 disabled={
//                   currentPage ===
//                   totalPages
//                 }
//                 onPress={() =>
//                   setCurrentPage(
//                     (page) => page + 1
//                   )
//                 }
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }
