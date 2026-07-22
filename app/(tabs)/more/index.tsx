import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

import { clearSession } from "@/features/auth/services/session";
import { router } from "expo-router";
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
          Your profile your choice
        </AppText>

        {/* Screen content */}
        <Card style={{ marginTop: spacing.md, flexDirection: "row" }}>
          <Ionicons name="man" size={48} />
          <View style={{ flexDirection: "column", gap: spacing.xs }}>
            <AppText variant="h3">Merchant Name</AppText>
            <AppText variant="bodySmall" color="muted">
              Site URL
            </AppText>

            <UICard title="Pro Merchant" variant="status" />
          </View>
        </Card>

        <Card
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <AppText variant="label" color="muted">
              Available to withdraw
            </AppText>
            <AppText variant="h1">₦248,750</AppText>
          </View>
          <View>
            <Button style={{ alignSelf: "center" }} title="Withdraw" />
          </View>
        </Card>

        {/* Business */}
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          <View style={{ flexDirection: "column", gap: spacing.sm }}>
            <AppText variant="bodyBold" color="muted">
              Business
            </AppText>

            <Card style={{ flexDirection: "column", gap: spacing.rg }}>
              {/* Business Screen */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Ionicons name="business-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Business Information</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Your store
                  </AppText>
                </View>
              </View>

              <Divider />

              {/* Customers */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Ionicons name="people-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Customers</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Customer information
                  </AppText>
                </View>
              </View>

              <Divider />

              {/* Payments Links */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Ionicons name="link-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Payment Links</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Generate your payment links
                  </AppText>
                </View>
              </View>
            </Card>
          </View>

          {/* Account */}
          <View style={{ flexDirection: "column", gap: spacing.sm }}>
            <AppText variant="bodyBold" color="muted">
              Account
            </AppText>

            <Card style={{ flexDirection: "column", gap: spacing.rg }}>
              {/* Security */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Ionicons name="shield-checkmark-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Security</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Change your password
                  </AppText>
                </View>
              </View>

              <Divider />

              {/* Notifications */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Ionicons name="notifications-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Notifications</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Change your notifications
                  </AppText>
                </View>
              </View>

              <Divider />

              {/* Setting */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Ionicons name="settings-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Settings</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Change your settings
                  </AppText>
                </View>
              </View>
            </Card>
          </View>

          <View style={{ flexDirection: "column", gap: spacing.sm }}>
            <AppText variant="bodyBold" color="muted">
              Support
            </AppText>

            <Card style={{ flexDirection: "column", gap: spacing.rg }}>
              {/* Support */}
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <Ionicons name="help-circle-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">Settings</AppText>
                  <AppText variant="bodySmall" color="muted">
                    Change your settings
                  </AppText>
                </View>
              </View>

              <Divider />

              {/* About */}
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <Ionicons name="information-circle-outline" size={24} />

                <View>
                  <AppText variant="bodyBold">About</AppText>
                  <AppText variant="bodySmall" color="muted">
                    About You
                  </AppText>
                </View>
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
          <Button title="Logout" variant="primary" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
