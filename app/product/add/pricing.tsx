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

import { useForm, Controller } from "react-hook-form";

import { Input } from "@/components/ui/Input";

import { SelectableCard } from "@/components/ui/SelectableCard";

import { zodResolver } from "@hookform/resolvers/zod";

import { pricingSchema, PricingFormData } from "@/schemas/pricingSchema";

import { useProduct } from "@/store/product/useProduct";

export default function PricingScreen() {
  const [taxApplicable, setTaxApplicable] = useState(false);
  const [trackInventory, setTrackInventory] = useState(true);
  const [productStatus, setProductStatus] = useState<"active" | "draft">(
    "active"
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PricingFormData>({
    defaultValues: {
      sellingPrice: "",
      costPrice: "",
      currentStock: "",
      lowStockAlert: "",
      reorderLevel: "",
    },
  });

  const { updateProduct } = useProduct();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      <AddProductHeader
        title="Add New Product"
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
            <Controller
              control={control}
              name="sellingPrice"
              render={({ field }) => (
                <CurrencyInput
                  label="Selling Price"
                  required
                  keyboardType="decimal-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.sellingPrice?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="costPrice"
              render={({ field }) => (
                <CurrencyInput
                  label="Cost Price"
                  optional
                  keyboardType="decimal-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
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
                <Controller
                  control={control}
                  name="currentStock"
                  render={({ field }) => (
                    <Input
                      label="Current Stock Quantity"
                      placeholder="0"
                      keyboardType="numeric"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={errors.currentStock?.message}
                    />
                  )}
                />

                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="lowStockAlert"
                      render={({ field }) => (
                        <Input
                          label="Low Stock Alert"
                          placeholder="0"
                          keyboardType="numeric"
                          value={field.value}
                          onChangeText={field.onChange}
                        />
                      )}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="reorderLevel"
                      render={({ field }) => (
                        <Input
                          label="Reorder Level"
                          placeholder="0"
                          keyboardType="numeric"
                          value={field.value}
                          onChangeText={field.onChange}
                        />
                      )}
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
          onNext={handleSubmit((data) => {
            updateProduct({
              price: Number(data.sellingPrice),

              costPrice: Number(data.costPrice),

              stock: Number(data.currentStock),

              lowStockAlert: Number(data.lowStockAlert),

              reorderLevel: Number(data.reorderLevel),
            });

            router.push(ROUTES.ADD_PRODUCT_VARIANTS);
          })}
        />
      </View>
    </SafeAreaView>
  );
}
