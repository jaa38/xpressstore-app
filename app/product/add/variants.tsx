import { View, ScrollView, Switch, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { Card } from "@/components/ui/Card";

import { radius, spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";
import { router } from "expo-router";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function VariantsScreen() {
  const [variants, setVariants] = useState(false);

  const [variantTypes, setVariantTypes] = useState<
    {
      id: string;
      name: string;
      optionInput: string;
      options: string[];
    }[]
  >([]);

  function addVariantType() {
    setVariantTypes((current) => [
      ...current,
      {
        id: Date.now().toString(),
        name: "",
        optionInput: "",
        options: [],
      },
    ]);
  }

  function updateVariantName(variantId: string, value: string) {
    setVariantTypes((current) =>
      current.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              name: value,
            }
          : variant
      )
    );
  }

  function updateOptionInput(variantId: string, value: string) {
    setVariantTypes((current) =>
      current.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              optionInput: value,
            }
          : variant
      )
    );
  }

  function addOption(variantId: string) {
    setVariantTypes((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) {
          return variant;
        }

        const value = variant.optionInput.trim();

        if (!value) {
          return variant;
        }

        return {
          ...variant,
          options: [...variant.options, value],
          optionInput: "",
        };
      })
    );
  }

  function deleteVariant(variantId: string) {
    setVariantTypes((current) =>
      current.filter((variant) => variant.id !== variantId)
    );
  }

  function RightActions(variantId: string) {
    return (
      <Pressable
        onPress={() => deleteVariant(variantId)}
        style={{
          width: 80,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",

          backgroundColor: theme.state.error.background,

          borderTopRightRadius: radius.md,
          borderBottomRightRadius: radius.md,
        }}
      >
        <Ionicons
          name="trash-outline"
          size={28}
          color={theme.state.error.icon}
        />
      </Pressable>
    );
  }

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
        title="Add New Product"
        step={3}
        totalSteps={5}
        progress={60}
        label="Variants"
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
          showsVerticalScrollIndicator={true}
        >
          <View
            style={{
              gap: spacing.md,
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
                    Enable Variants
                  </AppText>

                  <AppText variant="body" color="secondary">
                    Add sizes, colors or other options
                  </AppText>
                </View>

                <Switch
                  value={variants}
                  onValueChange={setVariants}
                  style={{
                    alignSelf: "center",
                  }}
                />
              </View>
            </Card>

            {/* EMPTY STATE */}

            {!variants && (
              <Card
                style={{
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.full,

                    backgroundColor: theme.icon.branding.background,

                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="cube-outline"
                    size={32}
                    color={theme.icon.branding.icon}
                  />
                </View>

                <AppText variant="bodyLargeBold" color="primary">
                  No variants yet
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                  style={{
                    textAlign: "center",
                  }}
                >
                  Add size, colour, or other options for this product.
                </AppText>
              </Card>
            )}

            {/* ADD VARIANT BUTTON */}

            {variants && (
              <Button
                title="Add Variant Type"
                variant="tertiary"
                onPress={addVariantType}
              />
            )}

            {/* GENERATED VARIANT CARDS */}

            {variants &&
              variantTypes.map((variant, index) => (
                <Swipeable
                  key={variant.id}
                  renderRightActions={() => RightActions(variant.id)}
                  containerStyle={{
                    borderRadius: radius.md,
                    overflow: "hidden",
                  }}
                >
                  <Card
                    style={{
                      gap: spacing.md,
                    }}
                  >
                    <TextField
                      placeholder="Variant type (e.g. Size)"
                      value={variant.name}
                      onChangeText={(value) =>
                        updateVariantName(variant.id, value)
                      }
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        gap: spacing.md,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <TextField
                          placeholder="Add Value (e.g. Small)"
                          value={variant.optionInput}
                          onChangeText={(value) =>
                            updateOptionInput(variant.id, value)
                          }
                        />
                      </View>

                      <Button
                        title="Add"
                        variant="primary"
                        onPress={() => addOption(variant.id)}
                      />
                    </View>

                    {variant.options.length > 0 && (
                      <View
                        style={{
                          gap: spacing.sm,
                        }}
                      >
                        {variant.options.map((option, index) => (
                          <Card key={`${variant.id}-${index}`} variant="active">
                            <AppText>{option}</AppText>
                          </Card>
                        ))}
                      </View>
                    )}
                  </Card>
                </Swipeable>
              ))}
          </View>
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <AddProductFooter
          onNext={() => router.push(ROUTES.ADD_PRODUCT_STOREFRONT)}
        />
      </View>
    </SafeAreaView>
  );
}
