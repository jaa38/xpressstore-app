import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

import { clearSession } from "@/features/auth/services/session";
import { router } from "expo-router";
import { ROUTES } from "@/navigation/routes";
import { Alert } from "react-native";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Divider } from "@/components/ui/Divider";
import { UICard } from "@/components/ui/UICard";

export default function MoreScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  async function handleLogout() {
    try {
      await clearSession();
      setAuthenticated(false);
      router.replace("/(auth)/login");
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
          paddingTop: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h1">Profile</AppText>

        <AppText variant="body" color="secondary">
          Manage your business and account
        </AppText>

        {/* Screen content */}
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
            <AppText variant="h3">Merchant Name</AppText>

            <AppText variant="bodySmall" color="muted">
              siteurl.xpressstore.com
            </AppText>

            <UICard title="Pro Merchant" variant="status" />
          </View>
        </Card>

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

        {/* Business */}
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          <View style={{ flexDirection: "column", gap: spacing.sm }}>
            <AppText variant="bodyBold" color="muted">
              Business
            </AppText>

            {/* Business Information */}
            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* Business */}
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

              {/* Customers */}
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

              {/* Payment Links */}
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
            </Card>
          </View>

          {/* Account */}
          <View style={{ flexDirection: "column", gap: spacing.sm }}>
            <AppText variant="bodyBold" color="muted">
              Account
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* Security */}
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

              {/* Notifications */}
              <View
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
              </View>

              <Divider />

              {/* Settings */}
              <View
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
                    Manage your app prefrences
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </View>
            </Card>
          </View>

          <View style={{ flexDirection: "column", gap: spacing.sm }}>
            <AppText variant="bodyBold" color="muted">
              Support
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* Support */}
              <Pressable
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

              {/* About */}
              <View
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
              </View>
            </Card>
          </View>
        </View>

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
