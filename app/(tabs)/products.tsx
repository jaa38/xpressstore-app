import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  ScrollView,
  Image,
  Switch,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { radius, spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@/components/ui/SearchBar";
import { ROUTES } from "@/navigation/routes";

import { useMemo, useState, useEffect } from "react";

import {
  getProducts,
  updateProductVisibility,
} from "@/services/product-service";

import type { Product } from "@/types/product";

function ProductCard({
  product,
  onToggle,
}: {
  product: Product;

  onToggle: (productId: string, value: boolean) => void;
}) {
  return (
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

        <AppText variant="bodySmall" color="secondary">
          {product.category}
        </AppText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyBold" color="warning">
            ₦{product.price.toLocaleString()}
          </AppText>

          <AppText>•</AppText>

          <AppText variant="bodySmall" color="secondary">
            {product.stock} in stock
          </AppText>
        </View>
      </View>

      <Switch
        value={product.visible}
        onValueChange={(value) => onToggle(product.id, value)}
        style={{ alignSelf: "center" }}
      />
    </Card>
  );
}

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const { refresh } = useLocalSearchParams();

  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);

      setError("");

      const data = await getProducts();

      console.log("SUPABASE PRODUCTS", data);

      setProducts(data ?? []);
    } catch (error) {
      console.log("LOAD PRODUCTS ERROR", error);

      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    try {
      setRefreshing(true);

      await loadProducts();
    } catch (error) {
      console.log("REFRESH ERROR", error);
    } finally {
      setRefreshing(false);
    }
  }

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => a.productName.localeCompare(b.productName)),
    [products]
  );

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= product.lowStockAlert),
    [products]
  );

  async function toggleProduct(productId: string, value: boolean) {
    try {
      await updateProductVisibility(productId, value);

      setProducts((current) =>
        current.map((product) =>
          product.id === productId
            ? {
                ...product,
                visible: value,
              }
            : product
        )
      );
    } catch (error) {
      console.log("UPDATE VISIBILITY ERROR", error);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <ScrollView
        style={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
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
              <SearchBar placeholder="Search products" />
            </View>
          )}

          {error ? (
            <Card
              style={{
                marginTop: spacing.md,
                borderColor: theme.border.error,
                borderWidth: 1,
              }}
            >
              <AppText color="error">{error}</AppText>
            </Card>
          ) : null}

          <View
            style={{
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
            ) : (
              <FlatList
                data={sortedProducts}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ProductCard product={item} onToggle={toggleProduct} />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
