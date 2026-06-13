import { View, ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

import { CurrencyInput } from "@/components/ui/CurrencyInput";

export default function PricingScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      <AddProductHeader
        title="Pricing & Inventory"
        step={2}
        totalSteps={5}
        progress={40}
        label="Pricing"
      />

      <Divider />

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
          <View
            style={{
              gap: spacing.xs,
            }}
          >
            <AppText variant="h3" color="primary">
              Pricing
            </AppText>

            <AppText variant="body" color="secondary">
              Set your prices and inventory details.
            </AppText>
          </View>

          {/* SELLING PRICE */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <CurrencyInput
              label="Selling Price"
              required
            />
          </View>

          {/* COST PRICE */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <CurrencyInput
              label="Cost Price"
              optional
            />
          </View>

          {/* INVENTORY */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            {/* Stock Quantity Input goes here */}
          </View>
        </ScrollView>

        <Divider />

        <AddProductFooter
          onNext={() =>
            router.push(
              ROUTES.ADD_PRODUCT_VARIANTS
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}