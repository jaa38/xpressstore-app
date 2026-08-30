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

import { useEffect, useState } from "react";

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

import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

import { useUpdateStore } from "@/hooks/store/useUpdateStore";

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
   * UPDATE STORE
   * --------------------------------------------------------------------------
   */

  const updateStoreMutation = useUpdateStore();

  /**
   * --------------------------------------------------------------------------
   * REFRESHING
   * --------------------------------------------------------------------------
   */

  const [refreshing, setRefreshing] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * STOREFRONT STATUS
   * --------------------------------------------------------------------------
   *
   * Local UI state mirrors the store's API state.
   *
   * The state is updated after the user confirms the native popup.
   */

  const [isStorefrontEnabled, setIsStorefrontEnabled] = useState(
    store?.isActive ?? false
  );

  useEffect(() => {
    if (store) {
      setIsStorefrontEnabled(store.isActive);
    }
  }, [store]);

  /**
   * --------------------------------------------------------------------------
   * TOGGLE STOREFRONT STATUS
   * --------------------------------------------------------------------------
   *
   * The native React Native Alert is shown before changing the storefront
   * status.
   *
   * Cancel:
   * - Nothing changes.
   *
   * Confirm:
   * - Update local UI state.
   * - Persist the new status through Update Store.
   *
   * Failure:
   * - Restore the previous state.
   */

  function handleToggleStorefront(value: boolean) {
    if (!store || updateStoreMutation.isPending) {
      return;
    }

    const title = value ? "Make Storefront Live?" : "Take Storefront Offline?";

    const message = value
      ? "Customers will be able to view your storefront and shop from it."
      : "Customers will no longer be able to view or shop from your storefront.";

    Alert.alert(title, message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: value ? "Go Live" : "Take Offline",
        style: value ? "default" : "destructive",

        onPress: async () => {
          setIsStorefrontEnabled(value);

          try {
            await updateStoreMutation.mutateAsync({
              id: store.storeId,

              storeName: store.storeName,

              currency: store.currency,

              storeReference: store.storeReference,

              storeLink: store.storeLink,

              isActive: value,

              themeColor: store.themeColor,

              welcomeMessage: store.welcomeMessage,

              description: store.description,

              callBackUrl: store.callBackUrl,

              successMessage: store.successMessage,

              whatsAppNumber: store.whatsAppNumber,

              phoneNumber: store.phoneNumber,

              email: store.email,

              instagram: store.instagram,

              facebook: store.facebook,

              twitter: store.twitter,

              storeProducts: store.products,

              storeDiscounts: store.discounts,
            });
          } catch (error) {
            /**
             * Restore the previous state if the update fails.
             */

            setIsStorefrontEnabled(!value);

            console.log("UPDATE STOREFRONT STATUS ERROR", error);

            Alert.alert(
              "Update Failed",
              "We couldn't update your storefront status. Please try again."
            );
          }
        },
      },
    ]);
  }

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
              title={isStorefrontEnabled ? "Live" : "Offline"}
              variant={isStorefrontEnabled ? "active" : "status"}
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
            STOREFRONT TOGGLE
        ================================================================== */}

        <Card
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              gap: spacing.xs,
              flex: 1,
            }}
          >
            <AppText variant="bodyBold" color="primary">
              Storefront Status
            </AppText>
          </View>

          <ToggleSwitch
            value={isStorefrontEnabled}
            onChange={handleToggleStorefront}
            disabled={updateStoreMutation.isPending}
          />
        </Card>

        {/* ==================================================================
            PREVIEW STORE
        ================================================================== */}

        <Card style={{ marginTop: spacing.md }}>
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
