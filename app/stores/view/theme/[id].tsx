import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { RadioGroup } from "@/components/ui/RadioGroup";

import { spacing, theme, radius } from "@/theme";

import { useStore } from "@/hooks/store/useStore";
import { useUpdateStore } from "@/hooks/store/useUpdateStore";

import type { UpdateStoreRequest } from "@/types/store";

/**
 * ============================================================================
 * THEME OPTIONS
 * ============================================================================
 */

const THEME_OPTIONS = [
  {
    label: "Green",
    value: "#4CAF50",
  },
  {
    label: "Orange",
    value: "#FF6D00",
  },
  {
    label: "Blue",
    value: "#2563EB",
  },
  {
    label: "Red",
    value: "#DC2626",
  },
  {
    label: "Amber",
    value: "#F59E0B",
  },
  {
    label: "Xpress Green",
    value: "#006F01",
  },
];

/**
 * ============================================================================
 * THEME PREVIEW
 * ============================================================================
 */

function ThemePreview({ color }: { color: string }) {
  return (
    <View
      style={{
        marginTop: spacing.lg,
      }}
    >
      <AppText
        variant="bodyBold"
        style={{
          marginBottom: spacing.sm,
        }}
      >
        Preview
      </AppText>

      <View
        style={{
          borderRadius: radius.lg,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.border.default,
          backgroundColor: theme.background.surface,
        }}
      >
        {/* Store header */}

        <View
          style={{
            backgroundColor: color,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
          }}
        >
          <AppText
            variant="h3"
            style={{
              color: "#FFFFFF",
            }}
          >
            My Store
          </AppText>

          <AppText
            variant="bodySmall"
            style={{
              color: "#FFFFFF",
              marginTop: spacing.xs,
              opacity: 0.9,
            }}
          >
            Welcome to our store
          </AppText>
        </View>

        {/* Store content */}

        <View
          style={{
            padding: spacing.lg,
          }}
        >
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
              }}
            >
              <AppText variant="bodyBold">Featured Products</AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                Discover our latest products
              </AppText>
            </View>

            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: color,
                opacity: 0.12,
              }}
            />
          </View>

          <View
            style={{
              height: 42,
              borderRadius: radius.md,
              backgroundColor: color,
              marginTop: spacing.lg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText
              variant="bodyBold"
              style={{
                color: "#FFFFFF",
              }}
            >
              Shop Now
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * ============================================================================
 * THEME SCREEN
 * ============================================================================
 */

export default function StoreThemeScreen() {
  /**
   * --------------------------------------------------------------------------
   * ROUTE PARAMETER
   * --------------------------------------------------------------------------
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const storeId = Number(id);

  /**
   * --------------------------------------------------------------------------
   * STORE
   * --------------------------------------------------------------------------
   */

  const { store, isLoading, error } = useStore({
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
   * SELECTED THEME
   * --------------------------------------------------------------------------
   */

  const [selectedTheme, setSelectedTheme] = useState("");

  /**
   * --------------------------------------------------------------------------
   * INVALID STORE ID
   * --------------------------------------------------------------------------
   */

  if (!Number.isFinite(storeId)) {
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
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.icon.error.icon}
          />

          <AppText
            variant="h3"
            style={{
              marginTop: spacing.md,
              textAlign: "center",
            }}
          >
            Invalid Store
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,
              textAlign: "center",
            }}
          >
            We couldn't determine which storefront you want to customise.
          </AppText>

          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={{
              marginTop: spacing.lg,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * LOADING
   * --------------------------------------------------------------------------
   */

  if (isLoading) {
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={theme.icon.branding.icon} />

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.md,
            }}
          >
            Loading store...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * ERROR / STORE NOT FOUND
   * --------------------------------------------------------------------------
   *
   * Create a local constant after the guard.
   *
   * This gives TypeScript a permanently narrowed Store value for the
   * remainder of this render.
   */

  if (error || !store) {
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
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.icon.error.icon}
          />

          <AppText
            variant="h3"
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
              marginTop: spacing.sm,
              textAlign: "center",
            }}
          >
            We couldn't load this storefront. Please try again.
          </AppText>

          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={{
              marginTop: spacing.lg,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * STABLE STORE REFERENCE
   * --------------------------------------------------------------------------
   *
   * TypeScript can safely treat this as a Store because the guard above has
   * already established that store exists.
   */

  const currentStore = store;

  /**
   * --------------------------------------------------------------------------
   * CURRENT THEME
   * --------------------------------------------------------------------------
   */

  const currentTheme =
    selectedTheme ||
    currentStore.themeColor ||
    THEME_OPTIONS[0]?.value ||
    "#4CAF50";

  /**
   * --------------------------------------------------------------------------
   * UPDATE STORE
   * --------------------------------------------------------------------------
   */

  function handleSave() {
    const payload: UpdateStoreRequest = {
      id: currentStore.storeId,

      storeName: currentStore.storeName,

      currency: currentStore.currency,

      storeReference: currentStore.storeReference,

      storeLink: currentStore.storeLink,

      isActive: currentStore.isActive,

      themeColor: currentTheme,

      welcomeMessage: currentStore.welcomeMessage || undefined,

      description: currentStore.description || undefined,

      callBackUrl: currentStore.callBackUrl || undefined,

      successMessage: currentStore.successMessage || undefined,

      whatsAppNumber: currentStore.whatsAppNumber || undefined,

      phoneNumber: currentStore.phoneNumber || undefined,

      email: currentStore.email || undefined,

      instagram: currentStore.instagram || undefined,

      facebook: currentStore.facebook || undefined,

      twitter: currentStore.twitter || undefined,

      storeProducts: currentStore.products ?? [],

      storeDiscounts: currentStore.discounts ?? [],

      storeShippingRegion: [],
    };

    updateStoreMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.responseCode !== "00") {
          Alert.alert(
            "Unable to update theme",
            response.responseMessage ||
              "Something went wrong while updating your storefront."
          );

          return;
        }

        Alert.alert(
          "Theme updated",
          "Your storefront theme has been updated successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ]
        );
      },

      onError: (mutationError) => {
        console.error("Unable to update storefront theme:", mutationError);

        Alert.alert(
          "Update failed",
          "We couldn't update your storefront theme. Please try again."
        );
      },
    });
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

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
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

          <View
            style={{
              flex: 1,
            }}
          >
            <AppText variant="h1">Theme</AppText>

            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.xs,
              }}
            >
              Choose a colour for your storefront
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* ================================================================== */}
        {/* STORE */}
        {/* ================================================================== */}

        <Card
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="bodyBold">{currentStore.storeName}</AppText>

          <AppText
            variant="bodySmall"
            color="secondary"
            style={{
              marginTop: spacing.xs,
            }}
          >
            Select the primary colour customers will see on your storefront.
          </AppText>
        </Card>

        {/* ================================================================== */}
        {/* THEME OPTIONS */}
        {/* ================================================================== */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="h3">Colours</AppText>

          <Card
            style={{
              paddingVertical: 0,
              marginTop: spacing.md,
            }}
          >
            <RadioGroup
              value={currentTheme}
              options={THEME_OPTIONS}
              onChange={setSelectedTheme}
            />
          </Card>
        </View>

        {/* ================================================================== */}
        {/* PREVIEW */}
        {/* ================================================================== */}

        <ThemePreview color={currentTheme} />

        {/* ================================================================== */}
        {/* SELECTED THEME */}
        {/* ================================================================== */}

        <View
          style={{
            marginTop: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.full,
              backgroundColor: currentTheme,
              borderWidth: 1,
              borderColor: theme.border.default,
            }}
          />

          <View
            style={{
              flex: 1,
            }}
          >
            <AppText variant="bodyBold">Selected theme</AppText>

            <AppText variant="bodySmall" color="secondary">
              {currentTheme}
            </AppText>
          </View>
        </View>
      </ScrollView>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}

      <Divider />

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          backgroundColor: theme.background.primary,
        }}
      >
        <Button
          title={updateStoreMutation.isPending ? "Saving..." : "Save Theme"}
          disabled={updateStoreMutation.isPending}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}
