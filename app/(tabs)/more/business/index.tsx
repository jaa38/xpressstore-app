import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { Card } from "@/components/ui/Card";

import { Divider } from "@/components/ui/Divider";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

import { useSettlementAccounts } from "@/hooks/merchant/useSettlementAccounts";

/**
 * ============================================================================
 * BUSINESS SCREEN
 * ============================================================================
 */

export default function BusinessScreen() {
  /**
   * --------------------------------------------------------------------------
   * MERCHANT PROFILE
   * --------------------------------------------------------------------------
   */

  const {
    profile,

    isLoading: isProfileLoading,

    error: profileError,

    refetch: refetchProfile,
  } = useMerchantProfile();

  /**
   * --------------------------------------------------------------------------
   * SETTLEMENT ACCOUNTS
   * --------------------------------------------------------------------------
   */

  const {
    settlementAccounts,

    isLoading: isSettlementAccountsLoading,

    isError: isSettlementAccountsError,

    refetch: refetchSettlementAccounts,
  } = useSettlementAccounts();

  /**
   * --------------------------------------------------------------------------
   * REFRESHING STATE
   * --------------------------------------------------------------------------
   */

  const isLoading =
    isProfileLoading || isSettlementAccountsLoading;

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  async function handleRefresh() {
    await Promise.all([
      refetchProfile(),

      refetchSettlementAccounts(),
    ]);
  }

  /**
   * --------------------------------------------------------------------------
   * PRIMARY SETTLEMENT ACCOUNT
   * --------------------------------------------------------------------------
   */

  const primarySettlementAccount =
    settlementAccounts?.find(
      (account) => account.isDefault
    ) ??
    settlementAccounts?.[0];

  /**
   * --------------------------------------------------------------------------
   * BUSINESS TYPE LABEL
   * --------------------------------------------------------------------------
   */

  const businessType =
    profile?.businessType ||
    "Not specified";

  /**
   * ==========================================================================
   * LOADING
   * ==========================================================================
   */

  if (isLoading && !profile) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor:
            theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            gap: spacing.md,
          }}
        >
          <ActivityIndicator
            size="large"
            color={theme.icon.branding.icon}
          />

          <AppText
            variant="body"
            color="secondary"
          >
            Loading business information...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * ERROR
   * ==========================================================================
   */

  if (profileError && !profile) {
    return (
      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor:
            theme.background.primary,
        }}
      >
        <StatusBar style="auto" />

        <View
          style={{
            flex: 1,

            paddingHorizontal:
              spacing.lg,

            justifyContent: "center",

            alignItems: "center",

            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: 56,

              height: 56,

              borderRadius:
                radius.full,

              justifyContent:
                "center",

              alignItems:
                "center",

              backgroundColor:
                theme.icon.default.background,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color={theme.icon.default.icon}
            />
          </View>

          <View
            style={{
              alignItems:
                "center",

              gap: spacing.xs,
            }}
          >
            <AppText
              variant="bodyLargeBold"
            >
              Unable to load business
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                textAlign:
                  "center",
              }}
            >
              We couldn't load your business
              information. Please try again.
            </AppText>
          </View>

          <Pressable
            onPress={() => {
              refetchProfile();

              refetchSettlementAccounts();
            }}
            style={{
              flexDirection:
                "row",

              alignItems:
                "center",

              gap: spacing.sm,

              paddingHorizontal:
                spacing.md,

              paddingVertical:
                spacing.sm,

              borderRadius:
                radius.md,

              backgroundColor:
                theme.background.brand,
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={theme.icon.branding.icon}
            />

            <AppText
              variant="bodyBold"
            >
              Try Again
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,

          paddingHorizontal:
            spacing.lg,
        }}
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <View
          style={{
            flexDirection:
              "row",

            alignItems:
              "center",

            gap: spacing.md,
          }}
        >
          {/* BACK BUTTON */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() =>
              router.back()
            }
            style={{
              width: 44,

              height: 44,

              justifyContent:
                "center",

              alignItems:
                "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={
                theme.text.primary
              }
            />
          </Pressable>

          {/* TITLE */}

          <View
            style={{
              flex: 1,

              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">
              Business
            </AppText>

            <AppText
              variant="bodySmall"
              color="secondary"
            >
              Manage your business profile and
              merchant information.
            </AppText>
          </View>
        </View>

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop:
              spacing.lg,

            paddingBottom:
              spacing.xl,

            gap:
              spacing.lg,
          }}
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={
                handleRefresh
              }
              tintColor={
                theme.icon.branding.icon
              }
            />
          }
        >
          {/* ============================================================
              BUSINESS SUMMARY
          ============================================================ */}

          <Card>
            <View
              style={{
                gap:
                  spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  gap:
                    spacing.md,
                }}
              >
                {/* BUSINESS ICON */}

                <View
                  style={{
                    width: 48,

                    height: 48,

                    borderRadius:
                      radius.full,

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    backgroundColor:
                      theme.icon
                        .default
                        .background,
                  }}
                >
                  <Ionicons
                    name="business-outline"
                    size={24}
                    color={
                      theme.icon
                        .default.icon
                    }
                  />
                </View>

                {/* BUSINESS NAME */}

                <View
                  style={{
                    flex: 1,

                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodyLargeBold"
                  >
                    {profile?.businessName ||
                      "Business"}
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    {profile?.merchantCode
                      ? `Merchant ID: ${profile.merchantCode}`
                      : "Merchant account"}
                  </AppText>
                </View>

                {/* VERIFIED STATUS */}

                <Ionicons
                  name={
                    profile?.isVerified
                      ? "checkmark-circle"
                      : "time-outline"
                  }
                  size={24}
                  color={
                    profile?.isVerified
                      ? theme.icon.success.icon
                      : theme.icon.default.icon
                  }
                />
              </View>

              <Divider variant="subtle" />

              <View
                style={{
                  flexDirection:
                    "row",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",
                }}
              >
                <View
                  style={{
                    gap: 2,
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    Verification Status
                  </AppText>

                  <AppText
                    variant="bodyBold"
                  >
                    {profile?.isVerified
                      ? "Verified"
                      : "Pending verification"}
                  </AppText>
                </View>

                <View
                  style={{
                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    gap:
                      spacing.xs,
                  }}
                >
                  <Ionicons
                    name={
                      profile?.isVerified
                        ? "shield-checkmark-outline"
                        : "shield-outline"
                    }
                    size={18}
                    color={
                      profile?.isVerified
                        ? theme.icon.success.icon
                        : theme.icon.default.icon
                    }
                  />
                </View>
              </View>
            </View>
          </Card>

          {/* ============================================================
              BUSINESS INFORMATION
          ============================================================ */}

          <View
            style={{
              gap:
                spacing.sm,
            }}
          >
            <View
              style={{
                gap:
                  spacing.xs,
              }}
            >
              <AppText
                variant="bodyLargeBold"
              >
                Business Information
              </AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
              >
                Your registered business details.
              </AppText>
            </View>

            <Card>
              <View>
                {/* BUSINESS NAME */}

                <View
                  style={{
                    paddingVertical:
                      spacing.sm,

                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    Business Name
                  </AppText>

                  <AppText
                    variant="bodyBold"
                  >
                    {profile?.businessName ||
                      "Not specified"}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                {/* TRADING NAME */}

                <View
                  style={{
                    paddingVertical:
                      spacing.md,

                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    Trading Name
                  </AppText>

                  <AppText
                    variant="bodyBold"
                  >
                    {profile?.tradingName ||
                      "Not specified"}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                {/* BUSINESS TYPE */}

                <View
                  style={{
                    paddingVertical:
                      spacing.md,

                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    Business Type
                  </AppText>

                  <AppText
                    variant="bodyBold"
                  >
                    {businessType}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                {/* BUSINESS CATEGORY */}

                <View
                  style={{
                    paddingTop:
                      spacing.md,

                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    Business Category
                  </AppText>

                  <AppText
                    variant="bodyBold"
                  >
                    {profile?.businessCategory ||
                      "Not specified"}
                  </AppText>
                </View>
              </View>
            </Card>
          </View>

          {/* ============================================================
              CONTACT DETAILS
          ============================================================ */}

          <View
            style={{
              gap:
                spacing.sm,
            }}
          >
            <View
              style={{
                gap:
                  spacing.xs,
              }}
            >
              <AppText
                variant="bodyLargeBold"
              >
                Contact Details
              </AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
              >
                Contact information linked to your
                business.
              </AppText>
            </View>

            <Card>
              <View>
                {/* EMAIL */}

                <View
                  style={{
                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    gap:
                      spacing.md,

                    paddingBottom:
                      spacing.md,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={
                      theme.icon
                        .default.icon
                    }
                  />

                  <View
                    style={{
                      flex: 1,

                      gap:
                        spacing.xs,
                    }}
                  >
                    <AppText
                      variant="bodySmall"
                      color="secondary"
                    >
                      Business Email
                    </AppText>

                    <AppText
                      variant="bodyBold"
                    >
                      {profile?.businessEmail ||
                        "Not specified"}
                    </AppText>
                  </View>
                </View>

                <Divider variant="subtle" />

                {/* PHONE */}

                <View
                  style={{
                    flexDirection:
                      "row",

                    alignItems:
                      "center",

                    gap:
                      spacing.md,

                    paddingVertical:
                      spacing.md,
                  }}
                >
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={
                      theme.icon
                        .default.icon
                    }
                  />

                  <View
                    style={{
                      flex: 1,

                      gap:
                        spacing.xs,
                    }}
                  >
                    <AppText
                      variant="bodySmall"
                      color="secondary"
                    >
                      Business Phone
                    </AppText>

                    <AppText
                      variant="bodyBold"
                    >
                      {profile?.businessPhoneNumber ||
                        "Not specified"}
                    </AppText>
                  </View>
                </View>

                <Divider variant="subtle" />

                {/* ADDRESS */}

                <View
                  style={{
                    flexDirection:
                      "row",

                    alignItems:
                      "flex-start",

                    gap:
                      spacing.md,

                    paddingTop:
                      spacing.md,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={
                      theme.icon
                        .default.icon
                    }
                    style={{
                      marginTop: 2,
                    }}
                  />

                  <View
                    style={{
                      flex: 1,

                      gap:
                        spacing.xs,
                    }}
                  >
                    <AppText
                      variant="bodySmall"
                      color="secondary"
                    >
                      Business Address
                    </AppText>

                    <AppText
                      variant="bodyBold"
                    >
                      {profile?.businessAddress ||
                        "Not specified"}
                    </AppText>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* ============================================================
              SETTLEMENT ACCOUNT
          ============================================================ */}

          <View
            style={{
              gap:
                spacing.sm,
            }}
          >
            <View
              style={{
                gap:
                  spacing.xs,
              }}
            >
              <AppText
                variant="bodyLargeBold"
              >
                Settlement Account
              </AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
              >
                Where your transaction payments are
                deposited.
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Manage settlement account"
              onPress={() =>
                router.push(
                  ROUTES.SETTLEMENTS
                )
              }
            >
              <Card>
                <View>
                  {primarySettlementAccount ? (
                    <>
                      <View
                        style={{
                          flexDirection:
                            "row",

                          alignItems:
                            "center",

                          gap:
                            spacing.md,
                        }}
                      >
                        <View
                          style={{
                            width: 40,

                            height: 40,

                            borderRadius:
                              radius.full,

                            justifyContent:
                              "center",

                            alignItems:
                              "center",

                            backgroundColor:
                              theme.icon
                                .default
                                .background,
                          }}
                        >
                          <Ionicons
                            name="card-outline"
                            size={20}
                            color={
                              theme.icon
                                .default.icon
                            }
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,

                            gap:
                              spacing.xs,
                          }}
                        >
                          <AppText
                            variant="bodyBold"
                          >
                            {
                              primarySettlementAccount.bankName
                            }
                          </AppText>

                          <AppText
                            variant="bodySmall"
                            color="secondary"
                          >
                            {
                              primarySettlementAccount.accountNumber
                            }
                          </AppText>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={
                            theme.text.secondary
                          }
                        />
                      </View>

                      <Divider
                        variant="subtle"
                        style={{
                          marginVertical:
                            spacing.md,
                        }}
                      />

                      <View
                        style={{
                          gap:
                            spacing.xs,
                        }}
                      >
                        <AppText
                          variant="bodySmall"
                          color="secondary"
                        >
                          Account Name
                        </AppText>

                        <AppText
                          variant="bodyBold"
                        >
                          {
                            primarySettlementAccount.accountName
                          }
                        </AppText>
                      </View>
                    </>
                  ) : (
                    <View
                      style={{
                        flexDirection:
                          "row",

                        alignItems:
                          "center",

                        gap:
                          spacing.md,
                      }}
                    >
                      <View
                        style={{
                          width: 40,

                          height: 40,

                          borderRadius:
                            radius.full,

                          justifyContent:
                            "center",

                          alignItems:
                            "center",

                          backgroundColor:
                            theme.icon
                              .default
                              .background,
                        }}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={22}
                          color={
                            theme.icon
                              .default.icon
                          }
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,

                          gap:
                            spacing.xs,
                        }}
                      >
                        <AppText
                          variant="bodyBold"
                        >
                          Add settlement account
                        </AppText>

                        <AppText
                          variant="bodySmall"
                          color="secondary"
                        >
                          Add an account to receive
                          your transaction payments.
                        </AppText>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={
                          theme.text.secondary
                        }
                      />
                    </View>
                  )}
                </View>
              </Card>
            </Pressable>

            {isSettlementAccountsError && (
              <AppText
                variant="bodySmall"
                color="secondary"
              >
                We couldn't load your settlement
                account. Pull down to try again.
              </AppText>
            )}
          </View>

          {/* ============================================================
              MERCHANT DETAILS
          ============================================================ */}

          {profile?.merchantId && (
            <View
              style={{
                gap:
                  spacing.sm,
              }}
            >
              <AppText
                variant="bodyLargeBold"
              >
                Merchant Details
              </AppText>

              <Card>
                <View
                  style={{
                    gap:
                      spacing.xs,
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    color="secondary"
                  >
                    Merchant ID
                  </AppText>

                  <AppText
                    variant="bodySmall"
                  >
                    {profile.merchantId}
                  </AppText>
                </View>
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}