import { View, ScrollView, ActivityIndicator } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/Button";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme } from "@/theme";

import { getProduct, updateProduct } from "@/services/product-service";

import type { Product } from "@/types/product";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const data = await getProduct(id);

      setProduct(data);
    } catch (error) {
      console.log("LOAD PRODUCT ERROR", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
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
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <AppText variant="h2">Product Details</AppText>

        <View
          style={{
            marginTop: 24,
            gap: spacing.md,
          }}
        >
          <AppText>Name: {product?.productName}</AppText>
          <AppText>Category: {product?.category}</AppText>
          <AppText>Price: ₦{product?.price?.toLocaleString()}</AppText>
          <AppText>Stock: {product?.stock}</AppText>
          <AppText>Description:</AppText>
          <AppText color="secondary">{product?.description}</AppText>
        </View>

        <Button
          title="Edit Product"
          variant="primary"
          style={{
            marginTop: spacing.lg,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
