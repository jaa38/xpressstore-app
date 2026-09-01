import { Alert, Pressable, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { UICard } from "@/components/ui/UICard";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useAuth } from "@/providers/AuthProvider";

import { useMerchantProfile } from "@/hooks/merchant/useMerchantProfile";

export default function MoreScreen() {
  const { logout } = useAuth();

  const { profile, isLoading } = useMerchantProfile();

  async function handleLogout() {
    try {
      await logout();

      router.replace(ROUTES.LOGIN);
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  }

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
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <AppText variant="h1">Profile</AppText>

        <AppText variant="body" color="secondary">
          Manage your business and account
        </AppText>

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
          <Ionicons
            name="person-circle"
            size={56}
            color={theme.icon.default.icon}
          />

          <View
            style={{
              flex: 1,
              gap: spacing.xs,
            }}
          >
            <AppText variant="h3">
              {isLoading ? "Loading..." : (profile?.businessName ?? "Merchant")}
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
        {/* AVAILABLE BALANCE */}
        {/* ================================================================= */}

        <Card
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <AppText variant="label" color="muted">
              Available to withdraw
            </AppText>

            <AppText variant="h1">₦248,750</AppText>
          </View>

          <Button title="Withdraw" />
        </Card>

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
              {/* ----------------------------------------------------------- */}
              {/* BUSINESS INFORMATION */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.BUSINESS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* CATEGORIES */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.CATEGORIES)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="grid-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* CUSTOMERS */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.CUSTOMERS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* DISCOUNT CODES */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.DISCOUNT_CODES)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* PAYMENT LINKS */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.PAYMENT_LINKS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="link-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* SHIPPING REGION */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.SHIPPING_REGION)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="map-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* TRANSACTIONS */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.TRANSACTIONS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="receipt-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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
              {/* ----------------------------------------------------------- */}
              {/* PAYMENT SETTINGS */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.PAYMENT_SETTINGS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={theme.listItem.default.icon}
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Payment Settings</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Bank, Card, Transfer, USSD
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* ----------------------------------------------------------- */}
              {/* SETTLEMENT */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.SETTLEMENTS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color={theme.listItem.default.icon}
                />

                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">Settlement</AppText>

                  <AppText variant="bodySmall" color="muted">
                    Setup how you be paid
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
              {/* ----------------------------------------------------------- */}
              {/* SECURITY */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.SECURITY)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* NOTIFICATIONS */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.NOTIFICATIONS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* SETTINGS */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.SETTINGS)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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
              {/* ----------------------------------------------------------- */}
              {/* SUPPORT */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.SUPPORT)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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

              {/* ----------------------------------------------------------- */}
              {/* ABOUT */}
              {/* ----------------------------------------------------------- */}

              <Pressable
                onPress={() => router.push(ROUTES.ABOUT)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={theme.listItem.default.icon}
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
            paddingBottom: spacing.lg,
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
