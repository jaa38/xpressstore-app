import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

export default function CustomersScreen() {
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
          Customers
        </AppText>

        <AppText
          variant="body"
          color="secondary"
        >
          View and manage your customer records.
        </AppText>

        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
}