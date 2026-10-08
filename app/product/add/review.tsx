import { View, ScrollView, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";
import { Card } from "@/components/ui/Card";

import { spacing, theme } from "@/theme";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";

import { useProductDraftStore } from "@/store/product/productDraftStore";

import { EditButton } from "@/components/product/EditButton";

import { useCreateProduct } from "@/hooks/products/useCreateProduct";

import { useUploadProductImage } from "@/hooks/products/useUploadProductImage";

import { formatCurrency } from "@/utils/formatters/currency";

import type { CreateProductRequest, ProductImageDto } from "@/types/product";

import { ROUTES } from "@/navigation/routes";

import { useState } from "react";

import { useToast } from "@/hooks/useToast";

import { buildVariantPayload } from "@/utils/products/buildProductPayload";

import { useAddProductToStore } from "@/hooks/products/useAddProductToStore";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";

/**
 * ============================================================================
 * EDIT ACTIONS
 * ============================================================================
 */

function editInfo() {
  router.replace(ROUTES.ADD_PRODUCT_INFO);
}

function editPricing() {
  router.replace(ROUTES.ADD_PRODUCT_PRICING);
}

function editVariants() {
  router.replace(ROUTES.ADD_PRODUCT_VARIANTS);
}

function editStorefront() {
  router.replace(ROUTES.ADD_PRODUCT_STOREFRONT);
}

/**
 * ============================================================================
 * REVIEW SCREEN
 * ============================================================================
 */

export default function ReviewScreen() {
  /**
   * ==========================================================================
   * PRODUCT DRAFT
   * ==========================================================================
   */

  const { product, resetProduct } = useProductDraftStore();

  /**
   * ==========================================================================
   * MUTATIONS
   * ==========================================================================
   */

  const createProductMutation = useCreateProduct();

  const addProductToStoreMutation = useAddProductToStore();

  const uploadImagesMutation = useUploadProductImage();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [publishing, setPublishing] = useState(false);

  /**
   * ==========================================================================
   * PUBLISH PRODUCT
   * ==========================================================================
   */

  async function publishProduct() {
    try {
      setPublishing(true);

      /**
       * ========================================================================
       * PRODUCT IMAGES
       * ========================================================================
       *
       * MOCK MODE
       * ----------
       *
       * Local image URIs are stored directly in the mock repository.
       *
       * No image upload API is called.
       *
       * API MODE
       * --------
       *
       * Local images are uploaded to the real API first.
       */

      const uploadedImages: ProductImageDto[] = [];

      /**
       * ========================================================================
       * MOCK MODE — IMAGE PREPARATION
       * ========================================================================
       */

      if (USE_MOCK_PRODUCTS) {
        const mockImageUris = [product.image, ...product.images].filter(
          (image): image is string => Boolean(image)
        );

        const uniqueImages = [...new Set(mockImageUris)];

        uniqueImages.forEach((uri, index) => {
          uploadedImages.push({
            filename: `mock-product-${Date.now()}-${index}.jpg`,
            url: uri,
          });
        });
      }

      /**
       * ========================================================================
       * API MODE — IMAGE UPLOAD
       * ========================================================================
       */

      if (!USE_MOCK_PRODUCTS) {
        const imagesToUpload = [product.image, ...product.images].filter(
          (image): image is string =>
            Boolean(image) && !image.startsWith("http")
        );

        const uniqueImages = [...new Set(imagesToUpload)];

        for (const imageUri of uniqueImages) {
          const formData = new FormData();

          formData.append("file", {
            uri: imageUri,
            name: `product-${Date.now()}.jpg`,
            type: "image/jpeg",
          } as any);

          const response = await uploadImagesMutation.mutateAsync(formData);

          uploadedImages.push(...response.data);
        }
      }

      /**
       * ========================================================================
       * BUILD VARIANT PAYLOAD
       * ========================================================================
       */

      const variantPayload = buildVariantPayload(
        product.variants,
        product.variantsEnabled
      );

      /**
       * ========================================================================
       * BUILD PRODUCT PAYLOAD
       * ========================================================================
       */

      const payload: CreateProductRequest = {
        id: 0,

        name: product.productName.trim(),

        description: product.description.trim(),

        youtubeLink: "",

        currency: product.currency,

        price: Number(product.price),

        unit: "",

        productLocation: "",

        minOrderQty: "",

        images: uploadedImages,

        categoryIds: product.category ? [Number(product.category)] : [],

        publishNow: product.productStatus === "active",

        ...variantPayload,
      };

      /**
       * ========================================================================
       * CREATE PRODUCT
       * ========================================================================
       *
       * The useCreateProduct hook decides whether this goes to:
       *
       *     MOCK REPOSITORY
       *
       * or
       *
       *     REAL API
       */

      const createdProduct = await createProductMutation.mutateAsync({
        payload,
      });

      /**
       * ========================================================================
       * STORE ASSIGNMENT
       * ========================================================================
       *
       * API MODE
       * --------
       *
       * Assign the newly-created product to the selected stores.
       *
       * MOCK MODE
       * ---------
       *
       * We intentionally skip this for now because store assignment has not
       * yet been moved into the mock repository.
       *
       * This prevents the Review screen from making an unexpected API call
       * while USE_MOCK_PRODUCTS=true.
       */

      if (!USE_MOCK_PRODUCTS && product.storeIds.length > 0) {
        try {
          await addProductToStoreMutation.mutateAsync({
            productId: createdProduct.data.id,

            storeIds: product.storeIds,
          });
        } catch (error) {
          console.error("ASSIGN PRODUCT TO STORES ERROR", error);

          showToast({
            type: "error",

            title: "Product Created",

            message:
              "The product was created, but it could not be assigned to the selected stores.",
          });

          router.replace(ROUTES.PRODUCTS);

          return;
        }
      }

      /**
       * ========================================================================
       * SUCCESS
       * ========================================================================
       */

      showToast({
        type: "success",

        title: "Product Created",

        message: USE_MOCK_PRODUCTS
          ? "Your product has been added successfully."
          : "Your product has been published successfully.",
      });

      /**
       * Reset the draft after successful creation.
       */

      resetProduct();

      /**
       * Return to Products.
       */

      router.replace(ROUTES.PRODUCTS);
    } catch (error) {
      /**
       * ========================================================================
       * ERROR
       * ========================================================================
       */

      console.error("CREATE PRODUCT ERROR", error);

      showToast({
        type: "error",

        title: "Unable to Create Product",

        message: USE_MOCK_PRODUCTS
          ? "Unable to create the mock product. Please try again."
          : "Please try again.",
      });
    } finally {
      setPublishing(false);
    }
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
      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <AddProductHeader
        title="Add New Product"
        step={5}
        totalSteps={5}
        progress={100}
        label="Review"
      />

      <Divider />

      {/* ====================================================================
          CONTENT
      ==================================================================== */}

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
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              gap: spacing.md,
            }}
          >
            {/* ==============================================================
                PRODUCT SUMMARY
            ============================================================== */}

            <Card>
              <View
                style={{
                  flexDirection: "row",

                  gap: spacing.md,

                  alignItems: "center",
                }}
              >
                {product.image ? (
                  <View
                    style={{
                      width: 72,

                      height: 72,

                      borderRadius: 12,

                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{
                        uri: product.image || product.images?.[0] || undefined,
                      }}
                      style={{
                        width: "100%",

                        height: "100%",
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 72,

                      height: 72,

                      borderRadius: 12,

                      backgroundColor: theme.icon.branding.background,

                      justifyContent: "center",

                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={32}
                      color={theme.icon.branding.icon}
                    />
                  </View>
                )}

                <View
                  style={{
                    flex: 1,

                    justifyContent: "space-evenly",
                  }}
                >
                  <AppText variant="bodyLargeBold">
                    {product.productName}
                  </AppText>

                  <AppText color="secondary">{product.category}</AppText>

                  <AppText variant="bodyLargeBold" color="link">
                    {formatCurrency(product.price, {
                      currency: product.currency,
                    })}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==============================================================
                PRODUCT INFORMATION
            ============================================================== */}

            <Card>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",

                  alignItems: "center",
                }}
              >
                <AppText variant="bodyLargeBold">Product Information</AppText>

                <EditButton onPress={editInfo} />
              </View>

              <View
                style={{
                  marginTop: spacing.rg,

                  gap: spacing.sm,
                }}
              >
                {/* NAME */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Name
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",
                    }}
                  >
                    {product.productName || "-"}
                  </AppText>
                </View>

                {/* CATEGORY */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Category
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",
                    }}
                  >
                    {product.category || "-"}
                  </AppText>
                </View>

                {/* DESCRIPTION */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Description
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",

                      maxWidth: "65%",
                    }}
                  >
                    {product.description || "-"}
                  </AppText>
                </View>

                {/* SHIPPING */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Shipping
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.shippingClass}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==============================================================
                PRICING
            ============================================================== */}

            <Card>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",

                  alignItems: "center",
                }}
              >
                <AppText variant="bodyLargeBold">Pricing</AppText>

                <EditButton onPress={editPricing} />
              </View>

              <View
                style={{
                  marginTop: spacing.rg,

                  gap: spacing.sm,
                }}
              >
                {/* COST PRICE */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Cost Price
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(product.costPrice, {
                      currency: product.currency,
                    })}
                  </AppText>
                </View>

                {/* SELLING PRICE */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Selling Price
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(product.price, {
                      currency: product.currency,
                    })}
                  </AppText>
                </View>

                {/* TAX */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Tax Applicable
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color={product.taxApplicable ? "success" : "secondary"}
                  >
                    {product.taxApplicable ? "Applicable" : "Not Applicable"}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==============================================================
                INVENTORY
            ============================================================== */}

            <Card>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <AppText variant="bodyLargeBold">Inventory</AppText>

                <EditButton onPress={editPricing} />
              </View>

              <View
                style={{
                  marginTop: spacing.rg,
                  gap: spacing.sm,
                }}
              >
                {/* TRACKING */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Tracking
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color={product.trackInventory ? "success" : "secondary"}
                    style={{
                      flexShrink: 1,
                      textAlign: "right",
                    }}
                  >
                    {product.trackInventory ? "Enabled" : "Disabled"}
                  </AppText>
                </View>

                {/* STOCK */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Stock
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,
                      textAlign: "right",
                    }}
                  >
                    {product.stock}
                  </AppText>
                </View>

                {/* LOW STOCK */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Low Stock Alert
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.lowStockAlert}
                  </AppText>
                </View>

                {/* SOLD OUT */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Sold Out Level
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.soldOutLevel}
                  </AppText>
                </View>

                {/* REORDER LEVEL */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Reorder Level
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.reorderLevel}
                  </AppText>
                </View>
              </View>
            </Card>

            {/* ==============================================================
                VARIANTS
            ============================================================== */}

            <Card>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",

                  alignItems: "center",
                }}
              >
                <AppText variant="bodyLargeBold">Variants</AppText>

                <EditButton onPress={editVariants} />
              </View>

              <View
                style={{
                  marginTop: spacing.rg,

                  gap: spacing.sm,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",

                    gap: spacing.xs,
                  }}
                >
                  {product.variants.length === 0 ? (
                    <AppText color="secondary">No variants configured.</AppText>
                  ) : (
                    product.variants.map((variant) => (
                      <View
                        key={variant.name}
                        style={{
                          flexDirection: "row",

                          justifyContent: "space-between",
                        }}
                      >
                        <AppText variant="body" color="secondary">
                          {variant.name}
                        </AppText>

                        <AppText variant="bodyBold" color="primary">
                          {variant.options.length} Option(s)
                        </AppText>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </Card>

            {/* ==============================================================
                STOREFRONT
            ============================================================== */}

            <Card>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",

                  alignItems: "center",
                }}
              >
                <AppText variant="bodyLargeBold">Storefront</AppText>

                <EditButton onPress={editStorefront} />
              </View>

              <View
                style={{
                  marginTop: spacing.rg,

                  gap: spacing.sm,
                }}
              >
                {/* VISIBILITY */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Visibility
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",
                    }}
                  >
                    {product.visible ? "Visible" : "Hidden"}
                  </AppText>
                </View>

                {/* SHIPPING */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Shipping
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.shippingClass}
                  </AppText>
                </View>

                {/* GALLERY IMAGES */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Gallery Images
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.images?.length ?? 0}
                  </AppText>
                </View>

                {/* DIMENSIONS */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Dimensions
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      flexShrink: 1,

                      textAlign: "right",
                    }}
                  >
                    {product.dimensions.length || "-"} ×
                    {product.dimensions.width || "-"} ×
                    {product.dimensions.height || "-"} cm
                  </AppText>
                </View>

                {/* NOTES */}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Notes
                  </AppText>

                  <AppText
                    variant="bodyBold"
                    color="primary"
                    style={{
                      maxWidth: "60%",

                      textAlign: "right",
                    }}
                  >
                    {product.deliveryNotes || "None"}
                  </AppText>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* ==================================================================
            FOOTER
        ================================================================== */}

        <AddProductFooter
          nextLabel={publishing ? "Publishing..." : "Publish Product"}
          loading={publishing}
          disabled={publishing}
          onNext={publishProduct}
        />
      </View>
    </SafeAreaView>
  );
}
