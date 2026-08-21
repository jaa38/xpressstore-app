import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import * as Clipboard from "expo-clipboard";

import { router, useLocalSearchParams } from "expo-router";

import { useState } from "react";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { UICard } from "@/components/ui/UICard";

import { spacing, theme, radius } from "@/theme";

import { useStore } from "@/hooks/store/useStore";

import {
  getStoreEditRoute,
  getStoreLayoutRoute,
  getStoreProductsRoute,
  getStoreThemeRoute,
} from "@/navigation/routes";

/**
 * ============================================================================
 * SETTINGS ROW
 * ============================================================================
 */

function SettingsRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      disabled={!onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            gap: spacing.xs,
          }}
        >
          <AppText variant="bodyBold">{title}</AppText>

          <AppText variant="bodySmall" color="secondary">
            {subtitle}
          </AppText>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.icon.default.icon}
        />
      </View>
    </Pressable>
  );
}

/**
 * ============================================================================
 * STORE FRONT VIEW
 * ============================================================================
 */

export default function StorefrontView() {
  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMETER
   * --------------------------------------------------------------------------
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  /**
   * --------------------------------------------------------------------------
   * STORE ID
   * --------------------------------------------------------------------------
   */

  const storeId = Number(id);

  /**
   * --------------------------------------------------------------------------
   * STORE
   * --------------------------------------------------------------------------
   */

  const { store, isLoading, isFetching, error, refetch } = useStore({
    storeId,
  });

  /**
   * --------------------------------------------------------------------------
   * REFRESHING
   * --------------------------------------------------------------------------
   */

  const [refreshing, setRefreshing] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * STORE URL
   * --------------------------------------------------------------------------
   */

  const storeUrl = store?.storeLink ?? "";

  /**
   * --------------------------------------------------------------------------
   * PRODUCT COUNT
   * --------------------------------------------------------------------------
   */

  const totalProducts = store?.products?.length ?? 0;

  /**
   * --------------------------------------------------------------------------
   * DISCOUNT COUNT
   * --------------------------------------------------------------------------
   */

  const totalDiscounts = store?.discounts?.length ?? 0;

  /**
   * --------------------------------------------------------------------------
   * EDIT STORE
   * --------------------------------------------------------------------------
   */

  function handleEditStore() {
    if (!store) {
      return;
    }

    router.push(getStoreEditRoute(store.storeId));
  }

  /**
   * --------------------------------------------------------------------------
   * COPY STORE LINK
   * --------------------------------------------------------------------------
   */

  async function handleCopyLink() {
    if (!storeUrl) {
      Alert.alert("Store URL", "No store URL available.");

      return;
    }

    await Clipboard.setStringAsync(storeUrl);

    Alert.alert("Copied", "Store link copied to clipboard.");
  }

  /**
   * --------------------------------------------------------------------------
   * SHARE STORE LINK
   * --------------------------------------------------------------------------
   */

  async function handleShareLink() {
    if (!storeUrl) {
      Alert.alert("Store URL", "No store URL available.");

      return;
    }

    try {
      await Share.share({
        message: storeUrl,
      });
    } catch (shareError) {
      console.log("SHARE STORE ERROR", shareError);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  async function onRefresh() {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * ERROR STATE
   * --------------------------------------------------------------------------
   */

  if (!isLoading && error) {
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

            <AppText variant="h1">Storefront</AppText>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={theme.icon.error.icon}
            />

            <AppText
              variant="bodyLargeBold"
              style={{
                marginTop: spacing.md,
                textAlign: "center",
              }}
            >
              Unable to load store
            </AppText>

            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.xs,
                textAlign: "center",
              }}
            >
              We couldn't load this storefront.
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
          </View>
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

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isFetching}
            onRefresh={onRefresh}
            tintColor={theme.icon.branding.icon}
            colors={[theme.icon.branding.icon]}
            progressBackgroundColor={theme.background.surface}
          />
        }
      >
        {/* ==================================================================
            HEADER
        ================================================================== */}

        <View
          style={{
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
            <AppText variant="h1" numberOfLines={1}>
              {isLoading ? "Loading..." : (store?.storeName ?? "Storefront")}
            </AppText>

            <AppText variant="body" color="secondary">
              Manage your shop & share with customers
            </AppText>
          </View>
        </View>

        {/* ==================================================================
            STORE SUMMARY
        ================================================================== */}

        <Card
          style={{
            marginTop: spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: spacing.lg,
            }}
          >
            {/* CURRENCY */}

            <View
              style={{
                alignItems: "center",
              }}
            >
              <AppText variant="bodySmall" color="primary">
                Currency
              </AppText>

              <AppText variant="h3" color="strong">
                {isLoading ? "--" : (store?.currency ?? "--")}
              </AppText>
            </View>

            {/* PRODUCTS */}

            <View
              style={{
                alignItems: "center",
              }}
            >
              <AppText variant="bodySmall" color="primary">
                Products
              </AppText>

              <AppText variant="h3" color="strong">
                {isLoading ? "--" : totalProducts}
              </AppText>
            </View>

            {/* DISCOUNTS */}

            <View
              style={{
                alignItems: "center",
              }}
            >
              <AppText variant="bodySmall" color="primary">
                Discounts
              </AppText>

              <AppText variant="h3" color="strong">
                {isLoading ? "--" : totalDiscounts}
              </AppText>
            </View>
          </View>
        </Card>

        {/* ==================================================================
            STORE STATUS
        ================================================================== */}

        <Card
          style={{
            marginTop: spacing.md,
            backgroundColor: theme.background.brand,
            gap: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AppText variant="bodyBold">
              {isLoading ? "Loading..." : (store?.storeName ?? "Unnamed Store")}
            </AppText>

            <UICard
              title={store?.isActive ? "Live" : "Offline"}
              variant={store?.isActive ? "active" : "status"}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              backgroundColor: theme.background.primary,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: theme.border.default,
            }}
          >
            <AppText
              variant="body"
              color="secondary"
              numberOfLines={1}
              style={{
                flex: 1,
              }}
            >
              {storeUrl || "No store URL available"}
            </AppText>

            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                marginLeft: spacing.sm,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Copy store link"
                hitSlop={10}
                onPress={handleCopyLink}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={theme.icon.default.icon}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share store link"
                hitSlop={10}
                onPress={handleShareLink}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>
          </View>
        </Card>

        {/* ==================================================================
            PREVIEW STORE
        ================================================================== */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <Card>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold" color="primary">
                  Preview Store
                </AppText>

                <AppText variant="bodySmall" color="secondary">
                  See what customers see
                </AppText>
              </View>

              <Ionicons
                name="globe-outline"
                size={24}
                color={theme.icon.default.icon}
              />
            </View>
          </Card>
        </View>

        {/* ==================================================================
            CUSTOMISE
        ================================================================== */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="h3">Customise</AppText>

          <Card
            style={{
              paddingVertical: 0,
              marginTop: spacing.md,
            }}
          >
            {/* STORE NAME & INFO */}

            <SettingsRow
              title="Store Name & Info"
              subtitle={store?.storeName ?? "No Store"}
              onPress={handleEditStore}
            />

            <Divider />

            {/* THEME */}

            <SettingsRow
              title="Theme"
              subtitle={store?.themeColor ?? "Default"}
              onPress={() => {
                if (!store) {
                  return;
                }

                router.push(getStoreThemeRoute(store.storeId));
              }}
            />

            <Divider />

            {/* LAYOUT */}

            <SettingsRow
              title="Layout"
              subtitle={store?.layout === "list" ? "List view" : "Grid view"}
              onPress={() => {
                if (!store) {
                  return;
                }

                router.push(getStoreLayoutRoute(store.storeId));
              }}
            />

            <Divider />

            {/* PRODUCTS */}

            <SettingsRow
              title="Products in Store"
              subtitle={`${totalProducts} ${
                totalProducts === 1 ? "product" : "products"
              }`}
              onPress={() => {
                if (!store) {
                  return;
                }

                router.push(getStoreProductsRoute(store.storeId));
              }}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
