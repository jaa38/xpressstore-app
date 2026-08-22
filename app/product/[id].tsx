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
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { Button } from "@/components/ui/Button";
import { ImageActionCard } from "@/components/ui/ImageActionCard";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Dropdown } from "@/components/ui/Dropdown";
import { AppText } from "@/components/ui/AppText";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";

import { useProduct } from "@/hooks/products/useProduct";
import { useCreateCategory } from "@/hooks/categories/useCreateCategory";
import { useCategories } from "@/hooks/categories/useCategories";
import { useUploadProductImage } from "@/hooks/products/useUploadProductImage";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import { useToast } from "@/hooks/useToast";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editProductSchema,
  EditProductForm,
} from "@/schemas/editProductSchema";

import type {
  UpdateProductRequest,
  ProductImageDto,
  MerchantProduct,
} from "@/types/product";

import { buildVariantPayload } from "@/utils/products/buildProductPayload";

/**
 * ============================================================================
 * MOCKS
 * ============================================================================
 */

import { USE_MOCK_PRODUCTS } from "@/mocks/config";
import { getMockProduct, updateMockProduct } from "@/mocks/products";
import { MOCK_CATEGORIES } from "@/mocks/categories";

/**
 * ============================================================================
 * PRODUCT DETAILS SCREEN
 * ============================================================================
 */

export default function ProductDetailsScreen() {
  /**
   * ==========================================================================
   * ROUTE
   * ==========================================================================
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const productId = Number(id);

  /**
   * ==========================================================================
   * API PRODUCT
   * ==========================================================================
   */

  const { product: apiProduct, isLoading: apiLoading } = useProduct(productId);

  /**
   * ==========================================================================
   * MOCK PRODUCT
   * ==========================================================================
   */

  const [mockProduct, setMockProduct] = useState<MerchantProduct | undefined>(
    () => (USE_MOCK_PRODUCTS ? getMockProduct(productId) : undefined)
  );

  /**
   * ==========================================================================
   * KEEP MOCK PRODUCT SYNCHRONIZED
   * ==========================================================================
   */

  useEffect(() => {
    if (!USE_MOCK_PRODUCTS) {
      return;
    }

    setMockProduct(getMockProduct(productId));
  }, [productId]);

  /**
   * ==========================================================================
   * SOURCE OF TRUTH
   * ==========================================================================
   */

  const product = USE_MOCK_PRODUCTS ? mockProduct : apiProduct;

  const loading = USE_MOCK_PRODUCTS ? false : apiLoading;

  /**
   * ==========================================================================
   * CATEGORIES
   * ==========================================================================
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

  const categoryOptions = USE_MOCK_PRODUCTS ? MOCK_CATEGORIES : categories;

  const categoryLoading = USE_MOCK_PRODUCTS ? false : categoriesLoading;

  const categoryError = USE_MOCK_PRODUCTS ? false : categoriesError;

  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [newCategory, setNewCategory] = useState("");

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  /**
   * Tracks changes that happen outside React Hook Form.
   *
   * React Hook Form cannot automatically detect:
   *
   * - adding images
   * - removing images
   * - reordering images
   * - changing the cover image
   */

  const [galleryImagesChanged, setGalleryImagesChanged] = useState(false);

  const [saving, setSaving] = useState(false);

  const [hasSaved, setHasSaved] = useState(false);

  /**
   * ==========================================================================
   * FORM INITIALIZATION TRACKING
   * ==========================================================================
   */

  const hasInitializedForm = useRef(false);

  /**
   * ==========================================================================
   * RESET FORM INITIALIZATION WHEN PRODUCT CHANGES
   * ==========================================================================
   */

  useEffect(() => {
    hasInitializedForm.current = false;
  }, [productId]);

  /**
   * ==========================================================================
   * MUTATIONS
   * ==========================================================================
   */

  const createCategoryMutation = useCreateCategory();

  const updateProductMutation = useUpdateProduct();

  const uploadImagesMutation = useUploadProductImage();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * FORM
   * ==========================================================================
   */

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),

    mode: "onChange",

    defaultValues: {
      productName: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      visible: false,
      youtubeLink: "",
      unit: "",
      productLocation: "",
      minOrderQty: "",
    },
  });

  /**
   * ==========================================================================
   * CHANGE DETECTION
   * ==========================================================================
   */

  const hasChanges = isDirty || galleryImagesChanged;

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

  const MAX_GALLERY_IMAGES = 5;

  /**
   * ==========================================================================
   * LOAD PRODUCT INTO FORM
   * ==========================================================================
   */

  useEffect(() => {
    if (!product) {
      return;
    }

    if (hasInitializedForm.current) {
      return;
    }

    /**
     * ========================================================================
     * PRODUCT IMAGES
     * ========================================================================
     */

    const images = product.productImages?.map((image) => image.url) ?? [];

    /**
     * ========================================================================
     * INITIAL FORM VALUES
     * ========================================================================
     */

    const initialFormValues: EditProductForm = {
      productName: product.productName ?? "",

      category: String(product.productCategories?.[0]?.id ?? ""),

      description: product.description ?? "",

      price: String(product.unitPrice ?? ""),

      stock: String(product.totalInStock ?? ""),

      image: images[0] ?? "",

      visible: product.isActive,

      youtubeLink: product.youtubeLink ?? "",

      unit: product.unit ?? "",

      productLocation: product.productLocation ?? "",

      minOrderQty: product.minOrderQty ?? "",
    };

    /**
     * ========================================================================
     * INITIALIZE FORM
     * ========================================================================
     */

    reset(initialFormValues, {
      keepDirty: false,
    });

    /**
     * ========================================================================
     * INITIALIZE GALLERY
     * ========================================================================
     */

    setGalleryImages(images);

    setGalleryImagesChanged(false);

    setHasSaved(false);

    hasInitializedForm.current = true;
  }, [product, reset]);

  /**
   * ==========================================================================
   * HARDWARE BACK BUTTON
   * ==========================================================================
   */

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (!hasChanges) {
            return false;
          }

          confirmDiscardChanges(() => {
            router.back();
          });

          return true;
        }
      );

      return () => subscription.remove();
    }, [hasChanges, router])
  );

  /**
   * ==========================================================================
   * CAMERA
   * ==========================================================================
   */

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

    const updatedGallery = [...galleryImages, asset.uri];

    setGalleryImages(updatedGallery);

    setGalleryImagesChanged(true);

    setValue("image", updatedGallery[0] ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  /**
   * ==========================================================================
   * GALLERY
   * ==========================================================================
   */

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

    if (result.canceled) {
      return;
    }

    const selectedImages = result.assets.map((asset) => asset.uri);

    const merged = [...galleryImages, ...selectedImages];

    const uniqueImages = [...new Set(merged)].slice(0, MAX_GALLERY_IMAGES);

    setGalleryImages(uniqueImages);

    setGalleryImagesChanged(true);

    setValue("image", uniqueImages[0] ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  /**
   * ==========================================================================
   * REMOVE IMAGE
   * ==========================================================================
   */

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
            const updatedGallery = galleryImages.filter((_, i) => i !== index);

            setGalleryImages(updatedGallery);

            setGalleryImagesChanged(true);

            setValue("image", updatedGallery[0] ?? "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        },
      ]
    );
  }

  /**
   * ==========================================================================
   * MAKE COVER IMAGE
   * ==========================================================================
   */

  function makeCoverImage(index: number) {
    if (index === 0) {
      return;
    }

    const selected = galleryImages[index];

    if (!selected) {
      return;
    }

    const reordered = [
      selected,

      ...galleryImages.filter((_, i) => i !== index),
    ];

    setGalleryImages(reordered);

    setGalleryImagesChanged(true);

    setValue("image", reordered[0] ?? "", {
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

    /**
     * ========================================================================
     * MOCK MODE
     * ========================================================================
     */

    if (USE_MOCK_PRODUCTS) {
      const mockValue = String(Date.now());

      setValue("category", mockValue, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setNewCategory("");

      showToast({
        type: "success",
        title: "Category Created",
        message: `${categoryName} has been added.`,
      });

      return;
    }

    /**
     * ========================================================================
     * API MODE
     * ========================================================================
     */

    try {
      const category = await createCategoryMutation.mutateAsync(categoryName);

      if (!category) {
        throw new Error("Category could not be created.");
      }

      setValue("category", category.value, {
        shouldDirty: true,
        shouldValidate: true,
      });

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

  /**
   * ==========================================================================
   * VARIANTS
   * ==========================================================================
   */

  const variantPayload = buildVariantPayload(
    product?.variations ?? [],
    (product?.variations.length ?? 0) > 0
  );

  /**
   * ==========================================================================
   * FORM VALIDATION ERROR
   * ==========================================================================
   */

  function handleInvalidSubmit() {
    console.log("EDIT PRODUCT FORM INVALID", errors);

    const firstError = Object.values(errors)[0];

    showToast({
      type: "error",
      title: "Check Product Details",
      message:
        firstError?.message ??
        "Please correct the highlighted fields before saving.",
    });
  }

  /**
   * ==========================================================================
   * UPDATE PRODUCT
   * ==========================================================================
   */

  async function handleUpdateProduct(data: EditProductForm) {
    try {
      setSaving(true);

      /**
       * ======================================================================
       * PREPARE IMAGES
       * ======================================================================
       */

      let images: ProductImageDto[] = [];

      /**
       * ======================================================================
       * MOCK MODE IMAGE PREPARATION
       * ======================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        images = galleryImages.map((uri, index) => ({
          filename: uri.startsWith("http")
            ? (product?.productImages?.[index]?.filename ??
              `product-${index + 1}.jpg`)
            : `product-${Date.now()}-${index}.jpg`,

          url: uri,
        }));
      }

      /**
       * ======================================================================
       * API MODE IMAGE UPLOAD
       * ======================================================================
       */

      if (!USE_MOCK_PRODUCTS) {
        if (galleryImages.length > 0) {
          /**
           * Separate remote and local images.
           */

          const remoteImages = galleryImages.filter((uri) =>
            uri.startsWith("http")
          );

          const localImages = galleryImages.filter(
            (uri) => !uri.startsWith("http")
          );

          /**
           * Upload newly selected local images.
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

            uploadedImages.push(...response.data);
          }

          /**
           * Existing remote images.
           */

          const existingImages: ProductImageDto[] = remoteImages.map((url) => ({
            filename:
              product?.productImages?.find((image) => image.url === url)
                ?.filename ?? "",

            url,
          }));

          /**
           * Preserve gallery order.
           */

          images = galleryImages.map((uri) => {
            if (uri.startsWith("http")) {
              return existingImages.find((image) => image.url === uri)!;
            }

            return uploadedImages.shift()!;
          });
        }
      }

      /**
       * ======================================================================
       * UPDATE PAYLOAD
       * ======================================================================
       */

      const payload: UpdateProductRequest = {
        id: productId,

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

      /**
       * ======================================================================
       * MOCK MODE
       * ======================================================================
       *
       * IMPORTANT:
       *
       * Do NOT rely on updateProductMutation
       * returning the updated MerchantProduct here.
       *
       * updateMockProduct() updates the shared
       * repository. We then read the updated
       * product back with getMockProduct().
       *
       * This also ensures fields such as:
       *
       * - productName
       * - price
       * - stock
       * - visibility
       * - category
       * - description
       *
       * are persisted in mock mode.
       */

      if (USE_MOCK_PRODUCTS) {
        /**
         * Find the selected category.
         */

        const selectedCategory = categoryOptions.find(
          (category) => category.value === data.category
        );

        /**
         * Update the shared mock repository.
         */

        updateMockProduct(productId, {
          productName: data.productName.trim(),

          description: data.description.trim(),

          unitPrice: Number(data.price),

          totalInStock: Number(data.stock),

          isActive: data.visible,

          youtubeLink: data.youtubeLink.trim(),

          unit: data.unit.trim(),

          productLocation: data.productLocation.trim(),

          minOrderQty: data.minOrderQty.trim(),

          productImages: images,

          productCategories: selectedCategory
            ? [
                {
                  id: Number(selectedCategory.value),

                  name: selectedCategory.label,

                  description: "",

                  isActive: true,
                },
              ]
            : [],

          variations: product?.variations ?? [],
        });

        /**
         * Read the updated product
         * back from the shared repository.
         */

        const updatedProduct = getMockProduct(productId);

        if (!updatedProduct) {
          throw new Error("Product could not be updated.");
        }

        /**
         * Synchronize local screen state.
         */

        setMockProduct(updatedProduct);
      } else {
        /**
         * ====================================================================
         * API MODE
         * ====================================================================
         */

        await updateProductMutation.mutateAsync({
          productId,

          payload,
        });
      }

      /**
       * ======================================================================
       * UPDATED GALLERY
       * ======================================================================
       */

      const updatedGallery = images.map((image) => image.url);

      setGalleryImages(updatedGallery);

      /**
       * ======================================================================
       * RESET FORM BASELINE
       * ======================================================================
       *
       * The values that were just saved
       * become the new baseline.
       */

      const savedFormValues: EditProductForm = {
        ...data,

        image: updatedGallery[0] ?? "",
      };

      reset(savedFormValues, {
        keepDirty: false,
      });

      /**
       * Gallery is also now clean.
       */

      setGalleryImagesChanged(false);

      setHasSaved(true);

      /**
       * ======================================================================
       * SUCCESS
       * ======================================================================
       */

      showToast({
        type: "success",
        title: "Product Updated",
        message: "Changes saved successfully.",
      });

      /**
       * ======================================================================
       * RETURN TO PRODUCT SCREEN
       * ======================================================================
       *
       * In mock mode the shared repository
       * has already been updated.
       *
       * In API mode the mutation has completed
       * and React Query handles invalidation.
       */

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

  /**
   * ==========================================================================
   * DISCARD CHANGES
   * ==========================================================================
   */

  function confirmDiscardChanges(onDiscard: () => void) {
    if (!hasChanges || hasSaved) {
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

  /**
   * ==========================================================================
   * LOADING
   * ==========================================================================
   */

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

  /**
   * ==========================================================================
   * PRODUCT NOT FOUND
   * ==========================================================================
   */

  if (!product) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <ScreenHeader title="Edit Product" onBack={() => router.back()} />

        <Divider />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.xl,
          }}
        >
          <Ionicons
            name="cube-outline"
            size={56}
            color={theme.icon.default.icon}
          />

          <AppText
            variant="h2"
            style={{
              marginTop: spacing.lg,
              textAlign: "center",
            }}
          >
            Product Not Found
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.sm,
              textAlign: "center",
            }}
          >
            The product you're trying to edit could not be found.
          </AppText>

          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: spacing.lg,
            }}
          >
            <AppText color="link">Go Back</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
    >
      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <ScreenHeader
        title="Edit Product"
        onBack={() =>
          confirmDiscardChanges(() => {
            router.back();
          })
        }
      />

      <Divider />

      {/* ====================================================================
          CONTENT
      ==================================================================== */}

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,

          paddingTop: spacing.lg,

          paddingBottom: spacing["3xl"],
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ==================================================================
            PRODUCT INFORMATION
        ================================================================== */}

        <View
          style={{
            gap: spacing.md,
          }}
        >
          <AppText variant="h3">Product Information</AppText>

          <AppText variant="body" color="secondary">
            Update your product details, category and image.
          </AppText>

          {/* ================================================================
              IMAGE CARD
          ================================================================= */}

          <Card
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                gap: spacing.lg,
              }}
            >
              {/* IMAGE ACTIONS */}

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

              {/* GALLERY HEADER */}

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: spacing.md,
                }}
              >
                <AppText
                  variant="bodySmall"
                  color="secondary"
                  style={{
                    flex: 1,
                  }}
                >
                  Tap an image to make it the cover photo.
                </AppText>

                <AppText variant="bodySmallBold" color="secondary">
                  {galleryImages.length}/{MAX_GALLERY_IMAGES}
                </AppText>
              </View>

              {/* IMAGE LIST */}

              {galleryImages.length === 0 ? (
                <View
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: theme.border.default,
                    borderRadius: radius.md,
                    paddingVertical: spacing.xl,
                    paddingHorizontal: spacing.lg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: radius.full,
                      backgroundColor: theme.icon.default.background,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="images-outline"
                      size={28}
                      color={theme.icon.default.icon}
                    />
                  </View>

                  <AppText
                    variant="bodyLargeBold"
                    style={{
                      marginTop: spacing.md,
                      textAlign: "center",
                    }}
                  >
                    No Images Added
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,
                      textAlign: "center",
                    }}
                  >
                    Use Camera or Gallery above to add product images.
                  </AppText>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: spacing.sm,
                    paddingVertical: spacing.xs,
                    paddingRight: spacing.md,
                  }}
                >
                  {galleryImages.map((uri, index) => (
                    <Pressable
                      key={`${uri}-${index}`}
                      onPress={() => makeCoverImage(index)}
                      style={{
                        width: 90,
                        height: 90,
                        position: "relative",
                      }}
                    >
                      <Image
                        source={{
                          uri,
                        }}
                        resizeMode="cover"
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: radius.md,
                          borderWidth: index === 0 ? 3 : 1,
                          borderColor:
                            index === 0
                              ? theme.border.brand
                              : theme.border.strong,
                        }}
                      />

                      {/* COVER */}

                      {index === 0 && (
                        <View
                          style={{
                            position: "absolute",
                            left: 5,
                            bottom: 5,
                            backgroundColor: theme.background.brand,
                            paddingHorizontal: spacing.xs,
                            paddingVertical: 2,
                            borderRadius: radius.sm,
                          }}
                        >
                          <AppText variant="caption" color="primary">
                            Cover
                          </AppText>
                        </View>
                      )}

                      {/* REMOVE */}

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove image ${index + 1}`}
                        onPress={() => removeGalleryImage(index)}
                        hitSlop={8}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 26,
                          height: 26,
                          borderRadius: radius.full,
                          backgroundColor: theme.state.error.background,
                          borderWidth: 1,
                          borderColor: theme.state.error.border,
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
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {/* PRODUCT META */}

              <View
                style={{
                  gap: spacing.md,
                }}
              >
                {/* CURRENCY */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Currency
                  </AppText>

                  <AppText variant="bodyBold">
                    {product.currency ?? "NGN"}
                  </AppText>
                </View>

                {/* INVENTORY */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Inventory Status
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color={product.inStock ? "success" : "error"}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </AppText>
                </View>

                {/* LOW STOCK */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Low Stock Alert
                  </AppText>

                  <AppText variant="bodyBold">{product.lowStockAlert}</AppText>
                </View>
              </View>
            </View>
          </Card>

          {/* PRODUCT NAME */}

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

          {/* CATEGORY */}

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Dropdown
                label="Category"
                required
                value={value}
                error={
                  error?.message ??
                  (categoryError ? "Unable to load categories." : undefined)
                }
                disabled={categoryLoading}
                options={categoryOptions}
                placeholder={
                  categoryLoading ? "Loading categories..." : "Select category"
                }
                onSelect={onChange}
              />
            )}
          />

          {/* CREATE CATEGORY */}

          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <Input
              label="Create Category"
              placeholder="e.g. Travel Bags"
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <Button
              title="Add Category"
              variant="tertiary"
              onPress={handleCreateCategory}
              loading={createCategoryMutation.isPending}
              disabled={!newCategory.trim() || createCategoryMutation.isPending}
            />
          </View>

          {/* PRICING & INVENTORY */}

          <View
            style={{
              gap: spacing.md,
              marginTop: spacing.md,
            }}
          >
            <AppText variant="h3">Pricing & Inventory</AppText>

            <AppText variant="body" color="secondary">
              Manage pricing, stock levels and product visibility.
            </AppText>

            {/* PRICE */}

            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label="Selling Price"
                  required
                  keyboardType="decimal-pad"
                  value={field.value}
                  currency={product.currency ?? "NGN"}
                  disableCurrencySelection
                  error={fieldState.error?.message}
                  onChangeText={field.onChange}
                />
              )}
            />

            {/* VISIBILITY */}

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

                  <AppText
                    variant="body"
                    color="secondary"
                    style={{
                      marginTop: spacing.xs,
                    }}
                  >
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

            {/* STOCK */}

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

          {/* DESCRIPTION */}

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

        {/* ==================================================================
            ADDITIONAL INFORMATION
        ================================================================== */}

        <View
          style={{
            gap: spacing.md,
            marginTop: spacing.xl,
          }}
        >
          <AppText variant="h3">Additional Information</AppText>

          <AppText variant="body" color="secondary">
            Optional information to help customers understand this product.
          </AppText>

          {/* YOUTUBE */}

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

          {/* UNIT */}

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

          {/* MINIMUM ORDER */}

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

          {/* LOCATION */}

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

        {/* ==================================================================
            SAVE CHANGES
        ================================================================== */}

        <Button
          title={saving ? "Saving..." : "Save Changes"}
          variant="primary"
          size="large"
          loading={saving}
          disabled={saving || !hasChanges}
          onPress={() => {
            console.log("SAVE BUTTON PRESSED");

            console.log("FORM DIRTY:", isDirty);

            console.log("FORM VALID:", isValid);

            console.log("FORM VALUES:", {
              productName: "submitted by RHF",
              price: "submitted by RHF",
              stock: "submitted by RHF",
            });

            handleSubmit(handleUpdateProduct, handleInvalidSubmit)();
          }}
          style={{
            marginTop: spacing.xl,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
