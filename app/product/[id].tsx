import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";

import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";

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

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  editProductSchema,
  EditProductForm,
} from "@/schemas/editProductSchema";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

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

  const [hasSaved, setHasSaved] = useState(false);

  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),

    defaultValues: {
      productName: "",
      category: "",
      description: "",
      price: "",
      stock: "",
    },
  });

  useEffect(() => {
    initializeScreen();
  }, []);

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

      reset({
        productName: data.productName,

        category: data.category,

        description: data.description,

        price: String(data.price),

        stock: String(data.stock),
      });

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

      await updateProduct(id, {
        product_name: data.productName.trim(),

        category: data.category,

        description: data.description.trim(),

        price: Number(data.price),

        stock: Number(data.stock),

        visible,
      });

      showToast({
        type: "success",
        title: "Product Updated",
        message: "Changes saved successfully.",
      });

      setHasSaved(true);

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
