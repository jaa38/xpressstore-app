import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

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
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Pressable
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

          <View
            style={{
              flex: 1,
            }}
          >
            <AppText variant="h1">Transaction Details</AppText>

            <AppText variant="body" color="secondary">
              {id}
            </AppText>
          </View>
        </View>

        <Card
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="bodyLargeBold">Transaction Details</AppText>

          <AppText
            color="secondary"
            style={{
              marginTop: spacing.sm,
            }}
          >
            Phase 2 will build the receipt summary, customer information,
            payment information, timeline and actions.
          </AppText>
        </Card>
      </View>
    </SafeAreaView>
  );
}
