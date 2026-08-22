import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { useMemo, useState } from "react";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

import { useStores } from "@/hooks/store/useStores";
import { useProducts } from "@/hooks/products/useProducts";
import { useAddProductToStore } from "@/hooks/products/useAddProductToStore";

import type { MerchantProduct } from "@/types/product";

/**
 * ============================================================================
 * PRODUCT ROW
 * ============================================================================
 */

function ProductRow({
  product,
  selected,
  onPress,
}: {
  product: MerchantProduct;
  selected: boolean;
  onPress: () => void;
}) {
  /**
   * --------------------------------------------------------------------------
   * PRODUCT DATA
   * --------------------------------------------------------------------------
   */

  const productName = product.productName || "Unnamed Product";

  const productReference = product.productReference || "Product";

  /**
   * First product image.
   *
   * If the product does not have an image URL, the cube icon will be displayed
   * as the fallback.
   */
  const productImage = product.productImages?.[0]?.url?.trim();

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
   */

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: selected,
      }}
      accessibilityLabel={`${productName}. ${
        selected ? "Selected" : "Not selected"
      }`}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingVertical: spacing.md,
        }}
      >
        {/* ==================================================================
            PRODUCT IMAGE
        ================================================================== */}

        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.md,
            overflow: "hidden",
            backgroundColor: theme.background.subtle,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {productImage ? (
            <Image
              source={{
                uri: productImage,
              }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <Ionicons
              name="cube-outline"
              size={28}
              color={theme.icon.default.icon}
            />
          )}
        </View>

        {/* ==================================================================
            PRODUCT INFORMATION
        ================================================================== */}

        <View
          style={{
            flex: 1,
            minWidth: 0,
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyBold" numberOfLines={1}>
            {productName}
          </AppText>

          <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
            {productReference}
          </AppText>

          <AppText variant="bodySmall" color="secondary">
            {product.currency} {product.unitPrice.toLocaleString()}
          </AppText>
        </View>

        {/* ==================================================================
            CHECKBOX
        ================================================================== */}

        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: radius.sm,
            borderWidth: 2,
            borderColor: selected
              ? theme.button.primary.background
              : theme.border.default,
            backgroundColor: selected
              ? theme.button.primary.background
              : theme.background.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selected && (
            <Ionicons
              name="checkmark"
              size={16}
              color={theme.button.primary.text}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

/**
 * ============================================================================
 * STORE PRODUCTS
 * ============================================================================
 */

export default function StoreProductsScreen() {
  /**
   * --------------------------------------------------------------------------
   * ROUTE
   * --------------------------------------------------------------------------
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const storeId = Number(id);

  /**
   * --------------------------------------------------------------------------
   * STORES
   * --------------------------------------------------------------------------
   */

  const {
    stores,
    isLoading: storesLoading,
    refetch: refetchStores,
  } = useStores();

  /**
   * --------------------------------------------------------------------------
   * PRODUCTS
   * --------------------------------------------------------------------------
   */

  const {
    products,
    isLoading: productsLoading,
    isFetching: productsFetching,
    refetch: refetchProducts,
  } = useProducts();

  /**
   * --------------------------------------------------------------------------
   * MUTATION
   * --------------------------------------------------------------------------
   */

  const addProductToStore = useAddProductToStore();

  /**
   * --------------------------------------------------------------------------
   * LOCAL STATE
   * --------------------------------------------------------------------------
   */

  const [search, setSearch] = useState("");

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * CURRENT STORE
   * --------------------------------------------------------------------------
   */

  const store = useMemo(() => {
    if (!Number.isFinite(storeId)) {
      return undefined;
    }

    return stores.find((item) => item.storeId === storeId);
  }, [storeId, stores]);

  /**
   * --------------------------------------------------------------------------
   * CURRENT STORE PRODUCTS
   * --------------------------------------------------------------------------
   */

  const storeProductIds = useMemo(() => {
    return new Set(store?.products ?? []);
  }, [store?.products]);

  /**
   * --------------------------------------------------------------------------
   * FILTER PRODUCTS
   * --------------------------------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name = product.productName.toLowerCase();

      const reference = product.productReference.toLowerCase();

      return name.includes(query) || reference.includes(query);
    });
  }, [products, search]);

  /**
   * --------------------------------------------------------------------------
   * SELECTED COUNT
   * --------------------------------------------------------------------------
   */

  const selectedCount = selectedProducts.length;

  /**
   * --------------------------------------------------------------------------
   * TOGGLE PRODUCT
   * --------------------------------------------------------------------------
   */

  function toggleProduct(productId: number) {
    /**
     * Products already belonging to the store
     * cannot be deselected here.
     *
     * Removal can be handled separately once the
     * backend exposes a remove-product-from-store
     * endpoint.
     */
    if (storeProductIds.has(productId)) {
      return;
    }

    setSelectedProducts((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });
  }

  /**
   * --------------------------------------------------------------------------
   * SAVE
   * --------------------------------------------------------------------------
   */

  async function handleSave() {
    if (!store) {
      Alert.alert(
        "Store unavailable",
        "The selected store could not be found."
      );

      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert(
        "No products selected",
        "Select at least one product to add to this store."
      );

      return;
    }

    try {
      for (const productId of selectedProducts) {
        await addProductToStore.mutateAsync({
          productId,
          storeIds: [store.storeId],
        });
      }

      setSelectedProducts([]);

      Alert.alert(
        "Products added",
        "The selected products have been added to your store.",
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to add products to store:", error);

      Alert.alert(
        "Unable to save",
        "We couldn't add the selected products to your store. Please try again."
      );
    }
  }

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  async function handleRefresh() {
    setRefreshing(true);

    try {
      await Promise.all([refetchStores(), refetchProducts()]);
    } finally {
      setRefreshing(false);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * LOADING
   * --------------------------------------------------------------------------
   */

  const isLoading = storesLoading || productsLoading;

  /**
   * --------------------------------------------------------------------------
   * INVALID STORE
   * --------------------------------------------------------------------------
   */

  if (!storesLoading && !store) {
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
            justifyContent: "center",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Ionicons
            name="storefront-outline"
            size={48}
            color={theme.icon.default.icon}
          />

          <AppText variant="h2" align="center">
            Store not found
          </AppText>

          <AppText variant="body" color="secondary" align="center">
            We couldn't find the store you're trying to manage.
          </AppText>

          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: spacing.sm,
              backgroundColor: theme.button.primary.background,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: radius.md,
            }}
          >
            <AppText variant="bodyBold" color="inverse">
              Go Back
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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

      {/* ======================================================================
          HEADER
      ======================================================================= */}

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.icon.default.icon}
          />
        </Pressable>

        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText variant="h1">Products in Store</AppText>

          <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
            {store?.storeName ?? "Store"}
          </AppText>
        </View>

        {selectedCount > 0 && (
          <View
            style={{
              minWidth: 28,
              height: 28,
              paddingHorizontal: spacing.xs,
              borderRadius: radius.full,
              backgroundColor: theme.button.primary.background,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText variant="bodySmall" color="inverse">
              {selectedCount}
            </AppText>
          </View>
        )}
      </View>

      {/* ======================================================================
          CONTENT
      ======================================================================= */}

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: selectedCount > 0 ? spacing["2xl"] : spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.icon.branding.icon}
            colors={[theme.icon.branding.icon]}
            progressBackgroundColor={theme.background.surface}
          />
        }
      >
        {/* ==================================================================
            DESCRIPTION
        ================================================================== */}

        <View
          style={{
            marginTop: spacing.sm,
            gap: spacing.xs,
          }}
        >
          <AppText variant="body" color="secondary">
            Select the products you want to display in your storefront.
          </AppText>
        </View>

        {/* ==================================================================
            SEARCH
        ================================================================== */}

        <View
          style={{
            marginTop: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.input.background,
            borderWidth: 1,
            borderColor: theme.input.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          }}
        >
          <Ionicons name="search-outline" size={20} color={theme.input.icon} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products"
            placeholderTextColor={theme.input.placeholder}
            returnKeyType="search"
            style={{
              flex: 1,
              minHeight: 48,
              marginLeft: spacing.sm,
              color: theme.input.text,
              fontSize: 16,
            }}
          />

          {search.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.input.icon}
              />
            </Pressable>
          )}
        </View>

        {/* ==================================================================
            SUMMARY
        ================================================================== */}

        <View
          style={{
            marginTop: spacing.lg,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText variant="bodyBold">Products</AppText>

          <AppText variant="bodySmall" color="secondary">
            {storeProductIds.size} in store
          </AppText>
        </View>

        {/* ==================================================================
            PRODUCTS
        ================================================================== */}

        <Card
          style={{
            marginTop: spacing.md,
            paddingVertical: 0,
          }}
        >
          {isLoading ? (
            <View
              style={{
                minHeight: 180,
                justifyContent: "center",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <ActivityIndicator
                size="small"
                color={theme.icon.branding.icon}
              />

              <AppText variant="bodySmall" color="secondary">
                Loading products...
              </AppText>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View
              style={{
                minHeight: 180,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: spacing.lg,
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="cube-outline"
                size={40}
                color={theme.icon.default.icon}
              />

              <AppText variant="bodyBold" align="center">
                No products found
              </AppText>

              <AppText variant="bodySmall" color="secondary" align="center">
                {search
                  ? "Try a different search term."
                  : "Create products first, then add them to your store."}
              </AppText>
            </View>
          ) : (
            filteredProducts.map((product, index) => {
              const productId = product.id;

              const selected =
                storeProductIds.has(productId) ||
                selectedProducts.includes(productId);

              return (
                <View key={productId}>
                  <ProductRow
                    product={product}
                    selected={selected}
                    onPress={() => toggleProduct(productId)}
                  />

                  {index < filteredProducts.length - 1 && <Divider />}
                </View>
              );
            })
          )}
        </Card>

        {/* ==================================================================
            PRODUCT REFRESH STATUS
        ================================================================== */}

        {productsFetching && !isLoading && (
          <View
            style={{
              marginTop: spacing.sm,
              alignItems: "center",
            }}
          >
            <AppText variant="bodySmall" color="secondary">
              Updating products...
            </AppText>
          </View>
        )}
      </ScrollView>

      {/* ======================================================================
          SAVE BAR
      ======================================================================= */}

      {selectedCount > 0 && (
        <SafeAreaView
          edges={["bottom"]}
          style={{
            backgroundColor: theme.background.surface,
            borderTopWidth: 1,
            borderTopColor: theme.border.default,
          }}
        >
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: spacing.sm,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add ${selectedCount} products to store`}
              disabled={addProductToStore.isPending}
              onPress={handleSave}
              style={({ pressed }) => ({
                minHeight: 50,
                borderRadius: radius.md,
                backgroundColor: theme.button.primary.background,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed || addProductToStore.isPending ? 0.7 : 1,
              })}
            >
              {addProductToStore.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={theme.button.primary.text}
                />
              ) : (
                <AppText variant="bodyBold" color="inverse">
                  Add {selectedCount}{" "}
                  {selectedCount === 1 ? "Product" : "Products"}
                </AppText>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
