import { View, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";
import { router } from "expo-router";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

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

      <AddProductHeader
        title="Pricing & Inventory"
        step={2}
        totalSteps={5}
        progress={40}
        label="Pricing"
      />

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

        <AddProductFooter
          onNext={() => router.push(ROUTES.ADD_PRODUCT_VARIANTS)}
        />
      </View>
    </SafeAreaView>
  );
}
