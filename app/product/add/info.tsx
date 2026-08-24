import { View, ScrollView, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ImageActionCard } from "@/components/ui/ImageActionCard";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";

import { spacing, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import * as ImagePicker from "expo-image-picker";

import { useState } from "react";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  productInfoSchema,
  ProductInfoForm,
} from "@/schemas/productInfoSchema";

import { useProductDraftStore } from "@/store/product/productDraftStore";

import { useCategories } from "@/hooks/categories/useCategories";
import { useCreateCategory } from "@/hooks/categories/useCreateCategory";

import { useToast } from "@/hooks/useToast";

/**
 * ============================================================================
 * PRODUCT INFO SCREEN
 * ============================================================================
 */

export default function InfoScreen() {
  /**
   * ==========================================================================
   * PRODUCT DRAFT
   * ==========================================================================
   */

  const { product, updateProduct } = useProductDraftStore();

  /**
   * ==========================================================================
   * FORM
   * ==========================================================================
   */

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ProductInfoForm>({
    resolver: zodResolver(productInfoSchema),

    defaultValues: {
      productName: product.productName,
      description: product.description,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      image: product.image,
    },
  });

  const [newCategory, setNewCategory] = useState("");

  /**
   * ==========================================================================
   * API CATEGORIES
   * ==========================================================================
   *
   * The hook remains active so API mode continues to work normally.
   *
   * In mock mode its result is ignored.
   */

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  /**
   * ==========================================================================
   * CATEGORY SOURCE OF TRUTH
   * ==========================================================================
   */

  const categoryOptions = categories
    .filter((category) => category.isActive)
    .map((category) => ({
      label: category.name,
      value: String(category.id),
    }));

  const isCategoryLoading = categoriesLoading;

  const isCategoryError = categoriesError;

  /**
   * ==========================================================================
   * CREATE CATEGORY MUTATION
   * ==========================================================================
   */

  const createCategoryMutation = useCreateCategory();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * GALLERY
   * ==========================================================================
   */

  const [galleryImages, setGalleryImages] = useState<string[]>(
    product.image ? [product.image] : []
  );

  /**
   * ==========================================================================
   * IMAGE CONFIGURATION
   * ==========================================================================
   */

  const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  };

  /**
   * ==========================================================================
   * CAMERA
   * ==========================================================================
   */

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      showToast({
        type: "error",
        title: "Camera Permission Required",
        message: "Please allow camera access to take a product photo.",
      });

      return;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];

    if (!asset) {
      return;
    }

    setValue("image", asset.uri, {
      shouldValidate: true,
      shouldDirty: true,
    });

    updateProduct({
      image: asset.uri,
    });

    setGalleryImages([asset.uri]);

    clearErrors("image");
  };

  /**
   * ==========================================================================
   * GALLERY
   * ==========================================================================
   */

  const handleGallery = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];

    if (!asset) {
      return;
    }

    setValue("image", asset.uri, {
      shouldValidate: true,
      shouldDirty: true,
    });

    updateProduct({
      image: asset.uri,
    });

    setGalleryImages([asset.uri]);

    clearErrors("image");
  };

  /**
   * ==========================================================================
   * IMAGE
   * ==========================================================================
   */

  const imageUri = watch("image");

  /**
   * ==========================================================================
   * REMOVE IMAGE
   * ==========================================================================
   */

  const handleRemoveImage = () => {
    setValue("image", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    updateProduct({
      image: "",
    });

    setGalleryImages([]);

    clearErrors("image");
  };

  /**
   * ==========================================================================
   * GENERATE SKU
   * ==========================================================================
   */

  function generateSku() {
    const timestamp = Date.now().toString().slice(-4);

    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    setValue("sku", `SKU-${random}-${timestamp}`, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  /**
   * ==========================================================================
   * CREATE CATEGORY
   * ==========================================================================
   */

  async function handleCreateCategory() {
    const categoryName = newCategory.trim();

    if (!categoryName) {
      return;
    }

    try {
      const category = await createCategoryMutation.mutateAsync({
        name: categoryName,
      });

      if (!category) {
        throw new Error("Category could not be created.");
      }

      setValue("category", String(category.id), {
        shouldValidate: true,
        shouldDirty: true,
      });

      setNewCategory("");

      showToast({
        type: "success",
        title: "Category Created",
        message: `${category.name} has been added.`,
      });
    } catch (error) {
      console.log("CREATE CATEGORY ERROR", error);

      showToast({
        type: "error",
        title: "Unable to Create Category",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  /**
   * ==========================================================================
   * NEXT
   * ==========================================================================
   */

  function handleNext(data: ProductInfoForm) {
    updateProduct({
      productName: data.productName,

      description: data.description,

      category: data.category,

      brand: data.brand,

      sku: data.sku,

      image: data.image,
    });

    router.push(ROUTES.ADD_PRODUCT_PRICING);
  }

  /**
   * ==========================================================================
   * UI
   * ==========================================================================
   */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
      edges={["top"]}
    >
      {/* ======================================================================
          HEADER
      ====================================================================== */}

      <AddProductHeader
        title="Add New Product"
        step={1}
        totalSteps={5}
        progress={20}
        label="Info"
      />

      <Divider />

      {/* ======================================================================
          CONTENT
      ====================================================================== */}

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
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="body" color="secondary">
            Tell shoppers what they're buying. Add a great photo and clear name.
          </AppText>

          {/* ==================================================================
              PRODUCT IMAGE
          ================================================================== */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
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
                  iconColor={theme.state.error.icon}
                  disabled={!imageUri}
                  onPress={handleRemoveImage}
                />
              </View>

              {errors.image && (
                <AppText
                  variant="caption"
                  color="error"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {errors.image.message}
                </AppText>
              )}

              {/* ==============================================================
                  PRODUCT NAME
              ============================================================== */}

              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <Controller
                  control={control}
                  name="productName"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Input
                      label="Product Name"
                      required
                      placeholder="e.g Ankara Tote Bag"
                      value={value}
                      error={error?.message}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>

            {/* ==================================================================
                DESCRIPTION
            ================================================================== */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Description"
                    variant="textarea"
                    optional
                    maxLength={250}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* ==================================================================
                CATEGORY
            ================================================================== */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="category"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Dropdown
                    label="Category"
                    required
                    value={value}
                    error={
                      error?.message ??
                      (isCategoryError
                        ? "Unable to load categories."
                        : undefined)
                    }
                    disabled={isCategoryLoading}
                    options={categoryOptions}
                    placeholder={
                      isCategoryLoading
                        ? "Loading categories..."
                        : "Select category"
                    }
                    onSelect={onChange}
                  />
                )}
              />

              {/* ==============================================================
                  CREATE CATEGORY
              ============================================================== */}

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
                  loading={createCategoryMutation.isPending}
                  disabled={
                    !newCategory.trim() || createCategoryMutation.isPending
                  }
                  onPress={handleCreateCategory}
                />
              </View>
            </View>

            {/* ==================================================================
                BRAND
            ================================================================== */}

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Controller
                control={control}
                name="brand"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Brand"
                    optional
                    placeholder="e.g. PayXpress Originals"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* ==================================================================
                SKU
            ================================================================== */}

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
                  <Controller
                    control={control}
                    name="sku"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Enter manually"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
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

        {/* ======================================================================
            FOOTER
        ====================================================================== */}

        <AddProductFooter
          onSaveDraft={() => {
            console.log("Save Draft");
          }}
          onNext={handleSubmit(handleNext)}
        />
      </View>
    </SafeAreaView>
  );
}
