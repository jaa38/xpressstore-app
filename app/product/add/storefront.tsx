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

export default function StorefrontScreen() {
  const [visible, setVisible] = useState(true);
  const [video, setVideo] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const imageUri = "image";
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

    setImages((current) => {
      const remainingSlots = MAX_IMAGES - current.length;

      return [...current, ...selectedImages.slice(0, remainingSlots)];
    });
  }

  function removeImage(uri: string) {
    setImages((current) => current.filter((image) => image !== uri));
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

                  <Switch
                    value={visible}
                    onValueChange={setVisible}
                    style={{
                      alignSelf: "center",
                    }}
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
              <AppText variant="h3" color="primary">
                Product Dimensions
              </AppText>
            </View>
          </View>
        </ScrollView>
        <Divider />

        {/* FOOTER */}

        <AddProductFooter
          onNext={() => router.push(ROUTES.ADD_PRODUCT_REVIEW)}
        />
      </View>
    </SafeAreaView>
  );
}
