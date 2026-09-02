import { Alert, Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { useDiscounts } from "@/hooks/discounts/useDiscounts";
import { useUpdateDiscountStatus } from "@/hooks/discounts/useUpdateDiscountStatus";
import { useDeleteDiscount } from "@/hooks/discounts/useDeleteDiscount";
import { useToast } from "@/hooks/useToast";

import { spacing, theme, radius } from "@/theme";

export default function DiscountDetailsScreen() {
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
   * DISCOUNTS
   * ==========================================================================
   */

  const { data: discounts, isLoading, isError } = useDiscounts();

  /**
   * ==========================================================================
   * MUTATIONS
   * ==========================================================================
   */

  const updateStatusMutation = useUpdateDiscountStatus();

  const deleteDiscountMutation = useDeleteDiscount();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * DISCOUNT
   * ==========================================================================
   */

  const discount = discounts.find((item) => item.id === id);

  /**
   * ==========================================================================
   * HELPERS
   * ==========================================================================
   */

  function formatDate(date?: string): string {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatUsageLimit(): string {
    if (discount?.numberOfTimes === undefined) {
      return "Unlimited";
    }

    return String(discount.numberOfTimes);
  }

  /**
   * ==========================================================================
   * TOGGLE STATUS
   * ==========================================================================
   */

  async function handleToggleStatus() {
    if (!discount) {
      return;
    }

    const nextStatus = !discount.isActive;

    try {
      await updateStatusMutation.mutateAsync({
        discountId: discount.id,
        status: nextStatus,
      });

      showToast({
        type: "success",
        title: nextStatus ? "Discount Activated" : "Discount Deactivated",
        message: `${discount.code} is now ${
          nextStatus ? "active" : "inactive"
        }.`,
      });
    } catch (error) {
      console.log("UPDATE DISCOUNT STATUS ERROR", error);

      showToast({
        type: "error",
        title: "Unable to Update Discount",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  /**
   * ==========================================================================
   * DELETE
   * ==========================================================================
   */

  function handleDelete() {
    if (!discount) {
      return;
    }

    Alert.alert(
      "Delete Discount",
      `Are you sure you want to delete ${discount.code}? This action cannot be undone.`,
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
              await deleteDiscountMutation.mutateAsync(discount.id);

              showToast({
                type: "success",
                title: "Discount Deleted",
                message: `${discount.code} has been deleted.`,
              });

              router.back();
            } catch (error) {
              console.log("DELETE DISCOUNT ERROR", error);

              showToast({
                type: "error",
                title: "Unable to Delete Discount",
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
          <AppText variant="body" color="secondary">
            Loading discount...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * NOT FOUND
   * ==========================================================================
   */

  if (isError || !discount) {
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
              Discount
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
              name="pricetag-outline"
              size={48}
              color={theme.icon.default.icon}
            />

            <AppText
              variant="bodyLargeBold"
              color="strong"
              style={{
                marginTop: spacing.md,
              }}
            >
              Discount not found
            </AppText>

            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.xs,
                textAlign: "center",
              }}
            >
              This discount code may have been deleted or is no longer
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
            <AppText variant="h1">Discount Details</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage your promotional discount.
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
              DISCOUNT OVERVIEW
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
                  name="pricetag-outline"
                  size={32}
                  color={theme.icon.accent.icon}
                />
              </View>

              {/* CODE */}

              <AppText
                variant="h1"
                color="strong"
                style={{
                  marginTop: spacing.md,
                  textTransform: "uppercase",
                }}
              >
                {discount.code}
              </AppText>

              {/* STATUS */}

              <View
                style={{
                  marginTop: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: radius.full,
                  backgroundColor: discount.isActive
                    ? theme.background.success
                    : theme.background.error,
                }}
              >
                <AppText
                  variant="bodySmallBold"
                  style={{
                    color: discount.isActive
                      ? theme.text.success
                      : theme.text.error,
                  }}
                >
                  {discount.isActive ? "Active" : "Inactive"}
                </AppText>
              </View>
            </View>
          </Card>

          {/* ==================================================================
              DISCOUNT INFORMATION
          ================================================================== */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <AppText variant="h2" color="strong">
              Discount Information
            </AppText>

            <View
              style={{
                marginTop: spacing.lg,
                gap: spacing.md,
              }}
            >
              {/* VALUE */}

              <View>
                <AppText variant="bodySmall" color="muted">
                  Discount Value
                </AppText>

                <AppText
                  variant="body"
                  color="strong"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {discount.discountValue}
                </AppText>
              </View>

              {/* USAGE */}

              <View>
                <AppText variant="bodySmall" color="muted">
                  Number of Uses
                </AppText>

                <AppText
                  variant="body"
                  color="strong"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {formatUsageLimit()}
                </AppText>
              </View>

              {/* CUSTOMER LIMIT */}

              <View>
                <AppText variant="bodySmall" color="muted">
                  One Use Per Customer
                </AppText>

                <AppText
                  variant="body"
                  color="strong"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {discount.limitCodeToOneCustomer ? "Yes" : "No"}
                </AppText>
              </View>
            </View>
          </Card>

          {/* ==================================================================
              VALIDITY
          ================================================================== */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <AppText variant="h2" color="strong">
              Validity
            </AppText>

            <View
              style={{
                marginTop: spacing.lg,
                gap: spacing.md,
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
                    flex: 1,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Start Date
                  </AppText>

                  <AppText
                    variant="body"
                    color="strong"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    {formatDate(discount.startDate)}
                  </AppText>
                </View>

                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={theme.icon.default.icon}
                />
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: theme.divider.subtle,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    End Date
                  </AppText>

                  <AppText
                    variant="body"
                    color="strong"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    {formatDate(discount.endDate)}
                  </AppText>
                </View>

                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={theme.icon.default.icon}
                />
              </View>
            </View>
          </Card>

          {/* ==================================================================
              STATUS ACTION
          ================================================================== */}

          <Card
            style={{
              marginTop: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="bodyBold" color="strong">
                  Discount Status
                </AppText>

                <AppText
                  variant="bodySmall"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {discount.isActive
                    ? "Customers can currently use this discount."
                    : "Customers cannot currently use this discount."}
                </AppText>
              </View>

              <Pressable
                accessibilityRole="switch"
                accessibilityState={{
                  checked: discount.isActive,
                  disabled: updateStatusMutation.isPending,
                }}
                disabled={updateStatusMutation.isPending}
                onPress={handleToggleStatus}
                style={{
                  width: 52,
                  height: 32,
                  borderRadius: radius.full,
                  padding: 3,
                  justifyContent: "center",
                  backgroundColor: discount.isActive
                    ? theme.toggleSwitch.active
                    : theme.toggleSwitch.inactive,
                }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: radius.full,
                    backgroundColor: theme.background.surface,
                    alignSelf: discount.isActive ? "flex-end" : "flex-start",
                  }}
                />
              </Pressable>
            </View>
          </Card>

          {/* ==================================================================
              ACTIONS
          ================================================================== */}

          {/* <Button
            title="Edit Discount"
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
              // TODO: Navigate to edit discount screen.
            }}
          /> */}

          {/* <Button
            title={
              discount.isActive ? "Deactivate Discount" : "Activate Discount"
            }
            variant="tertiary"
            loading={updateStatusMutation.isPending}
            style={{
              marginTop: spacing.md,
            }}
            onPress={handleToggleStatus}
          /> */}

          <Button
            title="Delete Discount"
            variant="tertiaryDestructive"
            loading={deleteDiscountMutation.isPending}
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
