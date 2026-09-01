import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { useShippingRegions } from "@/hooks/store/useShippingRegions";
import { useDeleteShippingRegion } from "@/hooks/store/useDeleteShippingRegion";

import { useToast } from "@/hooks/useToast";

import { spacing, theme, radius } from "@/theme";

export default function ShippingRegionDetailsScreen() {
  /**
   * ==========================================================================
   * ROUTE PARAMS
   * ==========================================================================
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  /**
   * ==========================================================================
   * SHIPPING REGIONS
   * ==========================================================================
   *
   * The hook decides whether the data comes from:
   *
   * - mock data
   * - API
   * - local cache
   *
   * The screen remains independent of that implementation detail.
   * ==========================================================================
   */

  const { shippingRegions, isLoading, error } = useShippingRegions();

  /**
   * ==========================================================================
   * MUTATIONS
   * ==========================================================================
   */

  const deleteShippingRegionMutation = useDeleteShippingRegion();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * SHIPPING REGION
   * ==========================================================================
   */

  const shippingRegion = shippingRegions.find(
    (item) => String(item.id) === String(id)
  );

  /**
   * ==========================================================================
   * FORMAT SHIPPING FEE
   * ==========================================================================
   */

  function formatShippingFee(shippingFee: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(shippingFee);
  }

  /**
   * ==========================================================================
   * DELETE SHIPPING REGION
   * ==========================================================================
   */

  function handleDelete() {
    if (!shippingRegion) {
      return;
    }

    if (deleteShippingRegionMutation.isPending) {
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
              await deleteShippingRegionMutation.mutateAsync(shippingRegion.id);

              showToast({
                type: "success",
                title: "Shipping Region Deleted",
                message: `${shippingRegion.region} has been deleted.`,
              });

              router.back();
            } catch (error) {
              console.log("DELETE SHIPPING REGION ERROR", error);

              showToast({
                type: "error",
                title: "Unable to Delete Shipping Region",
                message:
                  error instanceof Error ? error.message : "Please try again.",
              });
            }
          },
        },
      ]
    );
  }

  /**
   * ==========================================================================
   * LOADING
   * ==========================================================================
   */

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
        edges={["top"]}
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
          <ActivityIndicator size="large" color={theme.icon.branding.icon} />

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.md,
            }}
          >
            Loading shipping region...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * NOT FOUND / ERROR
   * ==========================================================================
   */

  if (error || !shippingRegion) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
        edges={["top"]}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.lg,
          }}
        >
          {/* HEADER */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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

            <AppText
              variant="h1"
              style={{
                marginLeft: spacing.sm,
              }}
            >
              Shipping Region
            </AppText>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: spacing.lg,
            }}
          >
            <Ionicons
              name="location-outline"
              size={48}
              color={theme.icon.default.icon}
            />

            <AppText
              variant="bodyLargeBold"
              color="strong"
              style={{
                marginTop: spacing.md,
                textAlign: "center",
              }}
            >
              Shipping region not found
            </AppText>

            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.xs,
                textAlign: "center",
                maxWidth: 320,
              }}
            >
              This shipping region may have been deleted or is no longer
              available.
            </AppText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * SCREEN
   * ==========================================================================
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* ====================================================================
            HEADER
        ==================================================================== */}

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
            }}
          >
            <AppText variant="h1">Shipping Region Details</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage your delivery region and fee.
            </AppText>
          </View>
        </View>

        {/* ====================================================================
            CONTENT
        ==================================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing["2xl"],
          }}
        >
          {/* ==================================================================
              SHIPPING REGION OVERVIEW
          ================================================================== */}

          <Card>
            <View
              style={{
                alignItems: "center",
              }}
            >
              {/* ICON */}

              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.background.accent,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={32}
                  color={theme.icon.accent.icon}
                />
              </View>

              {/* REGION */}

              <AppText
                variant="h1"
                color="strong"
                style={{
                  marginTop: spacing.md,
                  textAlign: "center",
                }}
              >
                {shippingRegion.region}
              </AppText>

              {/* STATE */}

              <AppText
                variant="body"
                color="secondary"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                {shippingRegion.state}
              </AppText>
            </View>
          </Card>

          {/* ==================================================================
              SHIPPING INFORMATION
          ================================================================== */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <AppText variant="h2" color="strong">
              Shipping Information
            </AppText>

            <View
              style={{
                marginTop: spacing.lg,
                gap: spacing.md,
              }}
            >
              {/* REGION */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.subtle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Region
                  </AppText>

                  <AppText
                    variant="body"
                    color="strong"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    {shippingRegion.region}
                  </AppText>
                </View>
              </View>

              {/* DIVIDER */}

              <View
                style={{
                  height: 1,
                  backgroundColor: theme.divider.subtle,
                }}
              />

              {/* STATE */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.subtle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    State
                  </AppText>

                  <AppText
                    variant="body"
                    color="strong"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    {shippingRegion.state}
                  </AppText>
                </View>
              </View>

              {/* DIVIDER */}

              <View
                style={{
                  height: 1,
                  backgroundColor: theme.divider.subtle,
                }}
              />

              {/* SHIPPING FEE */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.subtle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={theme.icon.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Shipping Fee
                  </AppText>

                  <AppText
                    variant="body"
                    color="strong"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    {formatShippingFee(shippingRegion.shippingFee)}
                  </AppText>
                </View>
              </View>
            </View>
          </Card>

          {/* ==================================================================
              SUPPORTING INFORMATION
          ================================================================== */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: spacing.sm,
              marginTop: spacing.lg,
              padding: spacing.md,
              borderRadius: 12,
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
              }}
            >
              Customers whose delivery location matches this region will be
              charged the shipping fee shown above.
            </AppText>
          </View>

          {/* ==================================================================
              EDIT
          ================================================================== */}

          {/* <Button
            title="Edit Shipping Region"
            variant="primary"
            leftIcon={
              <Ionicons
                name="create-outline"
                size={20}
                color={theme.action.primary.text}
              />
            }
            style={{
              marginTop: spacing.xl,
            }}
            onPress={() => {
              // Edit screen will be wired here.
            }}
          /> */}

          {/* ==================================================================
              DELETE
          ================================================================== */}

          <Button
            title="Delete Shipping Region"
            variant="tertiaryDestructive"
            loading={deleteShippingRegionMutation.isPending}
            disabled={deleteShippingRegionMutation.isPending}
            leftIcon={
              <Ionicons
                name="trash-outline"
                size={20}
                color={theme.action.tertiaryDestructive.text}
              />
            }
            style={{
              marginTop: spacing.md,
            }}
            onPress={handleDelete}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
