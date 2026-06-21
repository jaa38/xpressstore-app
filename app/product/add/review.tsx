import { View, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ProgressBar } from "@/components/ui/ProgressBar";

import { spacing, theme } from "@/theme";

import { AddProductHeader } from "@/components/product/AddProductHeader";
import { AddProductFooter } from "@/components/product/AddProductFooter";
import { Card } from "@/components/ui/Card";

import { useProduct } from "@/store/product/useProduct";

import { ROUTES } from "@/navigation/routes";
import { EditButton } from "@/components/product/EditButton";

import { createProduct } from "@/services/product-service";

import { uploadProductImage } from "@/services/storage-service";

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

export default function ReviewScreen() {
  const { product, addProduct, resetProduct } = useProduct();

  async function publishProduct() {
    try {
      let imageUrl = "";

      if (product.image) {
        imageUrl = await uploadProductImage(product.image);
      }

      await createProduct({
        ...product,
        image: imageUrl,
      });

      resetProduct();

      router.replace(ROUTES.PRODUCTS);
    } catch (error) {
      console.error(error);
    }
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
        step={5}
        totalSteps={5}
        progress={100}
        label="Review"
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
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: spacing.md }}>
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
                      source={{ uri: product.image }}
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
                    // gap: spacing.xs,
                    justifyContent: "space-evenly",
                  }}
                >
                  <AppText variant="bodyLargeBold">
                    {product.productName}
                  </AppText>

                  <AppText color="secondary">{product.category}</AppText>

                  <AppText variant="bodyLargeBold" color="link">
                    ₦{product.price?.toLocaleString()}
                  </AppText>
                </View>
              </View>
            </Card>

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
                    ₦{product.costPrice?.toLocaleString() ?? "0"}
                  </AppText>
                </View>

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
                    ₦{product.price?.toLocaleString() ?? "0"}
                  </AppText>
                </View>

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

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body" color="secondary">
                    Low Alert
                  </AppText>

                  <AppText variant="bodyBold" color="primary">
                    {product.lowStockAlert}
                  </AppText>
                </View>
              </View>
            </Card>

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
                  {product.variants.map((variant) => (
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
                  ))}
                </View>
              </View>
            </Card>

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
                    {product.images.length}
                  </AppText>
                </View>
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
                    {product.dimensions.length} ×{product.dimensions.width} ×
                    {product.dimensions.height} cm
                  </AppText>
                </View>
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

        {/* FOOTER */}

        <AddProductFooter nextLabel="Publish Product" onNext={publishProduct} />
      </View>
    </SafeAreaView>
  );
}
