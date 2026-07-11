import { View, ScrollView, ActivityIndicator, Alert } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { spacing, theme } from "@/theme";

import { getProduct, updateProduct } from "@/services/product-service";

import { Input } from "@/components/ui/Input";

import type { Product } from "@/types/product";

import { Dropdown } from "@/components/ui/Dropdown";

import { getCategories, createCategory } from "@/services/category-service";

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

  const [categories, setCategories] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();

      setCategories(data.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (error) {
      console.log("LOAD CATEGORIES ERROR", error);
    }
  }

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

  async function handleCreateCategory() {
    if (!newCategory.trim()) {
      return;
    }

    try {
      const category = await createCategory(newCategory);

      setCategories((current) =>
        [...current, category].sort((a, b) => a.label.localeCompare(b.label))
      );

      setCategory(category.value);

      setNewCategory("");
    } catch (error) {
      console.log("CREATE CATEGORY ERROR", error);
    }
  }

  async function handleUpdateProduct() {
    try {
      setSaving(true);

      await updateProduct(id, {
        product_name: productName,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        visible,
      });

      Alert.alert("Success", "Product updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.log("UPDATE PRODUCT ERROR", error);

      Alert.alert(
        "Update Failed",
        "Something went wrong while updating the product."
      );
    } finally {
      setSaving(false);
    }
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
              onPress={handleCreateCategory}
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
          title={saving ? "Saving..." : "Save Changes"}
          variant="primary"
          loading={saving}
          onPress={handleUpdateProduct}
          style={{
            marginTop: spacing.lg,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
