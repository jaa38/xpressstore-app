import { View, Pressable, ScrollView, Switch } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";
import { ROUTES } from "@/navigation/routes";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";
import { useState } from "react";
import { ImageActionCard } from "@/components/ui/ImageActionCard";

import * as ImagePicker from "expo-image-picker";
import { Input } from "@/components/ui/Input";
import { UICard } from "@/components/ui/UICard";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  storefrontSchema,
  type StorefrontFormData,
  SHIPPING_CLASSES,
} from "@/schemas/storefrontSchema";

type ShippingClass = (typeof SHIPPING_CLASSES)[number];

export default function StorefrontScreen() {
  // const [video, setVideo] = useState(false);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<StorefrontFormData>({
    resolver: zodResolver(storefrontSchema),

    defaultValues: {
      visible: true,

      images: [],

      dimensions: {
        weight: "",
        length: "",
        width: "",
        height: "",
      },

      shippingClass: "Standard",

      deliveryNotes: "",
    },
  });

  const images = watch("images");
  const shippingClass = watch("shippingClass");

  const MAX_IMAGES = 5;

  const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: MAX_IMAGES,
    quality: 0.8,
  };

  async function addImage() {
    if (images.length >= MAX_IMAGES) {
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

    if (result.canceled) {
      return;
    }

    const selectedImages = result.assets.map((asset) => asset.uri);

    const remainingSlots = MAX_IMAGES - images.length;

    setValue("images", [...images, ...selectedImages.slice(0, remainingSlots)]);
  }

  function removeImage(uri: string) {
    setValue(
      "images",
      images.filter((image) => image !== uri)
    );
  }

  function sanitizeDecimal(value: string) {
    let sanitized = value.replace(/[^0-9.]/g, "");

    const parts = sanitized.split(".");

    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }

    return sanitized;
  }

  function handleNext(data: StorefrontFormData) {
    console.log(data);

    router.push(ROUTES.ADD_PRODUCT_REVIEW);
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
        title="Storefront Settings"
        step={4}
        totalSteps={5}
        progress={80}
        label="Storefront"
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
          <View>
            <View style={{ gap: spacing.md }}>
              <AppText variant="h3" color="primary">
                Storefront Visibility
              </AppText>

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
                      Display on Storefront
                    </AppText>

                    <AppText variant="body" color="secondary">
                      Customers can find and buy this product
                    </AppText>
                  </View>

                  <Controller
                    control={control}
                    name="visible"
                    render={({ field }) => (
                      <Switch
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </View>
              </Card>
            </View>

            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              <View style={{ gap: spacing.xs }}>
                <AppText variant="h3" color="primary">
                  Additional Media
                </AppText>
                <AppText color="secondary">
                  Show your product from multiple angles
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: spacing.rg,
                }}
              >
                {images.map((image, index) => (
                  <View
                    key={image}
                    style={{
                      position: "relative",
                    }}
                  >
                    <ImageActionCard
                      title={`Image ${index + 1}`}
                      icon="image-outline"
                      imageUri={image}
                    />

                    <Pressable
                      onPress={() => removeImage(image)}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,

                        width: 24,
                        height: 24,

                        borderRadius: radius.full,

                        backgroundColor: theme.state.error.background,

                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={theme.state.error.icon}
                      />
                    </Pressable>
                  </View>
                ))}

                <ImageActionCard
                  title="Add"
                  icon="camera-outline"
                  disabled={images.length >= MAX_IMAGES}
                  onPress={addImage}
                />
              </View>

              {/* Set Video */}
              {/* <View>
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
                        Product Video
                      </AppText>

                      <AppText variant="body" color="secondary">
                        Upload a short product video
                      </AppText>
                    </View>

                    <Switch
                      value={video}
                      onValueChange={setVideo}
                      style={{
                        alignSelf: "center",
                      }}
                    />
                  </View>
                </Card>
              </View> */}
            </View>

            <View style={{ marginTop: spacing.md, gap: spacing.md }}>
              <View style={{ gap: spacing.xs }}>
                <AppText variant="h3" color="primary">
                  Product Dimensions
                </AppText>
                <AppText color="secondary">
                  Helps calculate shipping costs
                </AppText>
              </View>
              <View
                style={{
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="dimensions.weight"
                      render={({ field }) => (
                        <Input
                          label="Weight"
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          value={field.value}
                          onChangeText={(value) =>
                            field.onChange(sanitizeDecimal(value))
                          }
                          error={errors.dimensions?.weight?.message}
                          rightElement={
                            <AppText
                              style={{
                                paddingRight: spacing.md,
                              }}
                              color="secondary"
                            >
                              kg
                            </AppText>
                          }
                        />
                      )}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="dimensions.length"
                      render={({ field }) => (
                        <Input
                          label="length"
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          value={field.value}
                          onChangeText={(value) =>
                            field.onChange(sanitizeDecimal(value))
                          }
                          error={errors.dimensions?.length?.message}
                          rightElement={
                            <AppText
                              style={{
                                paddingRight: spacing.md,
                              }}
                              color="secondary"
                            >
                              cm
                            </AppText>
                          }
                        />
                      )}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="dimensions.width"
                      render={({ field }) => (
                        <Input
                          label="Width"
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          value={field.value}
                          onChangeText={(value) =>
                            field.onChange(sanitizeDecimal(value))
                          }
                          error={errors.dimensions?.width?.message}
                          rightElement={
                            <AppText
                              style={{
                                paddingRight: spacing.md,
                              }}
                              color="secondary"
                            >
                              cm
                            </AppText>
                          }
                        />
                      )}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="dimensions.height"
                      render={({ field }) => (
                        <Input
                          label="Height"
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          value={field.value}
                          onChangeText={(value) =>
                            field.onChange(sanitizeDecimal(value))
                          }
                          error={errors.dimensions?.height?.message}
                          rightElement={
                            <AppText
                              style={{
                                paddingRight: spacing.md,
                              }}
                              color="secondary"
                            >
                              cm
                            </AppText>
                          }
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                marginTop: spacing.md,
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h3" color="primary">
                  Shipping & Fulfilment
                </AppText>

                <AppText color="secondary">
                  Configure shipping requirements and handling instructions.
                </AppText>
              </View>

              <View>
                <AppText variant="label" color="secondary">
                  Shipping Class
                </AppText>

                <View
                  style={{
                    marginTop: spacing.sm,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                  }}
                >
                  {SHIPPING_CLASSES.map((shippingType) => (
                    <UICard
                      key={shippingType}
                      title={shippingType}
                      variant={
                        shippingClass === shippingType ? "active" : "default"
                      }
                      onPress={() => setValue("shippingClass", shippingType)}
                    />
                  ))}
                </View>
              </View>
              <Controller
                control={control}
                name="deliveryNotes"
                render={({ field }) => (
                  <Input
                    label="Delivery Notes"
                    optional
                    placeholder="e.g. Handle with care, fragile"
                    maxLength={300}
                    variant="textarea"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.deliveryNotes?.message}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <AddProductFooter onNext={handleSubmit(handleNext)} />
      </View>
    </SafeAreaView>
  );
}
