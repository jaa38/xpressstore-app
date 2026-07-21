import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";

export default function SettlementsScreen() {
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
          padding: spacing.lg,
        }}
      >
        <Card
          style={{
            alignItems: "center",
            paddingVertical: spacing.xl,
          }}
        >
          <Ionicons
            name="wallet-outline"
            size={48}
            color={theme.icon.branding.icon}
          />

          <AppText
            variant="h3"
            style={{ marginTop: spacing.md }}
          >
            Settlements
          </AppText>

          <AppText
            color="secondary"
            style={{
              textAlign: "center",
              marginTop: spacing.sm,
            }}
          >
            View settlement accounts, schedules and payout history.
          </AppText>
        </Card>
      </View>
    </SafeAreaView>
  );
}