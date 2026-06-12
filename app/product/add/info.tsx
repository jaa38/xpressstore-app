import { View, ScrollView, Pressable, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { ImageActionCard } from "@/components/ui/ImageActionCard";

import { spacing, theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

import * as ImagePicker from "expo-image-picker";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";

export default function InfoScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);

    if (!result.canceled) {
      const asset = result.assets?.[0];

      if (asset) {
        setImageUri(asset.uri);
      }
    }
  };

  const handleGallery = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

    if (!result.canceled) {
      const asset = result.assets?.[0];

      if (asset) {
        setImageUri(asset.uri);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const [description, setDescription] = useState("");

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

            <AppText variant="h3">Product Information</AppText>

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
              Step 1 of 5
            </AppText>

            <AppText variant="bodySmallBold" color="success">
              Info
            </AppText>
          </View>

          <View
            style={{
              marginTop: spacing.rg,
            }}
          >
            <ProgressBar progress={20} />
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
          showsVerticalScrollIndicator={true}
        >
          <AppText variant="body" color="secondary">
            Tell shoppers what they're buying. Add a great photo and clear name.
          </AppText>

          <View style={{ marginTop: spacing.lg }}>
            <AppText variant="caption">Product Image</AppText>
            <View
              style={{
                marginTop: spacing.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                }}
              >
                <ImageActionCard
                  title="Take Photo"
                  icon="camera-outline"
                  imageUri={imageUri ?? undefined}
                  onPress={handleCamera}
                />

                <ImageActionCard
                  title="Gallery"
                  icon="image-outline"
                  onPress={handleGallery}
                />

                <ImageActionCard
                  title="Remove"
                  icon="trash-outline"
                  disabled={!imageUri}
                  onPress={handleRemoveImage}
                />
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <Input
                  label="Product Name"
                  required
                  placeholder="e.g Ankara Tote Bag"
                />
              </View>
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="Description"
                variant="textarea"
                placeholder="Describe your product..."
                value={description}
                onChangeText={setDescription}
                maxLength={250}
              />
            </View>
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <Dropdown />
          </View>
        </ScrollView>
        <Divider />

        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
            paddingTop: spacing.md,
            backgroundColor: theme.background.surface,

            flexDirection: "row",

            gap: spacing.md,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Button title="Save as Draft" variant="tertiary" />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Button
              title="Next"
              onPress={() => router.push(ROUTES.ADD_PRODUCT_PRICING)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
