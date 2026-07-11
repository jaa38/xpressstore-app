import { View, ScrollView, ActivityIndicator } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { AppText } from "@/components/ui/AppText";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { spacing, theme } from "@/theme";

import { getProduct, updateProduct } from "@/services/product-service";

import { getCategories, createCategory } from "@/services/category-service";

import { useToast } from "@/hooks/useToast";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

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

  const { showToast } = useToast();

  useEffect(() => {
    initializeScreen();
  }, []);

  async function initializeScreen() {
    try {
      setLoading(true);

      await Promise.all([loadProduct(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  }

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

  async function handleUpdateProduct() {
    try {
      setSaving(true);

      await updateProduct(id, {
        product_name: productName.trim(),

        category,

        description: description.trim(),

        price: Number(price),

        stock: Number(stock),

        visible,
      });

      showToast({
        type: "success",
        title: "Product Updated",
        message: "Changes saved successfully.",
      });

      await loadProduct();
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
      <ScreenHeader title="Edit Product" />

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
          title="Save Changes"
          variant="primary"
          loading={saving}
          disabled={saving}
          onPress={handleUpdateProduct}
          style={{
            marginTop: spacing.lg,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
