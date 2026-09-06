import { Alert, Pressable, ScrollView, View, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { UICard } from "@/components/ui/UICard";

import { spacing, theme, radius } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useAuth } from "@/providers/AuthProvider";

import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

import { useSettlementAccounts } from "@/hooks/merchant/useSettlementAccounts";

/**
 * ============================================================================
 * MORE SCREEN
 * ============================================================================
 */

export default function MoreScreen() {
  /**
   * ==========================================================================
   * AUTHENTICATION
   * ==========================================================================
   */

  const { logout } = useAuth();

  /**
   * ==========================================================================
   * MERCHANT PROFILE
   * ==========================================================================
   */

  const { profile, isLoading } = useMerchantProfile();

  /**
   * ==========================================================================
   * SETTLEMENT ACCOUNTS
   * ==========================================================================
   */

  const { settlementAccounts, isLoading: settlementAccountsLoading } =
    useSettlementAccounts();

  /**
   * ==========================================================================
   * SETTLEMENT ACCOUNT STATUS
   * ==========================================================================
   */

  const hasSettlementAccount = (settlementAccounts?.length ?? 0) > 0;

  /**
   * ==========================================================================
   * LOGOUT
   * ==========================================================================
   */

  async function handleLogout() {
    try {
      await logout();

      router.replace(ROUTES.LOGIN);
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
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

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
        contentContainerStyle={{
          paddingBottom: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <View
          style={{
            gap: spacing.xs,
          }}
        >
          <AppText variant="h1">Profile</AppText>

          <AppText variant="bodySmall" color="secondary">
            Manage your business and account
          </AppText>
        </View>

        {/* ================================================================= */}
        {/* PROFILE CARD */}
        {/* ================================================================= */}

        <Card
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Image
            source={require("../../../assets/icons/profileIcon.png")}
            style={{
              width: 96,
              height: 96,
            }}
            resizeMode="contain"
          />

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h3">
              {isLoading
                ? "Loading..."
                : (profile?.businessName ?? "Merchant")}
            </AppText>

            <AppText variant="bodySmall" color="muted">
              Merchant ID: {profile?.merchantId || "Not available"}
            </AppText>

            <AppText variant="bodySmall" color="muted">
              {profile?.website || "No website configured"}
            </AppText>

            <UICard
              title={
                profile?.isVerified
                  ? "Verified Merchant"
                  : "Verification Pending"
              }
              variant="status"
            />
          </View>
        </Card>

        {/* ================================================================= */}
        {/* SETTLEMENT ACCOUNT REQUIRED */}
        {/* ================================================================= */}

        {!settlementAccountsLoading && !hasSettlementAccount && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add settlement account"
            onPress={() => router.push(ROUTES.SETTLEMENTS)}
            style={({ pressed }) => ({
              marginTop: spacing.md,

              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,

              borderRadius: radius.md,

              backgroundColor: theme.background.warning,

              borderWidth: 1,
              borderColor: theme.border.warning,

              flexDirection: "row",
              alignItems: "center",

              gap: spacing.sm,

              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.icon.warning.icon}
            />

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="bodySmall" color="warning">
                Settlement account required
              </AppText>

              <AppText variant="caption" color="muted">
                Add a settlement account before configuring your payment
                methods.
              </AppText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.icon.warning.icon}
            />
          </Pressable>
        )}

        {/* ================================================================= */}
        {/* CATEGORIES */}
        {/* ================================================================= */}

        <View
          style={{
            marginTop: spacing.lg,
            gap: spacing.md,
          }}
        >
          {/* ================================================================= */}
          {/* BUSINESS */}
          {/* ================================================================= */}

          <View
            style={{
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyBold" color="muted">
              Business
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* BUSINESS INFORMATION */}

              <Pressable
                onPress={() => router.push(ROUTES.BUSINESS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/businessInformationIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Business Information</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Manage your business profile
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* CATEGORIES */}

              <Pressable
                onPress={() => router.push(ROUTES.CATEGORIES)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/categoriesIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Categories</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Organise your products into categories
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* CUSTOMERS */}

              <Pressable
                onPress={() => router.push(ROUTES.CUSTOMERS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/customersIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Customers</AppText>

                  <AppText variant="bodySmall" color="muted">
                    View and manage your customers
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* DISCOUNT CODES */}

              <Pressable
                onPress={() => router.push(ROUTES.DISCOUNT_CODES)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/discountCodesIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Discount Codes</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Create and manage promotional discount codes
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* PAYMENT LINKS */}

              <Pressable
                onPress={() => router.push(ROUTES.PAYMENT_LINKS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/paymentLinksIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Payment Links</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Create and manage payment links
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* SHIPPING REGION */}

              <Pressable
                onPress={() => router.push(ROUTES.SHIPPING_REGION)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/shippingRegionsIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Shipping Region</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Manage where you deliver your products
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* TRANSACTIONS */}

              <Pressable
                onPress={() => router.push(ROUTES.TRANSACTIONS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/transactionsIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Transactions</AppText>

                  <AppText variant="bodySmall" color="muted">
                    View and manage transaction history
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>
          </View>

          {/* ================================================================= */}
          {/* PAYMENTS */}
          {/* ================================================================= */}

          <View
            style={{
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyBold" color="muted">
              Payments
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* PAYMENT SETTINGS */}

              <Pressable
                onPress={() => router.push(ROUTES.PAYMENT_SETTINGS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/paymentSettingsIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                    opacity:
                      !settlementAccountsLoading && !hasSettlementAccount
                        ? 0.6
                        : 1,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText
                    variant="bodyBold"
                    color={
                      !settlementAccountsLoading && !hasSettlementAccount
                        ? "muted"
                        : undefined
                    }
                  >
                    Payment Settings
                  </AppText>

                  <AppText variant="bodySmall" color="muted">
                    {!settlementAccountsLoading && !hasSettlementAccount
                      ? "Add a settlement account first"
                      : "Bank, Card, Transfer, USSD"}
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* SETTLEMENT */}

              <Pressable
                onPress={() => router.push(ROUTES.SETTLEMENTS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/settlementIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: spacing.sm,
                    }}
                  >
                    <AppText variant="bodyBold">Settlement</AppText>

                    {!settlementAccountsLoading && !hasSettlementAccount && (
                      <View
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 2,

                          borderRadius: 999,

                          backgroundColor: theme.background.warning,
                        }}
                      >
                        <AppText variant="caption" color="warning">
                          Required
                        </AppText>
                      </View>
                    )}
                  </View>

                  <AppText variant="bodySmall" color="muted">
                    {settlementAccountsLoading
                      ? "Checking settlement account..."
                      : hasSettlementAccount
                        ? "Manage how you receive payments"
                        : "Add your settlement account"}
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={
                    !settlementAccountsLoading && !hasSettlementAccount
                      ? theme.icon.warning.icon
                      : theme.listItem.default.chevron
                  }
                />
              </Pressable>
            </Card>
          </View>

          {/* ================================================================= */}
          {/* ACCOUNT */}
          {/* ================================================================= */}

          <View
            style={{
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyBold" color="muted">
              Account
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* SECURITY */}

              <Pressable
                onPress={() => router.push(ROUTES.SECURITY)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/securityIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Security</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Manage your password and account security
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* NOTIFICATIONS */}

              <Pressable
                onPress={() => router.push(ROUTES.NOTIFICATIONS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/notificationIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Notifications</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Manage your notification preferences
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* SETTINGS */}

              <Pressable
                onPress={() => router.push(ROUTES.SETTINGS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/settingsIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Settings</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Manage your app preferences
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>
          </View>

          {/* ================================================================= */}
          {/* SUPPORT */}
          {/* ================================================================= */}

          <View
            style={{
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <AppText variant="bodyBold" color="muted">
              Support
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* SUPPORT */}

              <Pressable
                onPress={() => router.push(ROUTES.SUPPORT)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/supportIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Support</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Get help and contact support
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* ABOUT */}

              <Pressable
                onPress={() => router.push(ROUTES.ABOUT)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Image
                  source={require("../../../assets/icons/aboutIcon.png")}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">About</AppText>

                  <AppText variant="bodySmall" color="muted">
                    App version and legal information
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>
          </View>
        </View>

        {/* ================================================================= */}
        {/* SIGN OUT */}
        {/* ================================================================= */}

        <View
          style={{
            paddingTop: spacing.md,
          }}
        >
          <Button
            title="Sign Out"
            variant="tertiaryDestructive"
            leftIcon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.action.tertiaryDestructive.text}
              />
            }
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}