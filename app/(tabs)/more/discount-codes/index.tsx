import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";

import { useDiscounts } from "@/hooks/discounts/useDiscounts";

import { spacing, theme, radius } from "@/theme";

export default function DiscountCodesScreen() {
  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * ==========================================================================
   * DISCOUNTS
   * ==========================================================================
   */

  const {
    data: discounts = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
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
   * SCREEN STATE
   * ==========================================================================
   *
   * Architecture:
   *
   * 1. Initial loading
   * 2. First-time user
   * 3. Error after discount codes already exist
   * 4. Search empty
   * 5. Discount code list
   *
   * IMPORTANT:
   *
   * A merchant with no discount codes should see the friendly
   * first-time empty state rather than a technical API error.
   */

  const hasDiscounts = discounts.length > 0;

  const isFirstTimeUser =
    !isLoading && !hasDiscounts && searchQuery.trim() === "";

  const showDiscountError = !isLoading && isError && hasDiscounts;

  /**
   * ==========================================================================
   * SEARCH
   * ==========================================================================
   */

  const filteredDiscounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return discounts;
    }

    return discounts.filter((discount) =>
      discount.code.toLowerCase().includes(query)
    );
  }, [discounts, searchQuery]);

  const hasNoSearchResults =
    !isLoading &&
    !showDiscountError &&
    hasDiscounts &&
    searchQuery.trim() !== "" &&
    filteredDiscounts.length === 0;

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

  async function onRefresh() {
    await refetch();
  }

  function clearSearch() {
    setSearchQuery("");
  }

  /**
   * ==========================================================================
   * HEADER
   * ==========================================================================
   */

  const headerSubtitle = isLoading
    ? "Loading discount codes..."
    : isFirstTimeUser
      ? "Start creating promotional offers."
      : totalDiscounts === 1
        ? "1 discount code"
        : `${totalDiscounts} discount codes`;

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
                {headerSubtitle}
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

          <View
            style={{
              flex: 1,
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
                    {isLoading ? "—" : totalDiscounts}
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
                    {isLoading ? "—" : activeDiscounts}
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
                    {isLoading ? "—" : inactiveDiscounts}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==================================================================
                SEARCH
            ================================================================== */}

            {!isFirstTimeUser && !showDiscountError && (
              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search discount codes"
                />
              </View>
            )}

            {/* ==================================================================
                DISCOUNT CONTENT
            ================================================================== */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: spacing["2xl"],
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isFetching}
                    onRefresh={onRefresh}
                    tintColor={theme.icon.branding.icon}
                    colors={[theme.icon.branding.icon]}
                    progressBackgroundColor={theme.background.surface}
                  />
                }
              >
                {/* ============================================================
                    1. LOADING
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
                      Loading discount codes...
                    </AppText>
                  </View>
                ) : isFirstTimeUser ? (
                  /* ==========================================================
                     2. FIRST-TIME USER
                  ========================================================== */

                  <View
                    style={{
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
                          width: 64,
                          height: 64,
                          borderRadius: radius.full,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: theme.icon.branding.background,
                        }}
                      >
                        <Ionicons
                          name="pricetag-outline"
                          size={32}
                          color={theme.icon.branding.icon}
                        />
                      </View>

                      {/* TITLE */}

                      <AppText
                        variant="bodyLargeBold"
                        color="strong"
                        style={{
                          marginTop: spacing.md,
                          textAlign: "center",
                        }}
                      >
                        No discount codes yet
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
                        Create discount codes to offer promotions and encourage
                        customers to buy from your store.
                      </AppText>

                      {/* CTA */}

                      <Button
                        title="Create Discount Code"
                        variant="primary"
                        leftIcon={
                          <Ionicons
                            name="add"
                            size={20}
                            color={theme.action.primary.text}
                          />
                        }
                        style={{
                          marginTop: spacing.lg,
                        }}
                        onPress={handleCreateDiscount}
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
                        You can manage your discount code after creating it.
                      </AppText>
                    </Card>
                  </View>
                ) : showDiscountError ? (
                  /* ==========================================================
                     3. ERROR
                  ========================================================== */

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: spacing.lg,
                    }}
                  >
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

                    <AppText
                      variant="bodyLargeBold"
                      style={{
                        marginTop: spacing.md,
                        textAlign: "center",
                      }}
                    >
                      Unable to load discount codes
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
                      We couldn't load your discount codes. Please try again.
                    </AppText>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Try again"
                      onPress={() => refetch()}
                      style={{
                        marginTop: spacing.md,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.sm,
                      }}
                    >
                      <AppText color="link">Try Again</AppText>
                    </Pressable>
                  </View>
                ) : hasNoSearchResults ? (
                  /* ==========================================================
                     4. SEARCH EMPTY
                  ========================================================== */

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

                      <AppText
                        variant="bodyLargeBold"
                        style={{
                          marginTop: spacing.md,
                          textAlign: "center",
                        }}
                      >
                        No discount codes found
                      </AppText>

                      <AppText
                        variant="body"
                        color="secondary"
                        style={{
                          marginTop: spacing.xs,
                          textAlign: "center",
                        }}
                      >
                        Try searching with a different discount code.
                      </AppText>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Clear discount code search"
                        onPress={clearSearch}
                        style={{
                          marginTop: spacing.md,
                        }}
                      >
                        <AppText color="link">Clear Search</AppText>
                      </Pressable>
                    </Card>
                  </View>
                ) : (
                  /* ==========================================================
                     5. DISCOUNT CODE LIST
                  ========================================================== */

                  <View
                    style={{
                      gap: spacing.md,
                    }}
                  >
                    {filteredDiscounts.map((discount) => (
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
                          {/* --------------------------------------------------
                              DISCOUNT HEADER
                          -------------------------------------------------- */}

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

                          {/* --------------------------------------------------
                              DIVIDER
                          -------------------------------------------------- */}

                          <View
                            style={{
                              height: 1,
                              backgroundColor: theme.divider.subtle,
                              marginVertical: spacing.md,
                            }}
                          />

                          {/* --------------------------------------------------
                              DATE INFORMATION
                          -------------------------------------------------- */}

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

                          {/* --------------------------------------------------
                              FOOTER
                          -------------------------------------------------- */}

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
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
