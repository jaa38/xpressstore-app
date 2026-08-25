import { Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";

import { useDiscounts } from "@/hooks/discounts/useDiscounts";

import { spacing, theme, radius } from "@/theme";

export default function DiscountCodesScreen() {
  /**
   * ==========================================================================
   * DISCOUNTS
   * ==========================================================================
   */

  const {
    data: discounts,
    isLoading,
    isFetching,
    isError,
    error,
  } = useDiscounts();

  /**
   * ==========================================================================
   * SUMMARY
   * ==========================================================================
   */

  const totalDiscounts = discounts.length;

  const activeDiscounts = discounts.filter(
    (discount) => discount.isActive
  ).length;

  const inactiveDiscounts = totalDiscounts - activeDiscounts;

  /**
   * ==========================================================================
   * HELPERS
   * ==========================================================================
   */

  function formatDate(date?: string): string {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function handleCreateDiscount() {
    router.push("/discount-codes/add");
  }

  function handleOpenDiscount(discountId: string) {
    router.push({
      pathname: "/discount-codes/view/[id]",
      params: {
        id: discountId,
      },
    });
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
        <View
          style={{
            flex: 1,
          }}
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
            {/* BACK BUTTON */}

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

            {/* TITLE + SUBTITLE */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Discount Codes</AppText>

              <AppText variant="body" color="secondary">
                Create and manage promotional discount codes.
              </AppText>
            </View>

            {/* ADD */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create discount code"
              hitSlop={8}
              onPress={handleCreateDiscount}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: pressed
                  ? theme.action.primary.pressed
                  : theme.action.primary.background,
              })}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* ==================================================================
              CONTENT
          ================================================================== */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: spacing["2xl"],
            }}
          >
            {/* ==================================================================
                SUMMARY
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
                }}
              >
                {/* TOTAL */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Total
                  </AppText>

                  <AppText variant="h2" color="strong">
                    {totalDiscounts}
                  </AppText>
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    width: 1,
                    height: 40,
                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* ACTIVE */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Active
                  </AppText>

                  <AppText variant="h2" color="success">
                    {activeDiscounts}
                  </AppText>
                </View>

                {/* DIVIDER */}

                <View
                  style={{
                    width: 1,
                    height: 40,
                    backgroundColor: theme.divider.strong,
                  }}
                />

                {/* INACTIVE */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmallBold" color="muted">
                    Inactive
                  </AppText>

                  <AppText variant="h2" color="error">
                    {inactiveDiscounts}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==================================================================
                LOADING
            ================================================================== */}

            {isLoading && (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: spacing["2xl"],
                }}
              >
                <AppText variant="body" color="secondary">
                  Loading discount codes...
                </AppText>
              </View>
            )}

            {/* ==================================================================
                ERROR
            ================================================================== */}

            {!isLoading && isError && (
              <Card
                style={{
                  marginTop: spacing.md,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={32}
                    color={theme.icon.error.icon}
                  />

                  <AppText variant="bodyLargeBold" color="strong">
                    Unable to load discount codes
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {error instanceof Error
                      ? error.message
                      : "Please try again."}
                  </AppText>
                </View>
              </Card>
            )}

            {/* ==================================================================
                DISCOUNT LIST
            ================================================================== */}

            {!isLoading && !isError && discounts.length > 0 && (
              <View
                style={{
                  marginTop: spacing.md,
                  gap: spacing.md,
                }}
              >
                {discounts.map((discount) => (
                  <Pressable
                    key={discount.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${discount.code} discount`}
                    onPress={() => handleOpenDiscount(discount.id)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Card>
                      {/* ------------------------------------------------------
                          DISCOUNT HEADER
                      ------------------------------------------------------ */}

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: spacing.md,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <AppText
                            variant="bodyLargeBold"
                            color="strong"
                            style={{
                              textTransform: "uppercase",
                            }}
                          >
                            {discount.code}
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            style={{
                              marginTop: spacing.xs,
                            }}
                          >
                            Discount value: {discount.discountValue}
                          </AppText>
                        </View>

                        {/* STATUS */}

                        <View
                          style={{
                            paddingHorizontal: spacing.sm,
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

                      {/* ------------------------------------------------------
                          DIVIDER
                      ------------------------------------------------------ */}

                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.divider.subtle,
                          marginVertical: spacing.md,
                        }}
                      />

                      {/* ------------------------------------------------------
                          DATE INFORMATION
                      ------------------------------------------------------ */}

                      <View
                        style={{
                          gap: spacing.xs,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <AppText variant="bodySmall" color="muted">
                            Start
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            style={{
                              marginLeft: "auto",
                            }}
                          >
                            {formatDate(discount.startDate)}
                          </AppText>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <AppText variant="bodySmall" color="muted">
                            End
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                            style={{
                              marginLeft: "auto",
                            }}
                          >
                            {formatDate(discount.endDate)}
                          </AppText>
                        </View>
                      </View>

                      {/* ------------------------------------------------------
                          FOOTER
                      ------------------------------------------------------ */}

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: spacing.md,
                        }}
                      >
                        <AppText variant="bodySmall" color="link">
                          View discount
                        </AppText>

                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={theme.text.link}
                          style={{
                            marginLeft: "auto",
                          }}
                        />
                      </View>
                    </Card>
                  </Pressable>
                ))}
              </View>
            )}

            {/* ==================================================================
                EMPTY STATE
            ================================================================== */}

            {!isLoading && !isError && discounts.length === 0 && (
              <Card
                style={{
                  marginTop: spacing.md,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.md,
                    gap: spacing.sm,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: radius.full,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: theme.background.accent,
                    }}
                  >
                    <Ionicons
                      name="pricetag-outline"
                      size={28}
                      color={theme.icon.accent.icon}
                    />
                  </View>

                  <AppText variant="bodyLargeBold" color="strong">
                    No discount codes
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Create your first discount code to start offering
                    promotions.
                  </AppText>
                </View>
              </Card>
            )}

            {/* ==================================================================
                FETCHING
            ================================================================== */}

            {isFetching && !isLoading && (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: spacing.md,
                }}
              >
                <AppText variant="bodySmall" color="muted">
                  Updating...
                </AppText>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
