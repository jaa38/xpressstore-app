import { useMemo } from "react";

import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

import { AddStoreHeader } from "@/components/stores/AddStoreHeader";
import { AddStoreFooter } from "@/components/stores/AddStoreFooter";

import { ROUTES } from "@/navigation/routes";

import { spacing, theme, radius } from "@/theme";

import { useStoreDraft } from "@/hooks/store/useStoreDraft";
import { useCreateStore } from "@/hooks/store/useCreateStore";
import { useProducts } from "@/hooks/products/useProducts";
import { useShippingRegions } from "@/hooks/store/useShippingRegions";

import type { CreateStoreRequest } from "@/types/store";

/**
 * ============================================================================
 * Review Section
 * ============================================================================
 */

function ReviewSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        marginTop: spacing.lg,
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.full,
            backgroundColor: theme.icon.branding.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name={icon} size={18} color={theme.icon.branding.icon} />
        </View>

        <AppText variant="bodyLargeBold" color="primary">
          {title}
        </AppText>
      </View>

      {children}
    </View>
  );
}

/**
 * ============================================================================
 * Review Row
 * ============================================================================
 */

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: spacing.md,
      }}
    >
      <AppText variant="bodySmall" color="secondary">
        {label}
      </AppText>

      <AppText
        variant="bodySmall"
        color="primary"
        style={{
          flex: 1,
          textAlign: "right",
        }}
      >
        {value}
      </AppText>
    </View>
  );
}

/**
 * ============================================================================
 * Review Screen
 * ============================================================================
 */

export default function ReviewScreen() {
  const { store, resetStore } = useStoreDraft();

  const { products, isLoading: productsLoading } = useProducts();

  const { shippingRegions, isLoading: regionsLoading } = useShippingRegions();

  const createStoreMutation = useCreateStore();

  /**
   * --------------------------------------------------------------------------
   * Selected products
   * --------------------------------------------------------------------------
   */

  const selectedProducts = useMemo(() => {
    return products.filter((product) =>
      store.storeProducts.includes(product.id)
    );
  }, [products, store.storeProducts]);

  /**
   * --------------------------------------------------------------------------
   * Selected shipping regions
   * --------------------------------------------------------------------------
   */

  const selectedShippingRegions = useMemo(() => {
    return shippingRegions.filter((region) =>
      store.storeShippingRegion.includes(region.id)
    );
  }, [shippingRegions, store.storeShippingRegion]);

  /**
   * --------------------------------------------------------------------------
   * Create Store
   * --------------------------------------------------------------------------
   */

  function handleCreateStore() {
    const payload: CreateStoreRequest = {
      storeName: store.storeName.trim(),

      storeReference: store.storeReference.trim(),

      currency: store.currency,

      storeLink: store.storeLink,

      welcomeMessage: store.welcomeMessage.trim() || undefined,

      description: store.description.trim() || undefined,

      storeProducts: store.storeProducts,

      storeShippingRegion: store.storeShippingRegion,

      storeDiscounts: store.storeDiscounts,
    };

    createStoreMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.responseCode !== "00") {
          return;
        }

        resetStore();

        router.replace(ROUTES.STORE);
      },
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Back
   * --------------------------------------------------------------------------
   */

  function handleBack() {
    router.back();
  }

  /**
   * --------------------------------------------------------------------------
   * API error message
   * --------------------------------------------------------------------------
   */

  const errorMessage = createStoreMutation.error
    ? "We couldn't create your storefront. Please try again."
    : null;

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
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <AddStoreHeader
        title="Create Storefront"
        step={4}
        totalSteps={4}
        progress={100}
        label="Review"
      />

      <Divider />

      {/* ================================================================== */}
      {/* CONTENT */}
      {/* ================================================================== */}

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
            Review your storefront details before creating it.
          </AppText>

          {/* ================================================================= */}
          {/* STORE INFORMATION */}
          {/* ================================================================= */}

          <ReviewSection title="Store Information" icon="storefront-outline">
            <Card>
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                <ReviewRow
                  label="Store Name"
                  value={store.storeName || "Not provided"}
                />

                <ReviewRow
                  label="Reference"
                  value={store.storeReference || "Not provided"}
                />

                <ReviewRow label="Currency" value={store.currency} />

                <ReviewRow
                  label="Description"
                  value={store.description || "Not provided"}
                />

                <ReviewRow
                  label="Welcome Message"
                  value={store.welcomeMessage || "Not provided"}
                />
              </View>
            </Card>
          </ReviewSection>

          {/* ================================================================= */}
          {/* STOREFRONT URL */}
          {/* ================================================================= */}

          <ReviewSection title="Storefront URL" icon="link-outline">
            <Card
              style={{
                backgroundColor: theme.background.brand,
                borderWidth: 1,
                borderColor: theme.border.brand,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={theme.icon.branding.icon}
                />

                <AppText
                  variant="bodySmall"
                  color="primary"
                  style={{
                    flex: 1,
                  }}
                >
                  {store.storeLink || "Store URL will be generated"}
                </AppText>
              </View>
            </Card>
          </ReviewSection>

          {/* ================================================================= */}
          {/* PRODUCTS */}
          {/* ================================================================= */}

          <ReviewSection title="Store Products" icon="cube-outline">
            <Card>
              {productsLoading ? (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.md,
                  }}
                >
                  <ActivityIndicator color={theme.icon.branding.icon} />

                  <AppText
                    color="secondary"
                    style={{
                      marginTop: spacing.sm,
                    }}
                  >
                    Loading selected products...
                  </AppText>
                </View>
              ) : selectedProducts.length === 0 ? (
                <AppText color="secondary">No products selected.</AppText>
              ) : (
                <View
                  style={{
                    gap: spacing.md,
                  }}
                >
                  {selectedProducts.map((product, index) => (
                    <View
                      key={product.id}
                      style={{
                        gap: spacing.xs,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: spacing.md,
                        }}
                      >
                        <AppText
                          variant="bodyBold"
                          style={{
                            flex: 1,
                          }}
                        >
                          {product.productName}
                        </AppText>

                        <AppText variant="bodySmall" color="secondary">
                          {product.totalInStock} in stock
                        </AppText>
                      </View>

                      {index < selectedProducts.length - 1 && <Divider />}
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </ReviewSection>

          {/* ================================================================= */}
          {/* SHIPPING */}
          {/* ================================================================= */}

          <ReviewSection title="Shipping Regions" icon="location-outline">
            <Card>
              {regionsLoading ? (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.md,
                  }}
                >
                  <ActivityIndicator color={theme.icon.branding.icon} />

                  <AppText
                    color="secondary"
                    style={{
                      marginTop: spacing.sm,
                    }}
                  >
                    Loading selected regions...
                  </AppText>
                </View>
              ) : selectedShippingRegions.length === 0 ? (
                <AppText color="secondary">
                  No shipping regions selected.
                </AppText>
              ) : (
                <View
                  style={{
                    gap: spacing.md,
                  }}
                >
                  {selectedShippingRegions.map((region, index) => (
                    <View
                      key={region.id}
                      style={{
                        gap: spacing.xs,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: spacing.md,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <AppText variant="bodyBold">{region.region}</AppText>

                          <AppText variant="bodySmall" color="secondary">
                            {region.state}
                          </AppText>
                        </View>

                        <AppText variant="bodySmall" color="secondary">
                          ₦{region.shippingFee.toLocaleString()}
                        </AppText>
                      </View>

                      {index < selectedShippingRegions.length - 1 && (
                        <Divider />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </ReviewSection>

          {/* ================================================================= */}
          {/* ERROR */}
          {/* ================================================================= */}

          {errorMessage && (
            <Card
              style={{
                marginTop: spacing.lg,

                backgroundColor: theme.state.error.background,

                borderWidth: 1,

                borderColor: theme.state.error.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  gap: spacing.sm,
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={22}
                  color={theme.state.error.icon}
                />

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText
                    variant="bodyBold"
                    style={{
                      color: theme.state.error.text,
                    }}
                  >
                    Unable to create storefront
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    style={{
                      marginTop: spacing.xs,

                      color: theme.state.error.text,
                    }}
                  >
                    {errorMessage}
                  </AppText>
                </View>
              </View>
            </Card>
          )}
        </ScrollView>

        {/* ================================================================= */}
        {/* FOOTER */}
        {/* ================================================================= */}

        <Divider />

        <AddStoreFooter
          primaryLabel={
            createStoreMutation.isPending ? "Creating..." : "Create Store"
          }
          secondaryLabel="Back"
          onPrimary={handleCreateStore}
          onSecondary={handleBack}
        />
      </View>
    </SafeAreaView>
  );
}
