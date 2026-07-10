import { View, ScrollView, ActivityIndicator } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { spacing, theme } from "@/theme";

import { getProduct } from "@/services/product-service";

import { Input } from "@/components/ui/Input";

import type { Product } from "@/types/product";

import { Dropdown } from "@/components/ui/Dropdown";

import { DEFAULT_CATEGORIES } from "@/constants/productCategories";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [product, setProduct] = useState<Product | null>(null);

  const [productName, setProductName] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [stock, setStock] = useState("");

  const [visible, setVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const data = await getProduct(id);

      setProduct(data);

      setProductName(data.productName);

      setCategory(data.category);

      setDescription(data.description);

      setPrice(String(data.price));

      setStock(String(data.stock));

      setVisible(data.visible);
    } catch (error) {
      console.log("LOAD PRODUCT ERROR", error);
    } finally {
      setLoading(false);
    }
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

    setCategories((current) =>
      [...current, categoryOption].sort((a, b) =>
        a.label.localeCompare(b.label)
      )
    );

    setCategory(categoryOption.value);

    setNewCategory("");
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
      {/* Header */}

      <ScreenHeader title="Edit Product" />

      <Divider />

      {/* Content */}

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
          <Input
            label="Product Name"
            value={productName}
            onChangeText={setProductName}
          />

          <Dropdown
            label="Category"
            value={category}
            options={categories}
            placeholder="Select category"
            onSelect={setCategory}
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
              onPress={createCategory}
            />
          </View>

          <Input
            label="Selling Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Input
            label="Stock"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
          />

          <Input
            label="Description"
            variant="textarea"
            value={description}
            onChangeText={setDescription}
          />
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
