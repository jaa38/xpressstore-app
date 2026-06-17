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

import { useForm, Controller, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { UICard } from "@/components/ui/UICard";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { variantSchema, type VariantFormData } from "@/schemas/variantSchema";

import { zodResolver } from "@hookform/resolvers/zod";

import { useProduct } from "@/store/product/useProduct";

export default function VariantsScreen() {
  const { product, updateProduct } = useProduct();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),

    defaultValues: {
      variantsEnabled: product.variantsEnabled,

      variantTypes: product.variants,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variantTypes",
  });

  const variants = watch("variantsEnabled");

  const [optionInputs, setOptionInputs] = useState<Record<string, string>>({});

  function addVariantType() {
    append({
      name: "",
      options: [],
    });
  }

  function addOption(index: number) {
    const variant = watch(`variantTypes.${index}`);

    const field = fields[index];

    if (!field || !variant) {
      return;
    }

    const fieldId = field.id;

    const value = optionInputs[fieldId]?.trim();

    if (!value) {
      return;
    }

    setValue(`variantTypes.${index}.options`, [...variant.options, value]);

    setOptionInputs((current) => ({
      ...current,
      [fieldId]: "",
    }));
  }

  function deleteVariant(index: number) {
    remove(index);
  }

  function handleNext(data: VariantFormData) {
    updateProduct({
      variantsEnabled: data.variantsEnabled,

      variants: data.variantTypes,
    });

    router.push(ROUTES.ADD_PRODUCT_STOREFRONT);
  }

  function deleteOption(variantIndex: number, optionIndex: number) {
    const variant = watch(`variantTypes.${variantIndex}`);

    if (!variant) {
      return;
    }

    const updatedOptions = variant.options.filter(
      (_, index) => index !== optionIndex
    );

    setValue(`variantTypes.${variantIndex}.options`, updatedOptions, {
      shouldValidate: true,
    });
  }

  function RightActions(index: number) {
    return (
      <Pressable
        onPress={() => deleteVariant(index)}
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

                <Controller
                  control={control}
                  name="variantsEnabled"
                  render={({ field }) => (
                    <Switch
                      value={field.value}
                      onValueChange={field.onChange}
                      style={{
                        alignSelf: "center",
                      }}
                    />
                  )}
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
            {errors.variantTypes?.message && (
              <AppText variant="caption" color="error">
                {errors.variantTypes.message}
              </AppText>
            )}

            {/* GENERATED VARIANT CARDS */}

            {variants &&
              fields.map((field, index) => (
                <Swipeable
                  key={field.id}
                  renderRightActions={() => RightActions(index)}
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
                    <Controller
                      control={control}
                      name={`variantTypes.${index}.name`}
                      render={({ field }) => (
                        <TextField
                          placeholder="Variant type (e.g. Size)"
                          value={field.value}
                          onChangeText={field.onChange}
                          error={errors.variantTypes?.[index]?.name?.message}
                        />
                      )}
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
                          value={optionInputs[field.id] ?? ""}
                          onChangeText={(value) =>
                            setOptionInputs((current) => ({
                              ...current,
                              [field.id]: value,
                            }))
                          }
                        />
                      </View>

                      <Button
                        title="Add"
                        variant="primary"
                        onPress={() => addOption(index)}
                      />
                    </View>

                    {(watch(`variantTypes.${index}.options`) ?? []).length >
                      0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: spacing.sm,
                        }}
                      >
                        {watch(`variantTypes.${index}.options`).map(
                          (option, optionIndex) => (
                            <UICard
                              key={optionIndex}
                              title={option}
                              variant="active"
                              rightElement={
                                <Pressable
                                  hitSlop={12}
                                  onPress={() =>
                                    deleteOption(index, optionIndex)
                                  }
                                >
                                  <Ionicons
                                    name="close"
                                    size={16}
                                    color="white"
                                  />
                                </Pressable>
                              }
                            />
                          )
                        )}
                      </View>
                    )}
                  </Card>
                </Swipeable>
              ))}
          </View>
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <AddProductFooter onNext={handleSubmit(handleNext)} />
      </View>
    </SafeAreaView>
  );
}
