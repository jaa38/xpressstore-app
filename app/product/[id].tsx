import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  BackHandler,
  Switch,
  Image,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";

import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";

import { Button } from "@/components/ui/Button";

import { ImageActionCard } from "@/components/ui/ImageActionCard";

import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
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

import { useUploadProductImage } from "@/hooks/products/useUploadProductImage";

import type { UpdateProductRequest } from "@/types/product";

import type { ProductImageDto } from "@/types/product";

import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";

import type { Currency } from "@/types/currency";

import { Card } from "@/components/ui/Card";

import { buildVariantPayload } from "@/utils/products/buildProductPayload";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const { product, isLoading: loading } = useProduct(Number(id));

  const { data: categories = [] } = useCategories();

  // const [visible, setVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const createCategoryMutation = useCreateCategory();

  const [saving, setSaving] = useState(false);

  const [hasSaved, setHasSaved] = useState(false);

  const { showToast } = useToast();

  const updateProductMutation = useUpdateProduct();

  const uploadImagesMutation = useUploadProductImage();

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

  const MAX_GALLERY_IMAGES = 5;

  useEffect(() => {
    if (!product) {
      return;
    }

    const images = product.productImages?.map((image) => image.url) ?? [];

    setGalleryImages(images);

    reset({
      productName: product.productName,

      category: product.productCategories?.[0]?.toString() ?? "",

      description: product.description,

      price: String(product.unitPrice),

      stock: String(product.totalInStock),

      image: images[0] ?? "",

      visible: product.isActive,

      youtubeLink: product.youtubeLink ?? "",

      unit: product.unit ?? "",

      productLocation: product.productLocation ?? "",

      minOrderQty: product.minOrderQty ?? "",
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
    if (galleryImages.length >= MAX_GALLERY_IMAGES) {
      showToast({
        type: "error",
        title: "Gallery Full",
        message: `Maximum of ${MAX_GALLERY_IMAGES} images allowed.`,
      });

      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);

    if (!result.canceled) {
      const asset = result.assets?.[0];

      if (asset) {
        setGalleryImages((current) => {
          const updated = [...current, asset.uri];

          setValue("image", updated[0] ?? "", {
            shouldDirty: true,
            shouldValidate: true,
          });

          return updated;
        });
      }
    }
  }

  async function handleGallery() {
    if (galleryImages.length >= MAX_GALLERY_IMAGES) {
      showToast({
        type: "error",
        title: "Gallery Full",
        message: `Maximum of ${MAX_GALLERY_IMAGES} images allowed.`,
      });

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      ...IMAGE_PICKER_OPTIONS,

      allowsMultipleSelection: true,

      selectionLimit: MAX_GALLERY_IMAGES - galleryImages.length,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);

      setGalleryImages((current) => {
        /**
         * Remove duplicates
         */
        const merged = [...current, ...selectedImages];

        const uniqueImages = [...new Set(merged)].slice(0, MAX_GALLERY_IMAGES);

        setValue("image", uniqueImages[0] ?? "", {
          shouldDirty: true,
          shouldValidate: true,
        });

        return uniqueImages;
      });
    }
  }

  // function handleRemoveImage() {
  //   Alert.alert(
  //     "Remove Product Image?",
  //     "This will remove the current product image. You can always add another one before saving.",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //       },
  //       {
  //         text: "Remove",
  //         style: "destructive",
  //         onPress: () => {
  //           setValue("image", "", {
  //             shouldDirty: true,
  //             shouldValidate: true,
  //           });
  //         },
  //       },
  //     ]
  //   );
  // }

  function removeGalleryImage(index: number) {
    Alert.alert(
      "Remove Image?",
      "This image will be permanently removed from this product when you save your changes.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setGalleryImages((current) => {
              const updated = current.filter((_, i) => i !== index);

              setValue("image", updated[0] ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              });

              return updated;
            });
          },
        },
      ]
    );
  }

  function makeCoverImage(index: number) {
    if (index === 0) {
      return;
    }

    setGalleryImages((current) => {
      const selected = current[index];

      if (!selected) {
        return current;
      }

      const reordered = [selected, ...current.filter((_, i) => i !== index)];

      setValue("image", reordered[0] ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      return reordered;
    });
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

  const variantPayload = buildVariantPayload(
    product?.variations ?? [],
    (product?.variations.length ?? 0) > 0
  );
  
  async function handleUpdateProduct(data: EditProductForm) {
    try {
      setSaving(true);

      /**
       * Build the gallery payload while preserving:
       *
       * • Existing remote images
       * • Newly selected local images
       * • Image order (cover image first)
       */
      let images: ProductImageDto[] = [];

      if (galleryImages.length > 0) {
        const remoteImages = galleryImages.filter((uri) =>
          uri.startsWith("http")
        );

        const localImages = galleryImages.filter(
          (uri) => !uri.startsWith("http")
        );

        /**
         * Upload only newly selected images.
         */
        const uploadedImages: ProductImageDto[] = [];

        for (const imageUri of localImages) {
          const formData = new FormData();

          formData.append("file", {
            uri: imageUri,
            name: `product-${Date.now()}.jpg`,
            type: "image/jpeg",
          } as any);

          const response = await uploadImagesMutation.mutateAsync(formData);

          uploadedImages.push(response.data);
        }

        /**
         * Convert remote URLs back into ProductImageDto.
         */
        const existingImages: ProductImageDto[] = remoteImages.map((url) => ({
          filename:
            product?.productImages.find((image) => image.url === url)
              ?.filename ?? "",

          url,
        }));

        /**
         * Merge everything while preserving gallery order.
         */
        images = galleryImages.map((uri) => {
          if (uri.startsWith("http")) {
            return existingImages.find((image) => image.url === uri)!;
          }

          return uploadedImages.shift()!;
        });
      }

      const payload: UpdateProductRequest = {
        id: Number(id),

        name: data.productName.trim(),

        description: data.description.trim(),

        youtubeLink: data.youtubeLink.trim(),

        currency: product?.currency ?? "NGN",

        price: Number(data.price),

        unit: data.unit.trim(),

        productLocation: data.productLocation.trim(),

        minOrderQty: data.minOrderQty.trim(),

        images,

        categoryIds: data.category ? [Number(data.category)] : [],

        publishNow: data.visible,

        ...variantPayload,
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

      const updatedGallery = images.map((image) => image.url);

      setGalleryImages(updatedGallery);

      reset({
        ...data,
        image: updatedGallery[0] ?? "",
      });

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
          <AppText variant="h3">Product Information</AppText>

          <AppText variant="body" color="secondary">
            Update your product details, category and image.
          </AppText>

          <Card>
            <View
              style={{
                gap: spacing.sm,
              }}
            >
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
                  <ImageActionCard
                    title="Take Photo"
                    icon="camera-outline"
                    disabled={galleryImages.length >= MAX_GALLERY_IMAGES}
                    onPress={handleCamera}
                  />

                  <ImageActionCard
                    title="Gallery"
                    icon="image-outline"
                    disabled={galleryImages.length >= MAX_GALLERY_IMAGES}
                    onPress={handleGallery}
                  />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <AppText variant="bodySmall" color="secondary">
                      Tap an image to make it the cover photo.
                    </AppText>

                    <AppText variant="bodySmall" color="secondary">
                      {galleryImages.length}/{MAX_GALLERY_IMAGES}
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: spacing.sm,
                    }}
                  >
                    {galleryImages.length === 0 && (
                      <Card
                        style={{
                          width: 220,
                        }}
                      >
                        <AppText variant="bodyBold">No Images Added</AppText>

                        <AppText variant="bodySmall" color="secondary">
                          Use Camera or Gallery above to add product images.
                        </AppText>
                      </Card>
                    )}

                    {galleryImages.map((uri, index) => (
                      <Pressable
                        key={`${uri}-${index}`}
                        onPress={() => makeCoverImage(index)}
                        style={{
                          position: "relative",
                        }}
                      >
                        <Image
                          source={{ uri }}
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: 12,

                            borderWidth: index === 0 ? 3 : 1,

                            borderColor:
                              index === 0
                                ? theme.border.brand
                                : theme.border.strong,
                          }}
                        />

                        {index === 0 && (
                          <View
                            style={{
                              position: "absolute",
                              left: 6,
                              top: 6,
                              backgroundColor: theme.background.brand,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderRadius: 6,
                            }}
                          >
                            <AppText variant="caption" color="inverse">
                              Primary
                            </AppText>
                          </View>
                        )}

                        <Pressable
                          onPress={() => removeGalleryImage(index)}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: theme.state.error.background,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AppText variant="bodyBold" color="inverse">
                            ×
                          </AppText>
                        </Pressable>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Currency
                </AppText>

                <AppText variant="bodyBold">{product?.currency}</AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Inventory Status
                </AppText>

                <AppText
                  variant="bodyBold"
                  color={product?.inStock ? "success" : "error"}
                >
                  {product?.inStock ? "In Stock" : "Out of Stock"}
                </AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText variant="body" color="secondary">
                  Low Stock Alert
                </AppText>

                <AppText variant="bodyBold">{product?.lowStockAlert}</AppText>
              </View>
            </View>
          </Card>

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

          <View
            style={{
              gap: spacing.md,
            }}
          >
            <AppText variant="h3">Pricing & Inventory</AppText>

            <AppText variant="body" color="secondary">
              Manage pricing, stock levels and product visibility.
            </AppText>

            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label="Selling Price"
                  required
                  keyboardType="decimal-pad"
                  value={field.value}
                  currency={product?.currency ?? "NGN"}
                  disableCurrencySelection
                  error={fieldState.error?.message}
                  onChangeText={field.onChange}
                />
              )}
            />

            <Card>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <AppText variant="bodyLargeBold">Product Status</AppText>

                  <AppText variant="body" color="secondary">
                    Publish or hide this product from customers.
                  </AppText>
                </View>

                <Controller
                  control={control}
                  name="visible"
                  render={({ field }) => (
                    <Switch
                      value={field.value}
                      onValueChange={field.onChange}
                      trackColor={{
                        false: theme.input.border,
                        true: theme.icon.branding.icon,
                      }}
                      thumbColor="#FFFFFF"
                    />
                  )}
                />
              </View>
            </Card>

            <Controller
              control={control}
              name="stock"
              render={({ field, fieldState }) => (
                <Input
                  label="Current Stock"
                  keyboardType="numeric"
                  value={field.value}
                  error={fieldState.error?.message}
                  onChangeText={field.onChange}
                />
              )}
            />
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

        <View
          style={{
            gap: spacing.md,
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="h3">Additional Information</AppText>

          <AppText variant="body" color="secondary">
            Optional information to help customers understand this product.
          </AppText>
          <Controller
            control={control}
            name="youtubeLink"
            render={({ field, fieldState }) => (
              <Input
                label="YouTube Link"
                placeholder="https://youtube.com/..."
                value={field.value}
                error={fieldState.error?.message}
                onChangeText={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="unit"
            render={({ field, fieldState }) => (
              <Input
                label="Unit"
                placeholder="Piece"
                value={field.value}
                error={fieldState.error?.message}
                onChangeText={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="minOrderQty"
            render={({ field, fieldState }) => (
              <Input
                label="Minimum Order Quantity"
                keyboardType="numeric"
                value={field.value}
                error={fieldState.error?.message}
                onChangeText={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="productLocation"
            render={({ field, fieldState }) => (
              <Input
                label="Product Location"
                placeholder="Warehouse A"
                value={field.value}
                error={fieldState.error?.message}
                onChangeText={field.onChange}
              />
            )}
          />
        </View>

        <Button
          title={saving ? "Saving..." : isDirty ? "Save Changes" : "No Changes"}
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
