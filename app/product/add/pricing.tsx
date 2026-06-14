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
import { Input } from "@/components/ui/Input";

import { SelectableCard } from "@/components/ui/SelectableCard";

export default function PricingScreen() {
  const [taxApplicable, setTaxApplicable] = useState(false);
  const [trackInventory, setTrackInventory] = useState(true);
  const [productStatus, setProductStatus] = useState<"active" | "draft">(
    "active"
  );

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
          showsVerticalScrollIndicator={true}
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

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodyLargeBold" color="primary">
                    Tax Applicable
                  </AppText>

                  <AppText variant="body" color="secondary">
                    Add VAT or sales tax to this product
                  </AppText>
                </View>

                <Switch
                  value={taxApplicable}
                  onValueChange={setTaxApplicable}
                  style={{
                    alignSelf: "center",
                  }}
                />
              </View>
            </Card>
          </View>

          {/* INVENTORY */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <AppText variant="h3" color="primary">
              Inventory
            </AppText>

            <Card
              style={{
                marginTop: spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodyLargeBold" color="primary">
                    Track Inventory
                  </AppText>

                  <AppText variant="body" color="secondary">
                    Automatically deduct stock with each sale
                  </AppText>
                </View>

                <Switch
                  value={trackInventory}
                  onValueChange={setTrackInventory}
                  style={{
                    alignSelf: "center",
                  }}
                />
              </View>
            </Card>

            {trackInventory && (
              <View
                style={{
                  marginTop: spacing.md,
                  gap: spacing.md,
                }}
              >
                <Input
                  label="Current Stock Quantity"
                  placeholder="0"
                  keyboardType="numeric"
                />

                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Low Stock Alert"
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Input
                      label="Reorder Level"
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            <View
              style={{
                marginTop: spacing.lg,
              }}
            >
              <AppText variant="h3" color="primary">
                Product Status
              </AppText>

              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                  marginTop: spacing.md,
                }}
              >
                <View style={{ flex: 1 }}>
                  <SelectableCard
                    title="Active"
                    description="Live on storefront immediately"
                    selected={productStatus === "active"}
                    onPress={() => setProductStatus("active")}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <SelectableCard
                    title="Draft"
                    description="Save without publishing"
                    selected={productStatus === "draft"}
                    onPress={() => setProductStatus("draft")}
                  />
                </View>
              </View>
            </View>
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
