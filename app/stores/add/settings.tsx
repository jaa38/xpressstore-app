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

import { spacing, theme } from "@/theme";

import { useStoreDraft } from "@/hooks/store/useStoreDraft";
import { useShippingRegions } from "@/hooks/store/useShippingRegions";

/**
 * ============================================================================
 * Shipping Region Card
 * ============================================================================
 */

function ShippingRegionCard({
  region,
  selected,
  onPress,
}: {
  region: {
    id: number;
    region: string;
    state: string;
    shippingFee: number;
  };
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${
        selected ? "Remove" : "Add"
      } ${region.region} shipping region`}
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
          {/* Icon */}

          <View
            style={{
              width: 44,
              height: 44,

              borderRadius: 22,

              backgroundColor: selected
                ? theme.icon.branding.background
                : theme.icon.default.background,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="location-outline"
              size={22}
              color={
                selected ? theme.icon.branding.icon : theme.icon.default.icon
              }
            />
          </View>

          {/* Region information */}

          <View
            style={{
              flex: 1,

              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyLargeBold">{region.region}</AppText>

            <AppText variant="bodySmall" color="secondary">
              {region.state}
            </AppText>

            <AppText variant="bodySmall" color="secondary">
              Shipping fee: ₦{region.shippingFee.toLocaleString()}
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
 * Settings Screen
 * ============================================================================
 */

export default function SettingsScreen() {
  const { store, updateStore } = useStoreDraft();

  const { shippingRegions, isLoading, error, refetch } = useShippingRegions();

  /**
   * --------------------------------------------------------------------------
   * Available shipping regions
   * --------------------------------------------------------------------------
   */

  const availableRegions = useMemo(() => {
    return shippingRegions;
  }, [shippingRegions]);

  /**
   * --------------------------------------------------------------------------
   * Region selection
   * --------------------------------------------------------------------------
   */

  function toggleShippingRegion(regionId: number) {
    const isSelected = store.storeShippingRegion.includes(regionId);

    const updatedRegionIds = isSelected
      ? store.storeShippingRegion.filter((id) => id !== regionId)
      : [...store.storeShippingRegion, regionId];

    updateStore({
      storeShippingRegion: updatedRegionIds,
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Continue
   * --------------------------------------------------------------------------
   */

  function handleNext() {
    router.push(ROUTES.ADD_STORE_REVIEW);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Draft / Back
   * --------------------------------------------------------------------------
   */

  function handleBack() {
    router.back();
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
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <AddStoreHeader
        title="Create Storefront"
        step={3}
        totalSteps={4}
        progress={75}
        label="Shipping"
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
            Choose the shipping regions where customers can order products from
            this storefront.
          </AppText>

          {/* ================================================================= */}
          {/* SHIPPING REGION SECTION */}
          {/* ================================================================= */}

          <View
            style={{
              marginTop: spacing.lg,

              gap: spacing.md,
            }}
          >
            {/* Section heading */}

            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h3" color="primary">
                Shipping Regions
              </AppText>

              <AppText color="secondary">
                Select one or more regions where you deliver orders.
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
                  name="car-outline"
                  size={20}
                  color={theme.icon.branding.icon}
                />

                <AppText variant="bodyBold">
                  {store.storeShippingRegion.length}{" "}
                  {store.storeShippingRegion.length === 1
                    ? "region"
                    : "regions"}{" "}
                  selected
                </AppText>
              </View>
            </Card>

            {/* =============================================================== */}
            {/* LOADING */}
            {/* =============================================================== */}

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
                  Loading shipping regions...
                </AppText>
              </View>
            ) : error ? (
              /* ============================================================= */
              /* ERROR */
              /* ============================================================= */

              <Card
                style={{
                  alignItems: "center",

                  paddingVertical: spacing.xl,

                  paddingHorizontal: spacing.lg,
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
                  Unable to load shipping regions
                </AppText>

                <AppText
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,

                    textAlign: "center",
                  }}
                >
                  We couldn't load your shipping regions. Please try again.
                </AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Try again"
                  onPress={() => refetch()}
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  <AppText color="link">Try Again</AppText>
                </Pressable>
              </Card>
            ) : availableRegions.length === 0 ? (
              /* ============================================================= */
              /* NO REGIONS */
              /* ============================================================= */

              <Card
                style={{
                  alignItems: "center",

                  paddingVertical: spacing.xl,

                  paddingHorizontal: spacing.lg,
                }}
              >
                <Ionicons
                  name="location-outline"
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
                  No shipping regions available
                </AppText>

                <AppText
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,

                    textAlign: "center",
                  }}
                >
                  Create a shipping region before configuring delivery for your
                  storefront.
                </AppText>
              </Card>
            ) : (
              /* ============================================================= */
              /* REGIONS */
              /* ============================================================= */

              <View
                style={{
                  gap: spacing.sm,
                }}
              >
                {availableRegions.map((region) => (
                  <ShippingRegionCard
                    key={region.id}
                    region={region}
                    selected={store.storeShippingRegion.includes(region.id)}
                    onPress={() => toggleShippingRegion(region.id)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* ================================================================= */}
        {/* FOOTER */}
        {/* ================================================================= */}

        <Divider />

        <AddStoreFooter
          primaryLabel="Next"
          secondaryLabel="Back"
          onPrimary={handleNext}
          onSecondary={handleBack}
        />
      </View>
    </SafeAreaView>
  );
}
