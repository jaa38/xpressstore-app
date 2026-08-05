import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  BackHandler,
  Switch,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";

import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";

import { Button } from "@/components/ui/Button";

import { ImageActionCard } from "@/components/ui/ImageActionCard";

import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { AppText } from "@/components/ui/AppText";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { spacing, theme } from "@/theme";

import { useProduct } from "@/hooks/products/useProduct";

import { useCreateCategory } from "@/hooks/categories/useCreateCategory";

import { useCategories } from "@/hooks/categories/useCategories";

import * as ImagePicker from "expo-image-picker";

import { useToast } from "@/hooks/useToast";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  editProductSchema,
  EditProductForm,
} from "@/schemas/editProductSchema";

import { useUploadProductImages } from "@/hooks/products/useUploadProductImages";

import type { UpdateProductRequest } from "@/types/product";

import type { ProductImageDto } from "@/types/product";

import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const { product, isLoading: loading } = useProduct(Number(id));

  const { data: categories = [] } = useCategories();

  // const [visible, setVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const createCategoryMutation = useCreateCategory();

  const [saving, setSaving] = useState(false);

  const [hasSaved, setHasSaved] = useState(false);

  const { showToast } = useToast();

  const updateProductMutation = useUpdateProduct();

  const uploadImagesMutation = useUploadProductImages();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isValid },
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),

    defaultValues: {
      productName: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      visible: false,
    },
  });

  const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  };

  useEffect(() => {
    if (!product) {
      return;
    }

    reset({
      productName: product.productName,

      category: product.productCategories?.[0]?.toString() ?? "",

      description: product.description,

      price: String(product.unitPrice),

      stock: String(product.totalInStock),

      image: product.productImages?.[0]?.url ?? "",

      visible: product.isActive,
    });
  }, [product, reset]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (!isDirty) {
            return false;
          }

          confirmDiscardChanges(() => {
            router.back();
          });

          return true;
        }
      );

      return () => subscription.remove();
    }, [isDirty])
  );

  async function handleCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);

    if (!result.canceled) {
      const asset = result.assets?.[0];

      if (asset) {
        setValue("image", asset.uri, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }

  async function handleGallery() {
    const result =
      await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

    if (!result.canceled) {
      const asset = result.assets?.[0];

      if (asset) {
        setValue("image", asset.uri, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }

  function handleRemoveImage() {
    Alert.alert(
      "Remove Product Image?",
      "This will remove the current product image. You can always add another one before saving.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setValue("image", "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        },
      ]
    );
  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) {
      return;
    }

    try {
      const category = await createCategoryMutation.mutateAsync(newCategory);

      setValue("category", category.value);

      setNewCategory("");

      showToast({
        type: "success",
        title: "Category Created",
        message: `${category.label} has been added.`,
      });
    } catch (error) {
      console.log("CREATE CATEGORY ERROR", error);

      showToast({
        type: "error",
        title: "Unable to Create Category",
        message: "Please try again.",
      });
    }
  }

  async function handleUpdateProduct(data: EditProductForm) {
    try {
      setSaving(true);

      let images: ProductImageDto[] = product?.productImages ?? [];

      const selectedImage = data.image.trim();

      /**
       * Upload only if a new local image
       * has been selected.
       */
      if (selectedImage && !selectedImage.startsWith("http")) {
        images = await uploadImagesMutation.mutateAsync([selectedImage]);
      }

      const payload: UpdateProductRequest = {
        id: Number(id),

        name: data.productName.trim(),

        description: data.description.trim(),

        youtubeLink: product?.youtubeLink ?? "",

        currency: product?.currency ?? "NGN",

        price: Number(data.price),

        unit: "",

        productLocation: "",

        minOrderQty: "",

        hasVariants: (product?.variations.length ?? 0) > 0,

        images,

        categoryIds: data.category ? [Number(data.category)] : [],

        variations: product?.variations ?? [],

        options: [],

        publishNow: data.visible,
      };

      await updateProductMutation.mutateAsync({
        productId: Number(id),
        payload,
      });

      showToast({
        type: "success",
        title: "Product Updated",
        message: "Changes saved successfully.",
      });

      setHasSaved(true);

      router.back();
    } catch (error) {
      console.log("UPDATE PRODUCT ERROR", error);

      showToast({
        type: "error",
        title: "Update Failed",
        message: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  function confirmDiscardChanges(onDiscard: () => void) {
    if (!isDirty || hasSaved) {
      onDiscard();
      return;
    }

    Alert.alert(
      "Discard Changes?",
      "You have unsaved changes. Are you sure you want to leave?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: onDiscard,
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={theme.icon.branding.icon} />

        <AppText
          style={{
            marginTop: spacing.md,
          }}
        >
          Loading product...
        </AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <ScreenHeader
        title="Edit Product"
        onBack={() =>
          confirmDiscardChanges(() => {
            router.back();
          })
        }
      />
      <Divider />

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
            gap: spacing.md,
          }}
        >
          <AppText variant="caption">Product Image</AppText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ImageActionCard
              title="Take Photo"
              icon="camera-outline"
              imageUri={watch("image") || undefined}
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
              disabled={!watch("image")}
              onPress={handleRemoveImage}
            />
          </View>

          <Controller
            control={control}
            name="productName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Product Name"
                required
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Dropdown
                label="Category"
                required
                value={value}
                error={error?.message}
                options={categories}
                placeholder="Select category"
                onSelect={onChange}
              />
            )}
          />

          <View
            style={{
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
              onPress={handleCreateCategory}
            />
          </View>

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Selling Price"
                keyboardType="numeric"
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="stock"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Stock"
                keyboardType="numeric"
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: spacing.sm,
            }}
          >
            <View
              style={{
                flex: 1,
                marginRight: spacing.md,
              }}
            >
              <AppText variant="bodyLargeBold">Visible</AppText>

              <AppText variant="bodySmall" color="secondary">
                Make this product visible to customers.
              </AppText>
            </View>

            <View
              style={{
                width: 56,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Controller
                control={control}
                name="visible"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{
                      false: theme.input.border,
                      true: theme.icon.branding.icon,
                    }}
                    thumbColor="#FFFFFF"
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Description"
                variant="textarea"
                value={value}
                error={error?.message}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <Button
          title="Save Changes"
          variant="primary"
          loading={saving}
          disabled={saving || !isDirty || !isValid}
          onPress={handleSubmit(handleUpdateProduct)}
          style={{
            marginTop: spacing.lg,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
