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

  const [category, setCategory] = useState("");

  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState([
    {
      label: "Bags",
      value: "bags",
    },
    {
      label: "Accessories",
      value: "accessories",
    },
    {
      label: "Shoes",
      value: "shoes",
    },
  ]);

  const [sku, setSku] = useState("");

  function generateSku() {
    const randomSku = `SKU-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    setSku(randomSku);
  }

  function createCategory() {
    if (!newCategory.trim()) {
      return;
    }

    const value = newCategory.trim().toLowerCase().replace(/\s+/g, "-");

    const exists = categories.some((category) => category.value === value);

    if (exists) {
      return;
    }

    const categoryOption = {
      label: newCategory.trim(),
      value,
    };

    setCategories((current) => [...current, categoryOption]);

    setCategory(categoryOption.value);

    setNewCategory("");
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
                  justifyContent: "space-between",
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

              <View style={{ marginTop: spacing.md }}>
                <Input
                  label="Product Name"
                  required
                  placeholder="e.g Ankara Tote Bag"
                />
              </View>
            </View>

            <View style={{ marginTop: spacing.md }}>
              <Input
                label="Description"
                variant="textarea"
                optional
                maxLength={250}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Dropdown
                label="Category"
                required
                value={category}
                options={categories}
                placeholder="Select category"
                onSelect={setCategory}
              />

              <View
                style={{
                  marginTop: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <Input
                  label="Create Category"
                  placeholder="e.g Travel Bags"
                  value={newCategory}
                  onChangeText={setNewCategory}
                />

                <Button
                  title="Add Category"
                  variant="tertiary"
                  onPress={createCategory}
                />
              </View>
            </View>

            <View style={{ marginTop: spacing.md }}>
              <Input
                label="Brand"
                optional
                placeholder="e.g. PayXpress Originals"
              />
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <AppText variant="caption" color="secondary">
                SKU
              </AppText>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: spacing.sm,
                  marginTop: spacing.sm,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Input
                    placeholder="Enter manually"
                    value={sku}
                    onChangeText={setSku}
                  />
                </View>

                <Button
                  title="Auto"
                  variant="tertiary"
                  leftIcon={
                    <Ionicons
                      name="refresh"
                      size={18}
                      color={theme.action.tertiary.text}
                    />
                  }
                  onPress={generateSku}
                />
              </View>
            </View>
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
