import { useMemo, useState } from "react";

import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";

import { AddStoreHeader } from "@/components/stores/AddStoreHeader";
import { AddStoreFooter } from "@/components/stores/AddStoreFooter";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme } from "@/theme";

import { useStoreDraft } from "@/hooks/store/useStoreDraft";

import { useProducts } from "@/hooks/products/useProducts";

import { formatCurrency } from "@/utils/formatters/currency";

import type { Currency } from "@/types/currency";
import type { MerchantProduct } from "@/types/product";

/**
 * ============================================================================
 * Product Card
 * ============================================================================
 */

function StoreProductCard({
  product,
  selected,
  onPress,
}: {
  product: MerchantProduct;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${
        selected ? "Remove" : "Add"
      } ${product.productName} ${selected ? "from" : "to"} storefront`}
      accessibilityState={{
        selected,
      }}
      onPress={onPress}
    >
      <Card
        style={{
          borderWidth: 1,
          borderColor: selected ? theme.border.brand : theme.border.default,
          backgroundColor: selected
            ? theme.background.brand
            : theme.background.surface,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {/* Product image */}

          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: theme.background.subtle,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="cube-outline"
              size={24}
              color={theme.icon.default.icon}
            />
          </View>

          {/* Product information */}

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

          {/* Selection */}

          <Ionicons
            name={selected ? "checkmark-circle" : "ellipse-outline"}
            size={26}
            color={selected ? theme.icon.success.icon : theme.icon.default.icon}
          />
        </View>
      </Card>
    </Pressable>
  );
}

/**
 * ============================================================================
 * Storefront Screen
 * ============================================================================
 */

export default function StorefrontScreen() {
  const { store, updateStore } = useStoreDraft();

  const { products, isLoading, isRefetching, error, refetch } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * --------------------------------------------------------------------------
   * Active products
   * --------------------------------------------------------------------------
   *
   * Only active products are available for selection.
   * --------------------------------------------------------------------------
   */

  const availableProducts = useMemo(() => {
    return products.filter((product) => product.isActive);
  }, [products]);

  /**
   * --------------------------------------------------------------------------
   * Search
   * --------------------------------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return availableProducts;
    }

    return availableProducts.filter((product) =>
      product.productName.toLowerCase().includes(query)
    );
  }, [availableProducts, searchQuery]);

  /**
   * --------------------------------------------------------------------------
   * Product selection
   * --------------------------------------------------------------------------
   */

  function toggleProduct(productId: number) {
    const isSelected = store.storeProducts.includes(productId);

    const updatedProductIds = isSelected
      ? store.storeProducts.filter((id) => id !== productId)
      : [...store.storeProducts, productId];

    updateStore({
      storeProducts: updatedProductIds,
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Continue
   * --------------------------------------------------------------------------
   */

  function handleNext() {
    router.push(ROUTES.ADD_STORE_SETTINGS);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Draft
   * --------------------------------------------------------------------------
   *
   * The selected products are already persisted in the Zustand store through
   * updateStore().
   *
   * Explicitly replace the current route with the Store screen so the user
   * does not remain inside the creation wizard when using "Save as Draft".
   * --------------------------------------------------------------------------
   */

  function handleSaveDraft() {
    router.replace(ROUTES.STORE);
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
      edges={["top"]}
    >
      <AddStoreHeader
        title="Create Storefront"
        step={2}
        totalSteps={4}
        progress={50}
        label="Storefront"
      />

      <Divider />

      <View
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro */}

          <AppText variant="body" color="secondary">
            Choose the products you want customers to see and purchase from this
            storefront.
          </AppText>

          {/* Product section */}

          <View
            style={{
              marginTop: spacing.lg,
              gap: spacing.md,
            }}
          >
            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h3" color="primary">
                Store Products
              </AppText>

              <AppText color="secondary">
                Select one or more products for this storefront.
              </AppText>
            </View>

            {/* Selected count */}

            <Card>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <Ionicons
                  name="cube-outline"
                  size={20}
                  color={theme.icon.branding.icon}
                />

                <AppText variant="bodyBold">
                  {store.storeProducts.length}{" "}
                  {store.storeProducts.length === 1 ? "product" : "products"}{" "}
                  selected
                </AppText>
              </View>
            </Card>

            {/* Search */}

            {!isLoading && !error && availableProducts.length > 0 && (
              <Input
                placeholder="Search products"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            )}

            {/* Loading */}

            {isLoading ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
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
            ) : error ? (
              /* Error */

              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={32}
                  color={theme.icon.error.icon}
                />

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
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  We couldn't load your products. Please try again.
                </AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Try again"
                  disabled={isRefetching}
                  onPress={() => refetch()}
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  <AppText color="link">Try Again</AppText>
                </Pressable>
              </Card>
            ) : availableProducts.length === 0 ? (
              /* No products */

              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <Ionicons
                  name="cube-outline"
                  size={32}
                  color={theme.icon.default.icon}
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                    textAlign: "center",
                  }}
                >
                  No products available
                </AppText>

                <AppText
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  Create and activate products before adding them to your
                  storefront.
                </AppText>
              </Card>
            ) : filteredProducts.length === 0 ? (
              /* Search empty */

              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={32}
                  color={theme.icon.default.icon}
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  No products found
                </AppText>

                <AppText
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
              /* Products */

              <View
                style={{
                  gap: spacing.sm,
                }}
              >
                {filteredProducts.map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                    selected={store.storeProducts.includes(product.id)}
                    onPress={() => toggleProduct(product.id)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <Divider />

        <AddStoreFooter
          primaryLabel="Next"
          secondaryLabel="Save as Draft"
          onPrimary={handleNext}
          onSecondary={handleSaveDraft}
        />
      </View>
    </SafeAreaView>
  );
}
