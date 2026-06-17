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

export default function ReviewScreen() {
  const { product } = useProduct();
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

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    color={theme.icon.branding.icon}
                    size={20}
                  />

                  <AppText variant="bodyBold" color="success">
                    Edit
                  </AppText>
                </View>
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

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    color={theme.icon.branding.icon}
                    size={20}
                  />

                  <AppText variant="bodyBold" color="success">
                    Edit
                  </AppText>
                </View>
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
                <AppText variant="bodyLargeBold">Pricing</AppText>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    color={theme.icon.branding.icon}
                    size={20}
                  />

                  <AppText variant="bodyBold" color="success">
                    Edit
                  </AppText>
                </View>
              </View>
            </Card>

            {/* <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Card>
                <View
                  style={{
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="h3">Product Summary</AppText>

                  <AppText>SKU: {product.sku || "-"}</AppText>

                  <AppText>Brand: {product.brand || "-"}</AppText>

                  <AppText>Stock: {product.stock}</AppText>

                  <AppText>Shipping Class: {product.shippingClass}</AppText>
                </View>
              </Card>
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Card>
                <View
                  style={{
                    gap: spacing.sm,
                  }}
                >
                  <AppText variant="h3">Dimensions</AppText>

                  <AppText>
                    Weight: {product.dimensions?.weight || "-"} kg
                  </AppText>

                  <AppText>
                    Length: {product.dimensions?.length || "-"} cm
                  </AppText>

                  <AppText>
                    Width: {product.dimensions?.width || "-"} cm
                  </AppText>

                  <AppText>
                    Height: {product.dimensions?.height || "-"} cm
                  </AppText>
                </View>
              </Card>
            </View>

            {product.images?.length > 0 && (
              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <Card>
                  <AppText
                    variant="h3"
                    style={{
                      marginBottom: spacing.md,
                    }}
                  >
                    Additional Images
                  </AppText>

                  <ScrollView horizontal>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: spacing.sm,
                      }}
                    >
                      {product.images.map((image) => (
                        <Image
                          key={image}
                          source={{ uri: image }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 12,
                          }}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </Card>
              </View>
            )}

            {product.deliveryNotes && (
              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <Card>
                  <View
                    style={{
                      gap: spacing.sm,
                    }}
                  >
                    <AppText variant="h3">Delivery Notes</AppText>

                    <AppText color="secondary">{product.deliveryNotes}</AppText>
                  </View>
                </Card>
              </View>
            )} */}
          </View>
        </ScrollView>

        {/* FOOTER */}

        <AddProductFooter
          nextLabel="Publish Product"
          onNext={() => {
            console.log("Publish");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
