import { View, Pressable, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

export default function PricingScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      {/* HEADER */}

      <View
        style={{
          backgroundColor: theme.background.surface,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <View
          style={{
            gap: spacing.xs,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={router.back} hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>

            <AppText variant="h3">Pricing & Inventory</AppText>

            <Ionicons name="close" size={24} color={theme.icon.default.icon} />
          </View>

          <View
            style={{
              marginTop: spacing.rg,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AppText variant="bodySmall" color="secondary">
              Step 2 of 5
            </AppText>

            <AppText variant="bodySmallBold" color="success">
              Pricing
            </AppText>
          </View>

          <View
            style={{
              marginTop: spacing.rg,
            }}
          >
            <ProgressBar progress={40} />
          </View>
        </View>
      </View>

      <Divider />

      {/* CONTENT */}

      <View
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <AppText variant="body" color="secondary">
            Set your product price, inventory quantity, and stock alerts.
          </AppText>

          {/* Form Fields */}
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
            backgroundColor: theme.background.primary,
          }}
        >
          <Button
            title="Next"
            onPress={() => router.push(ROUTES.ADD_PRODUCT_VARIANTS)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
