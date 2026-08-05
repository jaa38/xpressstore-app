import { router, useFocusEffect } from "expo-router";
import {
  View,
  Image,
  Switch,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { radius, spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@/components/ui/SearchBar";
import { ROUTES, getProductDetailsRoute } from "@/navigation/routes";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useProducts } from "@/hooks/products/useProducts";

import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { formatCurrency } from "@/utils/formatters/currency";

import { ProductImage } from "@/components/ui/ProductImage";

import { useToggleProductStatus } from "@/hooks/products/useToggleProductStatus";

import type { MerchantProduct } from "@/types/product";
import { Currency } from "@/types/currency";

function RightActions({ onDelete }: { onDelete: () => void }) {
  return (
    <Pressable
      onPress={onDelete}
      style={{
        width: 90,
        marginLeft: spacing.sm,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: theme.action.primary.delete,

        borderRadius: radius.md,
      }}
    >
      <Ionicons name="trash-outline" size={24} color="white" />

      <AppText color="inverse">Delete</AppText>
    </Pressable>
  );
}

function ProductCard({
  product,
  onToggle,
  onDelete,
  onEdit,
}: {
  product: MerchantProduct;
  onToggle: (productId: number, value: boolean) => void;
  onDelete: (productId: number) => void;
  onEdit: (productId: number) => void;
}) {
  return (
    <Swipeable
      renderRightActions={() => (
        <RightActions onDelete={() => onDelete(product.id)} />
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
        <ProductImage image={product.productImages?.[0]?.url ?? ""} />

        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyLargeBold">{product.productName}</AppText>

          {/* <AppText variant="bodySmall" color="secondary">
            {product.category}
          </AppText> */}

          <AppText variant="bodySmall" color="secondary">
            {product.totalInStock} in stock
          </AppText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold" color="warning">
              {formatCurrency(product.unitPrice, {
                currency: product.currency as Currency,
              })}
            </AppText>

            {/* <AppText>•</AppText> */}

            {/* <AppText variant="bodySmall" color="secondary">
              {product.stock} in stock
            </AppText> */}
          </View>
        </View>
        <View
          style={{
            alignSelf: "stretch",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingVertical: spacing.xs,
          }}
        >
          <Pressable onPress={() => onEdit(product.id)} hitSlop={12}>
            <Ionicons
              name="create-outline"
              size={24}
              color={theme.icon.default.icon}
            />
          </Pressable>

          <Switch
            value={product.isActive}
            onValueChange={(value) => onToggle(product.id, value)}
          />
        </View>
      </Card>
    </Swipeable>
  );
}

export default function ProductScreen() {
  const {
    products,
    isLoading: loading,
    isRefetching: refreshing,
    error,
    refetch,
  } = useProducts();

  const deleteProductMutation = useDeleteProduct();

  const toggleStatusMutation = useToggleProductStatus();

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [showLowStockBanner, setShowLowStockBanner] = useState(true);

  const PRODUCTS_PER_PAGE = 5;

  const LOW_STOCK_THRESHOLD = 5;

  async function onRefresh() {
    await refetch();
  }

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sortedProducts;
    }

    return sortedProducts.filter((product) =>
      product.productName.toLowerCase().includes(query)
    );
  }, [sortedProducts, searchQuery]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const lowStockProducts = useMemo(() => {
    return filteredProducts.filter(
      (product) => product.totalInStock <= product.lowStockAlert
    );
  }, [filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      if (lowStockProducts.length > 0) {
        setShowLowStockBanner(true);
      }
    }, [lowStockProducts.length])
  );

  async function toggleProduct(productId: number, value: boolean) {
    try {
      await toggleStatusMutation.mutateAsync({
        productId,
        status: value,
      });
    } catch (error) {
      console.log("UPDATE STATUS ERROR", error);
    }
  }

  async function handleDelete(productId: number) {
    Alert.alert("Delete Product", "This product will be permanently removed.", [
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
          } catch (error) {
            console.log("DELETE ERROR", error);

            Alert.alert(
              "Delete Failed",
              "Unable to delete this product. Please try again."
            );
          }
        },
      },
    ]);
  }

  function handleEdit(productId: number) {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: String(productId),
      },
    });
  }

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
          // paddingTop: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* TOP */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
                {products.length === 1
                  ? "1 item in catalog"
                  : `${products.length} items in catalog`}
              </AppText>
            </View>

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

          {showLowStockBanner && lowStockProducts.length > 0 && (
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

          {products.length > 0 && (
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

          {error && (
            <Card
              style={{
                marginTop: spacing.md,
                borderColor: theme.border.error,
                borderWidth: 1,
              }}
            >
              <AppText color="error">Unable to load products.</AppText>
            </Card>
          )}

          <View
            style={{
              flex: 1,
              marginTop: spacing.lg,
            }}
          >
            {loading ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={theme.icon.branding.icon}
                />

                <AppText
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  Loading products...
                </AppText>
              </Card>
            ) : products.length === 0 ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <Ionicons
                  name="cube-outline"
                  size={48}
                  color={theme.icon.branding.icon}
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.sm,
                  }}
                >
                  No Products Yet
                </AppText>

                <AppText
                  color="secondary"
                  style={{
                    textAlign: "center",
                    marginTop: spacing.xs,
                  }}
                >
                  Add your first product to start selling.
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
            ) : filteredProducts.length === 0 ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={theme.icon.branding.icon}
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.sm,
                  }}
                >
                  No Products Found
                </AppText>

                <AppText
                  color="secondary"
                  style={{
                    textAlign: "center",
                    marginTop: spacing.xs,
                  }}
                >
                  Try searching with a different product name or category.
                </AppText>
              </Card>
            ) : (
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
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                // scrollEnabled
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: spacing.lg,
            }}
          >
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
            <AppText
              variant="bodyBold"
              style={{
                marginHorizontal: spacing.md,
              }}
            >
              Page {currentPage} of {totalPages}
            </AppText>
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
        </View>
      </View>
    </SafeAreaView>
  );
}
