import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useFocusEffect } from "expo-router";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { useCallback, useMemo, useState } from "react";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";

import { spacing, theme, radius } from "@/theme";

import { useShippingRegions } from "@/hooks/store/useShippingRegions";
import { useDeleteShippingRegion } from "@/hooks/store/useDeleteShippingRegion";

import { useToast } from "@/hooks/useToast";

import { ROUTES, getEditShippingRegionRoute } from "@/navigation/routes";

import type { ShippingRegion } from "@/types/store";

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
      accessibilityLabel="Delete shipping region"
      disabled={disabled}
      onPress={onDelete}
      style={({ pressed }) => ({
        width: 90,
        marginLeft: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.action.primary.delete,
        borderRadius: radius.md,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
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
 * SHIPPING REGION CARD
 * ============================================================================
 */

function ShippingRegionCard({
  shippingRegion,
  onDelete,
  deleting,
  onPress,
}: {
  shippingRegion: ShippingRegion;
  onDelete: (regionId: number) => void;
  deleting: boolean;
  onPress: (regionId: number) => void;
}) {
  return (
    <Swipeable
      enabled={!deleting}
      renderRightActions={() => (
        <RightActions
          disabled={deleting}
          onDelete={() => onDelete(shippingRegion.id)}
        />
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${shippingRegion.region} shipping region`}
        disabled={deleting}
        onPress={() => onPress(shippingRegion.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Card
          style={{
            borderWidth: 1,
            borderColor: theme.border.default,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* ============================================================
                ICON
            ============================================================ */}

            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.md,
                backgroundColor: theme.background.subtle,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../../assets/icons/locationIcon.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="contain"
              />
            </View>

            {/* ============================================================
                DETAILS
            ============================================================ */}

            <View
              style={{
                flex: 1,
                marginLeft: spacing.md,
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodyBold" numberOfLines={1}>
                {shippingRegion.region}
              </AppText>

              <AppText variant="bodySmall" color="muted" numberOfLines={1}>
                {shippingRegion.state}
              </AppText>

              <AppText variant="caption" color="secondary" numberOfLines={1}>
                Shipping fee: ₦{shippingRegion.shippingFee.toLocaleString()}
              </AppText>
            </View>

            {/* ============================================================
                ACTIONS
            ============================================================ */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: spacing.sm,
                gap: spacing.xs,
              }}
            >
              {/* VIEW */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View ${shippingRegion.region} shipping region`}
                disabled={deleting}
                onPress={() => onPress(shippingRegion.id)}
                hitSlop={8}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: pressed
                    ? theme.background.subtle
                    : "transparent",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons
                  name="eye-outline"
                  size={21}
                  color={theme.state.info.icon}
                />
              </Pressable>

              {/* EDIT */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Edit ${shippingRegion.region} shipping region`}
                disabled={deleting}
                onPress={() => {
                  router.push(getEditShippingRegionRoute(shippingRegion.id));
                }}
                hitSlop={8}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: pressed
                    ? theme.background.subtle
                    : "transparent",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons
                  name="create-outline"
                  size={21}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>
          </View>
        </Card>
      </Pressable>
    </Swipeable>
  );
}

/**
 * ============================================================================
 * FIRST-TIME USER EMPTY STATE
 * ============================================================================
 */

function ShippingRegionsEmptyState({
  onAddShippingRegion,
}: {
  onAddShippingRegion: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
      }}
    >
      <Card
        style={{
          alignItems: "center",
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* ICON */}

        {/* SHIPPING REGIONS IMAGE */}

        <Image
          source={require("../../../../assets/images/default-shipping-regions.png")}
          style={{
            width: 256,
            height: 128,
          }}
          resizeMode="contain"
        />

        {/* TITLE */}

        <AppText
          variant="bodyLargeBold"
          style={{
            marginTop: spacing.md,
            textAlign: "center",
          }}
        >
          No shipping regions yet
        </AppText>

        {/* DESCRIPTION */}

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.xs,
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          Set up shipping regions and delivery fees for the areas where you
          deliver your products.
        </AppText>

        {/* CTA */}

        <Button
          title="Add Shipping Region"
          variant="primary"
          leftIcon={
            <Ionicons name="add" size={20} color={theme.action.primary.text} />
          }
          style={{
            marginTop: spacing.lg,
          }}
          onPress={onAddShippingRegion}
        />

        {/* SUPPORTING TEXT */}

        <AppText
          variant="caption"
          color="muted"
          style={{
            marginTop: spacing.sm,
            textAlign: "center",
          }}
        >
          Shipping regions determine the delivery fee customers pay for their
          location.
        </AppText>
      </Card>
    </View>
  );
}

/**
 * ============================================================================
 * SEARCH EMPTY STATE
 * ============================================================================
 */

function ShippingRegionsSearchEmptyState({
  onClearSearch,
}: {
  onClearSearch: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          alignItems: "center",
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* ICON */}

        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: theme.icon.default.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="search-outline"
            size={28}
            color={theme.icon.default.icon}
          />
        </View>

        {/* TITLE */}

        <AppText
          variant="bodyLargeBold"
          style={{
            marginTop: spacing.md,
            textAlign: "center",
          }}
        >
          No shipping regions found
        </AppText>

        {/* DESCRIPTION */}

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.xs,
            textAlign: "center",
          }}
        >
          Try searching with a different region or state name.
        </AppText>

        {/* CLEAR */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear shipping region search"
          onPress={onClearSearch}
          style={{
            marginTop: spacing.md,
          }}
        >
          <AppText color="link">Clear Search</AppText>
        </Pressable>
      </Card>
    </View>
  );
}

/**
 * ============================================================================
 * ERROR STATE
 * ============================================================================
 */

function ShippingRegionsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
      }}
    >
      {/* ICON */}

      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.full,
          backgroundColor: theme.background.error,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={30}
          color={theme.icon.error.icon}
        />
      </View>

      {/* TITLE */}

      <AppText
        variant="bodyLargeBold"
        style={{
          marginTop: spacing.md,
          textAlign: "center",
        }}
      >
        Unable to load shipping regions
      </AppText>

      {/* DESCRIPTION */}

      <AppText
        variant="body"
        color="secondary"
        style={{
          marginTop: spacing.xs,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        We couldn't load your shipping regions. Please try again.
      </AppText>

      {/* RETRY */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Try again"
        onPress={onRetry}
        style={{
          marginTop: spacing.md,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        }}
      >
        <AppText color="link">Try Again</AppText>
      </Pressable>
    </View>
  );
}

/**
 * ============================================================================
 * SHIPPING REGION SCREEN
 * ============================================================================
 */

export default function ShippingRegionScreen() {
  /**
   * --------------------------------------------------------------------------
   * SHIPPING REGIONS
   * --------------------------------------------------------------------------
   */

  const { shippingRegions, isLoading, isRefetching, error, refetch } =
    useShippingRegions();

  /**
   * --------------------------------------------------------------------------
   * DELETE
   * --------------------------------------------------------------------------
   */

  const deleteShippingRegionMutation = useDeleteShippingRegion();

  /**
   * --------------------------------------------------------------------------
   * TOAST
   * --------------------------------------------------------------------------
   */

  const { showToast } = useToast();

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * --------------------------------------------------------------------------
   * SCREEN FOCUS
   * --------------------------------------------------------------------------
   */

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  /**
   * --------------------------------------------------------------------------
   * SHIPPING REGIONS SOURCE
   * --------------------------------------------------------------------------
   */

  const shippingRegionList = useMemo(
    () => shippingRegions ?? [],
    [shippingRegions]
  );

  /**
   * --------------------------------------------------------------------------
   * FIRST-TIME USER
   * --------------------------------------------------------------------------
   *
   * Important:
   *
   * An empty response is treated as a legitimate state.
   *
   * If the API fails before the merchant has ever created a shipping region,
   * we still show the onboarding state rather than exposing a technical
   * error.
   * --------------------------------------------------------------------------
   */

  const hasShippingRegions = shippingRegionList.length > 0;

  const isFirstTimeUser =
    !isLoading && !hasShippingRegions && searchQuery.trim() === "";

  /**
   * --------------------------------------------------------------------------
   * ERROR
   * --------------------------------------------------------------------------
   *
   * Only show an API error when the merchant already has shipping regions.
   *
   * This prevents a new merchant from seeing:
   *
   * "Unable to load shipping regions"
   *
   * when they simply have not created one yet.
   * --------------------------------------------------------------------------
   */

  const showShippingRegionError = !isLoading && !!error && hasShippingRegions;

  /**
   * --------------------------------------------------------------------------
   * SORT
   * --------------------------------------------------------------------------
   */

  const sortedShippingRegions = useMemo(() => {
    return [...shippingRegionList].sort((a, b) =>
      a.region.localeCompare(b.region)
    );
  }, [shippingRegionList]);

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const filteredShippingRegions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sortedShippingRegions;
    }

    return sortedShippingRegions.filter(
      (shippingRegion) =>
        shippingRegion.region.toLowerCase().includes(query) ||
        shippingRegion.state.toLowerCase().includes(query)
    );
  }, [sortedShippingRegions, searchQuery]);

  /**
   * --------------------------------------------------------------------------
   * SEARCH EMPTY
   * --------------------------------------------------------------------------
   */

  const hasNoSearchResults =
    !isLoading &&
    !showShippingRegionError &&
    hasShippingRegions &&
    searchQuery.trim() !== "" &&
    filteredShippingRegions.length === 0;

  /**
   * --------------------------------------------------------------------------
   * HEADER SUBTITLE
   * --------------------------------------------------------------------------
   */

  const headerSubtitle = isLoading
    ? "Loading shipping regions..."
    : isFirstTimeUser
      ? "Manage where you deliver your products."
      : shippingRegionList.length === 1
        ? "1 shipping region"
        : `${shippingRegionList.length} shipping regions`;

  /**
   * --------------------------------------------------------------------------
   * ADD SHIPPING REGION
   * --------------------------------------------------------------------------
   */

  const handleAddShippingRegion = () => {
    router.push(ROUTES.ADD_SHIPPING_REGION);
  };

  /**
   * --------------------------------------------------------------------------
   * VIEW SHIPPING REGION
   * --------------------------------------------------------------------------
   */

  const handleViewShippingRegion = (regionId: number) => {
    router.push(`/shipping-regions/view/${regionId}`);
  };

  /**
   * --------------------------------------------------------------------------
   * DELETE SHIPPING REGION
   * --------------------------------------------------------------------------
   */

  const handleDelete = (regionId: number) => {
    if (deleteShippingRegionMutation.isPending) {
      return;
    }

    const shippingRegion = shippingRegionList.find(
      (item) => item.id === regionId
    );

    if (!shippingRegion) {
      return;
    }

    Alert.alert(
      "Delete Shipping Region",

      `Are you sure you want to delete "${shippingRegion.region}"? This action cannot be undone.`,

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
              await deleteShippingRegionMutation.mutateAsync(regionId);

              await refetch();

              showToast({
                type: "success",
                title: "Shipping Region Deleted",
                message: "The shipping region has been removed successfully.",
              });
            } catch (error) {
              console.log("DELETE SHIPPING REGION ERROR", error);

              showToast({
                type: "error",
                title: "Delete Failed",
                message:
                  "Unable to delete this shipping region. Please try again.",
              });
            }
          },
        },
      ]
    );
  };

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    await refetch();
  };

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
            {/* BACK */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.text.primary}
              />
            </Pressable>

            {/* TITLE */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Shipping Regions</AppText>

              <AppText variant="body" color="secondary">
                {headerSubtitle}
              </AppText>
            </View>

            {/* ADD */}

            {!isFirstTimeUser && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add shipping region"
                disabled={deleteShippingRegionMutation.isPending}
                onPress={handleAddShippingRegion}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.action.primary.background,
                  opacity: deleteShippingRegionMutation.isPending
                    ? 0.5
                    : pressed
                      ? 0.7
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
              CONTENT
          ================================================================ */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* ==============================================================
                SEARCH
            ============================================================== */}

            {!isFirstTimeUser && !showShippingRegionError && (
              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <SearchBar
                  placeholder="Search shipping regions"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}

            {/* ==============================================================
                CONTENT STATE
            ============================================================== */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
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
                    Loading shipping regions...
                  </AppText>
                </View>
              ) : isFirstTimeUser ? (
                /* ==========================================================
                   FIRST-TIME USER
                ========================================================== */

                <ShippingRegionsEmptyState
                  onAddShippingRegion={handleAddShippingRegion}
                />
              ) : showShippingRegionError ? (
                /* ==========================================================
                   ERROR
                ========================================================== */

                <ShippingRegionsErrorState onRetry={refetch} />
              ) : hasNoSearchResults ? (
                /* ==========================================================
                   SEARCH EMPTY
                ========================================================== */

                <ShippingRegionsSearchEmptyState
                  onClearSearch={() => setSearchQuery("")}
                />
              ) : (
                /* ==========================================================
                   SHIPPING REGION LIST
                ========================================================== */

                <FlatList
                  data={filteredShippingRegions}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <ShippingRegionCard
                      shippingRegion={item}
                      deleting={deleteShippingRegionMutation.isPending}
                      onDelete={handleDelete}
                      onPress={handleViewShippingRegion}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    paddingTop: spacing.md,
                    paddingBottom: spacing["2xl"],
                  }}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: spacing.md,
                      }}
                    />
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefetching}
                      onRefresh={onRefresh}
                      tintColor={theme.icon.branding.icon}
                      colors={[theme.icon.branding.icon]}
                      progressBackgroundColor={theme.background.surface}
                    />
                  }
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
