import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";

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
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
        }}
      >
        <AppText variant="h1">
          Settlements
        </AppText>

        <AppText
          variant="body"
          color="secondary"
        >
          Review settlement history and payout information.
        </AppText>

        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
}