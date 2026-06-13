import { View, ScrollView, KeyboardTypeOptions, Switch } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

import { CurrencyInput } from "@/components/ui/CurrencyInput";

import { Card } from "@/components/ui/Card";

import { useState } from "react";

export default function PricingScreen() {
  const [taxApplicable, setTaxApplicable] = useState(false);

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
              flexDirection: "column",
              gap: spacing.rg,
            }}
          >
            <CurrencyInput
              label="Selling Price"
              required
              keyboardType="decimal-pad"
            />
            <CurrencyInput
              label="Cost Price"
              optional
              keyboardType="decimal-pad"
            />
          </View>

          {/* INVENTORY */}

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Card>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <AppText variant="bodyBold" color="primary">
                      Text Applicable
                    </AppText>
                    <AppText variant="body" color="secondary">
                      Add Vat or sales tax to this product
                    </AppText>
                  </View>
                  <Switch
                    value={taxApplicable}
                    onValueChange={setTaxApplicable}
                  />
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        <Divider />

        <AddProductFooter
          onNext={() => router.push(ROUTES.ADD_PRODUCT_VARIANTS)}
        />
      </View>
    </SafeAreaView>
  );
}
