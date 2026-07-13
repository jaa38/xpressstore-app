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
import { useEffect, useMemo, useState } from "react";
import { useProducts } from "@/hooks/useProducts";

import { useToggleProductVisibility } from "@/hooks/useToggleProductVisibility";

import { useDeleteProduct } from "@/hooks/useDeleteProduct";

import type { Product } from "@/types/product";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { formatCurrency } from "@/utils/formatCurrency";

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
  product: Product;
  onToggle: (productId: string, value: boolean) => void;
  onDelete: (productId: string) => void;
  onEdit: (productId: string) => void;
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
        <Image
          source={
            product.image?.trim()
              ? { uri: product.image }
              : require("../../assets/images/ankara-tote-bag.png")
          }
          resizeMode="cover"
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.xs,
          }}
        />

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
            {product.stock} in stock
          </AppText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold" color="warning">
              {formatCurrency(product.price, product.currency)}
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
            value={product.visible}
            onValueChange={(value) => onToggle(product.id, value)}
          />
        </View>
      </Card>
    </Swipeable>
  );
}

export default function ProductScreen() {
  const {
    data: products = [],
    isLoading: loading,
    isRefetching: refreshing,
    error,
    refetch,
  } = useProducts();

  const deleteProductMutation = useDeleteProduct();

  const toggleVisibilityMutation = useToggleProductVisibility();

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 1;

  async function onRefresh() {
    await refetch();
  }

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => a.productName.localeCompare(b.productName)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sortedProducts;
    }

    return sortedProducts.filter((product) => {
      return (
        product.productName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [sortedProducts, searchQuery]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const lowStockProducts = useMemo(
    () =>
      filteredProducts.filter(
        (product) => product.stock <= product.lowStockAlert
      ),
    [filteredProducts]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  async function toggleProduct(productId: string, value: boolean) {
    try {
      await toggleVisibilityMutation.mutateAsync({
        productId,
        value,
      });
    } catch (error) {
      console.log("UPDATE VISIBILITY ERROR", error);
    }
  }

  async function handleDelete(productId: string) {
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
          }
        },
      },
    ]);
  }

  function handleEdit(productId: string) {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: productId,
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
          paddingTop: spacing.md,
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
              gap: spacing.lg,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
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

            <Button
              title="Add Product"
              variant="primary"
              onPress={() => router.push(ROUTES.ADD_PRODUCT_INFO)}
            />
          </View>

          {products.length > 0 && (
            <Card
              style={{
                marginTop: spacing.md,
                borderColor: theme.border.warning,
                backgroundColor: theme.background.warning,
                flexDirection: "row",
                gap: spacing.md,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.icon.warning.icon}
              />

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <AppText variant="bodyBold" color="primary">
                  {lowStockProducts.length} product(s)
                </AppText>

                <AppText variant="body" color="primary">
                  {" "}
                  are running low on stock
                </AppText>
              </View>
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
                keyExtractor={(item) => item.id}
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
