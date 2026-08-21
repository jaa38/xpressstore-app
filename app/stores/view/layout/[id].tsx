import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";

import { spacing, radius, theme } from "@/theme";

import { useStore } from "@/hooks/store/useStore";
import { useStoreLayout } from "@/hooks/store/useStoreLayout";

import type { StoreLayout } from "@/types/store";

/**
 * ============================================================================
 * LAYOUT OPTIONS
 * ============================================================================
 */

interface LayoutOption {
  value: StoreLayout;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    value: "grid",
    title: "Grid view",
    description: "Display products in a two-column grid.",
    icon: "grid-outline",
  },
  {
    value: "list",
    title: "List view",
    description: "Display products in a vertical list.",
    icon: "list-outline",
  },
];

/**
 * ============================================================================
 * STORE LAYOUT SCREEN
 * ============================================================================
 */

export default function StoreLayoutScreen() {
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

  const { store, isLoading, error, refetch } = useStore({
    storeId,
  });

  /**
   * --------------------------------------------------------------------------
   * LAYOUT MUTATION
   * --------------------------------------------------------------------------
   */

  const updateLayoutMutation = useStoreLayout();

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
            color={theme.state.error.text}
          />

          <AppText
            variant="h2"
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
            We couldn't determine which storefront you want to configure.
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
          <ActivityIndicator
            size="large"
            color={theme.button.primary.background}
          />

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.md,
            }}
          >
            Loading layout settings...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * ERROR / STORE NOT FOUND
   * --------------------------------------------------------------------------
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
            name="cloud-offline-outline"
            size={48}
            color={theme.state.error.text}
          />

          <AppText
            variant="h2"
            style={{
              marginTop: spacing.md,
              textAlign: "center",
            }}
          >
            Unable to Load Store
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,
              textAlign: "center",
            }}
          >
            We couldn't load this storefront's layout settings.
          </AppText>

          <Button
            title="Try Again"
            onPress={() => refetch()}
            style={{
              marginTop: spacing.lg,
            }}
          />

          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: spacing.md,
            }}
          >
            <AppText color="link">Go Back</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * --------------------------------------------------------------------------
   * SELECT LAYOUT
   * --------------------------------------------------------------------------
   */

  function handleSelectLayout(layout: StoreLayout) {
    if (!store) {
      return;
    }

    if (layout === store.layout) {
      return;
    }

    updateLayoutMutation.mutate(
      {
        storeId,
        layout,
      },
      {
        onError: (mutationError) => {
          console.error("Unable to update store layout:", mutationError);

          Alert.alert(
            "Unable to update layout",
            "We couldn't save your layout preference. Please try again."
          );
        },
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * SCREEN
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
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.border.default,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          hitSlop={10}
          style={{
            marginRight: spacing.md,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.icon.default.icon}
          />
        </Pressable>

        <AppText variant="h2">Layout</AppText>
      </View>

      {/* ================================================================== */}
      {/* CONTENT */}
      {/* ================================================================== */}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------------------------------------------------------- */}
        {/* TITLE */}
        {/* ---------------------------------------------------------------- */}

        <AppText variant="h1">Store Layout</AppText>

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.xs,
          }}
        >
          Choose how products are displayed in your storefront.
        </AppText>

        {/* ---------------------------------------------------------------- */}
        {/* STORE */}
        {/* ---------------------------------------------------------------- */}

        <Card
          style={{
            marginTop: spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: theme.background.brand,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="storefront-outline"
                size={22}
                color={theme.icon.branding.icon}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: spacing.md,
              }}
            >
              <AppText variant="bodyBold">{store.storeName}</AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                {store.storeReference}
              </AppText>
            </View>
          </View>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* PRODUCT DISPLAY */}
        {/* ---------------------------------------------------------------- */}

        <AppText
          variant="bodyBold"
          style={{
            marginTop: spacing.xl,
            marginBottom: spacing.sm,
          }}
        >
          Product Display
        </AppText>

        <Card
          style={{
            paddingVertical: 0,
          }}
        >
          {LAYOUT_OPTIONS.map((option, index) => {
            const selected = store.layout === option.value;

            return (
              <View key={option.value}>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: selected,
                  }}
                  accessibilityLabel={`${option.title}. ${option.description}`}
                  onPress={() => handleSelectLayout(option.value)}
                  disabled={updateLayoutMutation.isPending}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: spacing.md,
                    opacity: pressed
                      ? 0.6
                      : updateLayoutMutation.isPending && !selected
                        ? 0.5
                        : 1,
                  })}
                >
                  {/* ICON */}

                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: radius.md,
                      backgroundColor: selected
                        ? theme.background.brand
                        : theme.background.subtle,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={
                        selected
                          ? theme.icon.branding.icon
                          : theme.icon.default.icon
                      }
                    />
                  </View>

                  {/* TEXT */}

                  <View
                    style={{
                      flex: 1,
                      marginLeft: spacing.md,
                      paddingRight: spacing.md,
                    }}
                  >
                    <AppText variant="bodyBold">{option.title}</AppText>

                    <AppText
                      variant="bodySmall"
                      color="secondary"
                      style={{
                        marginTop: spacing.xs,
                      }}
                    >
                      {option.description}
                    </AppText>
                  </View>

                  {/* RADIO */}

                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: selected
                        ? theme.button.primary.background
                        : theme.border.default,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: theme.button.primary.background,
                        }}
                      />
                    )}
                  </View>
                </Pressable>

                {index < LAYOUT_OPTIONS.length - 1 && <Divider />}
              </View>
            );
          })}
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* CURRENT VALUE */}
        {/* ---------------------------------------------------------------- */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: spacing.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            backgroundColor: theme.background.subtle,
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.icon.default.icon}
          />

          <AppText
            variant="bodySmall"
            color="secondary"
            style={{
              flex: 1,
              marginLeft: spacing.sm,
            }}
          >
            Current layout:{" "}
            {store.layout === "list" ? "List view" : "Grid view"}
          </AppText>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* SAVING */}
        {/* ---------------------------------------------------------------- */}

        {updateLayoutMutation.isPending && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: spacing.lg,
            }}
          >
            <ActivityIndicator
              size="small"
              color={theme.button.primary.background}
            />

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                marginLeft: spacing.sm,
              }}
            >
              Saving layout...
            </AppText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
