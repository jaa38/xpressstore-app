import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

import { useOrders } from "@/hooks/products/useOrders";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: orders = [] } = useOrders();

  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <Ionicons
          name="receipt-outline"
          size={60}
          color={theme.icon.default.icon}
        />

        <AppText
          variant="h2"
          style={{
            marginTop: spacing.lg,
          }}
        >
          Order Not Found
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          align="center"
          style={{
            marginTop: spacing.sm,
            paddingHorizontal: spacing.xl,
          }}
        >
          The requested order could not be found.
        </AppText>
      </SafeAreaView>
    );
  }

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
            <AppText variant="h1">
              Order
            </AppText>

            <AppText
              variant="body"
              color="secondary"
            >
              Order Details
            </AppText>
          </View>
        </View>

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing["3xl"],
          }}
        >
          {/* Sections will be added next */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}