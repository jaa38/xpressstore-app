import {
  ActivityIndicator,
  Image,
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

import { Button } from "@/components/ui/Button";

import { spacing, theme, radius } from "@/theme";

import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

import { useSettlementAccounts } from "@/hooks/merchant/useSettlementAccounts";

import { ROUTES } from "@/navigation/routes";

import { getBankLogo } from "@/constants/banks";

/**
 * ============================================================================
 * HELPERS
 * ============================================================================
 */

function maskAccountNumber(accountNumber: string) {
  if (!accountNumber) {
    return "Not available";
  }

  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `••••••${accountNumber.slice(-4)}`;
}

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
   * PRIMARY SETTLEMENT ACCOUNT
   * --------------------------------------------------------------------------
   */

  const primarySettlementAccount =
    settlementAccounts?.find((account) => account.isDefault) ??
    settlementAccounts?.[0];

  /**
   * ==========================================================================
   * REFRESH
   * ==========================================================================
   */

  async function handleRefresh() {
    await Promise.all([refetchProfile(), refetchSettlementAccounts()]);
  }

  /**
   * ==========================================================================
   * RETRY
   * ==========================================================================
   */

  async function handleRetryProfile() {
    await handleRefresh();
  }

  /**
   * ==========================================================================
   * INITIAL LOADING
   * ==========================================================================
   */

  if (isProfileLoading && !profile) {
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
            gap: spacing.md,
          }}
        >
          <ActivityIndicator size="large" color={theme.icon.branding.icon} />

          <AppText variant="body" color="secondary">
            Loading your business information...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * PROFILE ERROR
   * ==========================================================================
   */

  if (profileError && !profile) {
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
          {/* HEADER */}

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
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();

                  return;
                }

                router.replace(ROUTES.MORE);
              }}
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

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Business</AppText>

              <AppText variant="bodySmall" color="secondary">
                Manage your business profile and merchant information.
              </AppText>
            </View>
          </View>

          {/* ERROR */}

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.lg,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.full,

                justifyContent: "center",
                alignItems: "center",

                backgroundColor: theme.icon.default.background,
              }}
            >
              <Ionicons
                name="cloud-offline-outline"
                size={30}
                color={theme.icon.default.icon}
              />
            </View>

            <View
              style={{
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodyLargeBold">Unable to load business</AppText>

              <AppText
                variant="bodySmall"
                color="secondary"
                style={{
                  textAlign: "center",
                }}
              >
                We couldn't load your business information. Please check your
                connection and try again.
              </AppText>
            </View>

            <View
              style={{
                width: "100%",
              }}
            >
              <Button
                title="Try Again"
                variant="primary"
                onPress={handleRetryProfile}
              />
            </View>
          </View>
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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();

                return;
              }

              router.replace(ROUTES.MORE);
            }}
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

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h1">Business</AppText>

            <AppText variant="bodySmall" color="secondary">
              Manage your business profile and merchant information.
            </AppText>
          </View>
        </View>

        {/* ==================================================================
            CONTENT
        ================================================================== */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isProfileLoading || isSettlementAccountsLoading}
              onRefresh={handleRefresh}
              tintColor={theme.icon.branding.icon}
            />
          }
        >
          {/* ================================================================
              BUSINESS SUMMARY
          ================================================================ */}

          <Card>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.default.background,
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={theme.icon.default.icon}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyLargeBold">
                  {profile?.businessName || "Business information"}
                </AppText>

                <AppText variant="bodySmall" color="secondary">
                  Merchant Code: {profile?.merchantCode || "Not available"}
                </AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: radius.full,
                  backgroundColor: profile?.isVerified
                    ? theme.background.brand
                    : theme.icon.default.background,
                }}
              >
                <Ionicons
                  name={
                    profile?.isVerified ? "checkmark-circle" : "time-outline"
                  }
                  size={16}
                  color={
                    profile?.isVerified
                      ? theme.icon.success.icon
                      : theme.icon.default.icon
                  }
                />

                <AppText variant="bodySmallBold">
                  {profile?.isVerified ? "Verified" : "Pending"}
                </AppText>
              </View>
            </View>
          </Card>

          {/* ================================================================
              BUSINESS INFORMATION
          ================================================================ */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AppText variant="bodyLargeBold">Business Information</AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit business information"
                onPress={() => router.push("/business/edit")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodySmallBold" color="secondary">
                  Edit
                </AppText>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>

            <Card>
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Business Name
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessName || "Not available"}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Trading Name
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.tradingName || "Not available"}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Business Type
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessType || "Not available"}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Business Category
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessCategory || "Not available"}
                  </AppText>
                </View>

                <Divider variant="subtle" />

                <View
                  style={{
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodySmall" color="muted">
                    Business Address
                  </AppText>

                  <AppText variant="bodyBold">
                    {profile?.businessAddress || "Not available"}
                  </AppText>
                </View>
              </View>
            </Card>
          </View>

          {/* ================================================================
              CONTACT DETAILS
          ================================================================ */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyLargeBold">Contact Details</AppText>

            <Card>
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.icon.default.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodySmall" color="muted">
                      Business Email
                    </AppText>

                    <AppText variant="bodyBold">
                      {profile?.businessEmail || "Not available"}
                    </AppText>
                  </View>
                </View>

                <Divider variant="subtle" />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={theme.icon.default.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                      gap: spacing.xs,
                    }}
                  >
                    <AppText variant="bodySmall" color="muted">
                      Business Phone Number
                    </AppText>

                    <AppText variant="bodyBold">
                      {profile?.businessPhoneNumber || "Not available"}
                    </AppText>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* ================================================================
              SETTLEMENT ACCOUNT
          ================================================================ */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AppText variant="bodyLargeBold">Settlement Account</AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Manage settlement account"
                onPress={() => router.push(ROUTES.SETTLEMENTS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodySmallBold" color="secondary">
                  Manage
                </AppText>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>

            {/* ============================================================
                SETTLEMENT ACCOUNT ERROR
            ============================================================ */}

            {isSettlementAccountsError ? (
              <Card>
                <View
                  style={{
                    alignItems: "center",
                    gap: spacing.sm,
                    paddingVertical: spacing.md,
                  }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={28}
                    color={theme.icon.default.icon}
                  />

                  <AppText variant="bodyBold">
                    Unable to load settlement account
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    We couldn't load your settlement account information.
                  </AppText>

                  <View
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Retry settlement account"
                      onPress={() => refetchSettlementAccounts()}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={16}
                        color={theme.icon.default.icon}
                      />

                      <AppText variant="bodySmallBold">Try Again</AppText>
                    </Pressable>
                  </View>
                </View>
              </Card>
            ) : (
              <Card>
                {primarySettlementAccount ? (
                  <View
                    style={{
                      gap: spacing.md,
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
                          width: 40,
                          height: 40,
                          borderRadius: radius.full,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#FFFFFF",
                          overflow: "hidden",
                        }}
                      >
                        {getBankLogo(primarySettlementAccount.bankName) ? (
                          <Image
                            source={getBankLogo(
                              primarySettlementAccount.bankName
                            )}
                            style={{
                              width: 34,
                              height: 34,
                              resizeMode: "contain",
                            }}
                          />
                        ) : (
                          <Ionicons
                            name="card-outline"
                            size={20}
                            color={theme.icon.default.icon}
                          />
                        )}
                      </View>

                      <View
                        style={{
                          flex: 1,
                          gap: spacing.xs,
                        }}
                      >
                        <AppText variant="bodyBold">
                          {primarySettlementAccount.bankName}
                        </AppText>

                        <AppText variant="bodySmall" color="secondary">
                          {maskAccountNumber(
                            primarySettlementAccount.accountNumber
                          )}
                        </AppText>
                      </View>

                      {primarySettlementAccount.isDefault && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={theme.icon.success.icon}
                        />
                      )}
                    </View>

                    <Divider variant="subtle" />

                    <View
                      style={{
                        gap: spacing.xs,
                      }}
                    >
                      <AppText variant="bodySmall" color="muted">
                        Account Name
                      </AppText>

                      <AppText variant="bodyBold">
                        {primarySettlementAccount.accountName}
                      </AppText>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      paddingVertical: spacing.md,
                      gap: spacing.sm,
                    }}
                  >
                    <Ionicons
                      name="card-outline"
                      size={28}
                      color={theme.icon.default.icon}
                    />

                    <AppText variant="bodyBold">No settlement account</AppText>

                    <AppText
                      variant="bodySmall"
                      color="secondary"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Add a settlement account to receive payments from your
                      transactions.
                    </AppText>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Add settlement account"
                      onPress={() => router.push(ROUTES.SETTLEMENTS)}
                      style={{
                        marginTop: spacing.xs,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                      }}
                    >
                      <AppText variant="bodySmallBold">Add account</AppText>

                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={theme.icon.default.icon}
                      />
                    </Pressable>
                  </View>
                )}
              </Card>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
